
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authMiddleware, adminMiddleware } from './middleware/auth.js';
import { sendRegistrationEmail, sendNewTicketEmailToUser, sendNewTicketEmailToIT, sendStatusUpdateEmail } from './services/emailService.js';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const allowedOrigins = [
  'https://chamados-ti.vercel.app', 
  'http://localhost:5173'           
];

const corsOptions = {
  origin: function (origin, callback) {
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Acesso não permitido pelo CORS'));
    }
  },
};

app.use(cors(corsOptions));

app.post('/api/register', async (req, res) => {
  const { name, username, email, department, password } = req.body;

  if (!name || !username || !email || !department || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Email ou nome de usuário já existe.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        department,
        password: hashedPassword,
      },
    });

    // --- A MUDANÇA ESTÁ AQUI ---
    // Chamamos a função para enviar o e-mail de boas-vindas.
    // Não usamos 'await' para que o usuário não precise esperar o envio do e-mail para receber a resposta.
    sendRegistrationEmail(newUser);
    // --- FIM DA MUDANÇA ---

    console.log(`Usuário ${username} cadastrado com sucesso!`);

    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json(userWithoutPassword);

  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: 'Credenciais inválidas.' }); // Usuário não encontrado
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas.' }); // Senha incorreta
    }

    // Se o login for válido, gere um token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role }, // Informações que queremos no token
      process.env.JWT_SECRET, // Nossa chave secreta do .env
      { expiresIn: '8h' } // Tempo de expiração do token
    );

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      user: userWithoutPassword,
      token,
    });

  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.post('/api/tickets', authMiddleware, async (req, res) => {
  const { title, description, priority } = req.body;
  const { userId } = req.user; // Obtemos o ID do usuário do token JWT, injetado pelo middleware

  if (!title || !description || !priority) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const newTicket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority, 
        status: 'REQUESTED',
        owner: {
          connect: { id: userId }, 
        },
      },
      include: {
        owner: { 
          select: { email: true, name: true, department: true }
        }
      }
    });

    sendNewTicketEmailToUser(newTicket.owner, newTicket);
    sendNewTicketEmailToIT(newTicket.owner, newTicket);

    console.log(`Novo chamado "${title}" criado pelo usuário ${newTicket.owner.name}`);

    res.status(201).json(newTicket);
  } catch (error) {
    console.error("Erro ao criar chamado:", error);
    res.status(500).json({ error: 'Erro interno ao criar o chamado.' });
  }
});

app.get('/api/tickets', authMiddleware, async (req, res) => {
  const { userId } = req.user;

  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        ownerId: userId, // Filtra os chamados para retornar apenas os do usuário logado
      },
      orderBy: {
        createdAt: 'desc', // Ordena pelos mais recentes primeiro
      },
    });

    res.status(200).json(tickets);
  } catch (error) {
    console.error("Erro ao buscar chamados:", error);
    res.status(500).json({ error: 'Erro interno ao buscar os chamados.' });
  }
});

app.get('/api/admin/tickets', authMiddleware, adminMiddleware, async (req, res) => {
  const { department, priority } = req.query; // Pega os filtros da URL

  const whereClause = {}; // Objeto de filtro dinâmico para o Prisma

  if (department) {
    whereClause.owner = { department: department };
  }
  if (priority) {
    whereClause.priority = priority;
  }

  // Vamos buscar apenas os chamados que não estão concluídos
  whereClause.status = {
    not: 'COMPLETED'
  };

  try {
    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      include: {
        owner: { // Inclui os dados do usuário em cada chamado
          select: { name: true, department: true }
        }
      },
      orderBy: [ // Ordena por prioridade (urgente primeiro) e depois por data
        { priority: 'desc' }, // 'URGENT' vem antes de 'NORMAL'
        { createdAt: 'asc' }
      ]
    });

    res.status(200).json(tickets);
  } catch (error) {
    console.error("Erro ao buscar chamados de admin:", error);
    res.status(500).json({ error: 'Erro interno ao buscar os chamados.' });
  }
});

app.patch('/api/admin/tickets/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params; // Pega o ID do chamado da URL
  const { status, estimatedCompletion } = req.body; // Pega o novo status do corpo da requisição

  if (!status) {
    return res.status(400).json({ error: 'O novo status é obrigatório.' });
  }

  const dataToUpdate = {
    status: status,
  };

  // Se o chamado estiver sendo concluído, adiciona a data de conclusão
  if (status === 'COMPLETED') {
    dataToUpdate.completedAt = new Date();
  }

  // Se uma estimativa for fornecida, atualize-a
  if (estimatedCompletion) {
    // Corrige o problema do fuso horário tratando a data como local
    const parts = estimatedCompletion.split('-'); // Ex: '2025-07-11' vira ['2025', '07', '11']
    // Cria a data usando os componentes, o que força o JS a usar o fuso horário local
    dataToUpdate.estimatedCompletion = new Date(parts[0], parts[1] - 1, parts[2]);
  }

  try {
    const updatedTicket = await prisma.ticket.update({
      where: { id: id },
      data: dataToUpdate,
      include: { 
        owner: {
          select: { name: true, department: true }
        }
      }
    });

    if (updatedTicket.status === 'IN_PROGRESS' || updatedTicket.status === 'COMPLETED') {
      sendStatusUpdateEmail(updatedTicket.owner, updatedTicket);
    }

    res.status(200).json(updatedTicket);

   
  } catch (error) {
    console.error("Erro ao atualizar chamado:", error);
    // Verifica se o erro é porque o chamado não foi encontrado
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Chamado não encontrado.' });
    }
    res.status(500).json({ error: 'Erro interno ao atualizar o chamado.' });
  }
});

app.get('/api/admin/tickets/history', authMiddleware, adminMiddleware, async (req, res) => {
  // Filtros de data e paginação
  const { year, month, day, page = 1, limit = 10 } = req.query;

  const whereClause = { status: 'COMPLETED' };
  const parsedLimit = parseInt(limit);
  const parsedPage = parseInt(page);

  // Lógica para construir o filtro de data
  if (year) {
    const startDate = new Date(parseInt(year), month ? parseInt(month) - 1 : 0, day ? parseInt(day) : 1);
    let endDate;

    if (day) {
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);
    } else if (month) {
      endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1);
    } else {
      endDate = new Date(parseInt(year) + 1, 0, 1);
    }

    whereClause.completedAt = {
      gte: startDate,
      lt: endDate,
    };
  }

  try {
    // Faz duas chamadas: uma para os dados paginados, outra para o total
    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      include: {
        owner: { select: { name: true, department: true } }
      },
      orderBy: { completedAt: 'desc' },
      skip: (parsedPage - 1) * parsedLimit,
      take: parsedLimit,
    });

    const totalTickets = await prisma.ticket.count({ where: whereClause });

    res.status(200).json({ tickets, total: totalTickets });
  } catch (error) {
    console.error("Erro ao buscar histórico de chamados:", error);
    res.status(500).json({ error: 'Erro interno ao buscar o histórico.' });
  }
});

app.get('/api/it-status', authMiddleware, async (req, res) => {
  try {
    const currentTask = await prisma.ticket.findFirst({
      where: { status: 'IN_PROGRESS' },
      // MUDANÇA: Agora selecionamos a prioridade E o ID do dono
      select: { priority: true, ownerId: true },
      orderBy: { priority: 'desc' },
    });

    if (currentTask) {
      // Resposta agora contém a prioridade e o ownerId
      res.json({
        status: 'OCUPADO',
        task: {
          priority: currentTask.priority,
          ownerId: currentTask.ownerId,
        },
      });
    } else {
      res.json({ status: 'DISPONIVEL' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar status do TI.' });
  }
});

app.get('/api/tickets/my-position', authMiddleware, async (req, res) => {
  const { userId } = req.user;

  try {
    // 1. Encontra o chamado mais antigo do usuário que ainda está na fila
    const userTicket = await prisma.ticket.findFirst({
      where: {
        ownerId: userId,
        status: 'REQUESTED',
      },
      orderBy: { createdAt: 'asc' },
    });

    if (!userTicket) {
      // Se o usuário não tem chamados na fila, retorna nulo
      return res.json({ position: null, ticketTitle: null });
    }

    // 2. Busca todos os chamados que estão na fila, na ordem de prioridade
    const queue = await prisma.ticket.findMany({
      where: { status: 'REQUESTED' },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' },
      ],
    });

    // 3. Encontra a posição (índice + 1) do chamado do usuário na fila geral
    const position = queue.findIndex(ticket => ticket.id === userTicket.id) + 1;

    res.json({ position, ticketTitle: userTicket.title });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao calcular a posição na fila.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});