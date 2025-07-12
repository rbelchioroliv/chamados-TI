
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authMiddleware, adminMiddleware } from './middleware/auth.js';
import { sendRegistrationEmail, sendNewTicketEmailToUser, sendNewTicketEmailToIT, sendStatusUpdateEmail } from './services/emailService.js';

const app = express();
const prisma = new PrismaClient();


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
app.use(express.json());


// --- ROTAS ---

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
      data: { name, username, email, department, password: hashedPassword, role: department === 'IT' ? 'IT' : 'USER' },
    });
    sendRegistrationEmail(newUser);
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
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.post('/api/tickets', authMiddleware, async (req, res) => {
  const { title, description, priority } = req.body;
  const { userId } = req.user;
  if (!title || !description || !priority) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  try {
    const newTicket = await prisma.ticket.create({
      data: { title, description, priority, status: 'REQUESTED', owner: { connect: { id: userId } } },
      include: { owner: { select: { email: true, name: true, department: true } } }
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
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Erro ao buscar chamados:", error);
    res.status(500).json({ error: 'Erro interno ao buscar os chamados.' });
  }
});

app.get('/api/admin/tickets', authMiddleware, adminMiddleware, async (req, res) => {
  const { department, priority } = req.query;
  const whereClause = { status: { not: 'COMPLETED' } };
  if (department) { whereClause.owner = { department: department }; }
  if (priority) { whereClause.priority = priority; }
  try {
    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      include: { owner: { select: { name: true, department: true } } },
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }]
    });
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Erro ao buscar chamados de admin:", error);
    res.status(500).json({ error: 'Erro interno ao buscar os chamados.' });
  }
});

app.patch('/api/admin/tickets/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status, estimatedCompletion } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'O novo status é obrigatório.' });
  }
  const dataToUpdate = { status: status };
  if (status === 'COMPLETED') { dataToUpdate.completedAt = new Date(); }
  if (estimatedCompletion) {
    const parts = estimatedCompletion.split('-');
    dataToUpdate.estimatedCompletion = new Date(parts[0], parts[1] - 1, parts[2]);
  }
  try {
    const updatedTicket = await prisma.ticket.update({
      where: { id: id },
      data: dataToUpdate,
      include: { owner: { select: { email: true, name: true, department: true } } }
    });
    if (updatedTicket.status === 'IN_PROGRESS' || updatedTicket.status === 'COMPLETED') {
      sendStatusUpdateEmail(updatedTicket.owner, updatedTicket);
    }
    res.status(200).json(updatedTicket);
  } catch (error) {
    console.error("Erro ao atualizar chamado:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Chamado não encontrado.' });
    }
    res.status(500).json({ error: 'Erro interno ao atualizar o chamado.' });
  }
});

app.get('/api/admin/tickets/history', authMiddleware, adminMiddleware, async (req, res) => {
  const { year, month, day, page = 1, limit = 10 } = req.query;
  const whereClause = { status: 'COMPLETED' };
  const parsedLimit = parseInt(limit);
  const parsedPage = parseInt(page);
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
    whereClause.completedAt = { gte: startDate, lt: endDate };
  }
  try {
    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      include: { owner: { select: { name: true, department: true } } },
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
      select: { priority: true, ownerId: true },
      orderBy: { priority: 'desc' },
    });
    if (currentTask) {
      res.json({ status: 'OCUPADO', task: { priority: currentTask.priority, ownerId: currentTask.ownerId } });
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
    const userTicket = await prisma.ticket.findFirst({
      where: { ownerId: userId, status: 'REQUESTED' },
      orderBy: { createdAt: 'asc' },
    });
    if (!userTicket) {
      return res.json({ position: null, ticketTitle: null });
    }
    const queue = await prisma.ticket.findMany({
      where: { status: 'REQUESTED' },
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    });
    const position = queue.findIndex(ticket => ticket.id === userTicket.id) + 1;
    res.json({ position, ticketTitle: userTicket.title });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao calcular a posição na fila.' });
  }
});

app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, username: true, email: true, department: true, role: true },
      orderBy: { name: 'asc' },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ error: 'Erro interno ao listar usuários.' });
  }
});

app.delete('/api/admin/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.ticket.deleteMany({ where: { ownerId: id } });
    await prisma.user.delete({ where: { id: id } });
    res.status(204).send();
  } catch (error) {
    console.error(`Erro ao deletar usuário ${id}:`, error);
    res.status(500).json({ error: 'Erro interno ao deletar o usuário.' });
  }
});

app.patch('/api/admin/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { role, password } = req.body;

  const dataToUpdate = {};

  // Adiciona o novo papel ao objeto de atualização, se ele foi fornecido
  if (role) {
    dataToUpdate.role = role;
  }

  // Se uma nova senha foi fornecida, criptografa e adiciona ao objeto
  if (password) {
    if (password.length < 6) {
      return res.status(400).json({ error: 'A nova senha deve ter no mínimo 6 caracteres.' });
    }
    dataToUpdate.password = await bcrypt.hash(password, 10);
  }

  // Verifica se há algo para atualizar
  if (Object.keys(dataToUpdate).length === 0) {
    return res.status(400).json({ error: 'Nenhum dado para atualizar foi fornecido.' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: dataToUpdate,
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error(`Erro ao editar usuário ${id}:`, error);
    res.status(500).json({ error: 'Erro interno ao editar o usuário.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});