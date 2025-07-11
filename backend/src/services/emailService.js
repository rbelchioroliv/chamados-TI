// backend/src/services/emailService.js
import nodemailer from 'nodemailer';

// 1. Configuração do "Transportador" de E-mail
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

// 2. Funções Específicas para Cada Tipo de E-mail

/**
 * Envia um e-mail de boas-vindas ao novo usuário.
 */
export async function sendRegistrationEmail(user) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Cadastro Realizado com Sucesso!',
    html: `
      <h1>Bem-vindo(a), ${user.name}!</h1>
      <p>Seu cadastro no Sistema de Chamados de TI foi realizado com sucesso.</p>
      <p>Você já pode fazer login e abrir novos chamados.</p>
      <p>Obrigado!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`E-mail de cadastro enviado para: ${user.email}`);
  } catch (error) {
    console.error(`Erro ao enviar e-mail de cadastro para ${user.email}:`, error);
  }
}

/**
 * Envia um e-mail para o usuário confirmando a abertura de um chamado.
 */
export async function sendNewTicketEmailToUser(user, ticket) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Chamado #${ticket.id.slice(-5)} Criado com Sucesso`,
    html: `
      <h2>Olá, ${user.name},</h2>
      <p>Seu chamado foi registrado com sucesso em nosso sistema.</p>
      <h3>Detalhes do Chamado:</h3>
      <ul>
        <li><strong>ID do Chamado:</strong> #${ticket.id.slice(-5)}</li>
        <li><strong>Título:</strong> ${ticket.title}</li>
        <li><strong>Prioridade:</strong> ${ticket.priority === 'URGENT' ? 'Urgente' : 'Normal'}</li>
      </ul>
      <p>Nossa equipe de TI já foi notificada e atenderá sua solicitação em breve.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`E-mail de novo chamado enviado para o usuário: ${user.email}`);
  } catch (error) {
    console.error(`Erro ao enviar e-mail de novo chamado para ${user.email}:`, error);
  }
}

/**
 * Envia um e-mail para a equipe de TI notificando sobre um novo chamado.
 */
export async function sendNewTicketEmailToIT(user, ticket) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.IT_TEAM_EMAIL,
    subject: `[URGENTE] Novo Chamado de TI Aberto por ${user.name}`.replace('[URGENTE] ', ticket.priority === 'URGENT' ? '[URGENTE] ' : ''),
    html: `
      <h2>Um novo chamado de TI foi aberto.</h2>
      <h3>Detalhes:</h3>
      <ul>
        <li><strong>Solicitante:</strong> ${user.name}</li>
        <li><strong>Setor:</strong> ${user.department}</li>
        <li><strong>ID do Chamado:</strong> #${ticket.id.slice(-5)}</li>
        <li><strong>Título:</strong> ${ticket.title}</li>
        <li><strong>Prioridade:</strong> ${ticket.priority === 'URGENT' ? 'Urgente' : 'Normal'}</li>
        <li><strong>Descrição:</strong><p>${ticket.description}</p></li>
      </ul>
      <p>Por favor, acesse o painel de TI para gerenciar este chamado.</p>
    `,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`E-mail de novo chamado enviado para a equipe de TI.`);
  } catch (error) {
    console.error(`Erro ao enviar e-mail para a equipe de TI:`, error);
  }
}


/**
 * Envia um e-mail para o usuário notificando sobre uma atualização de status.
 */
export async function sendStatusUpdateEmail(user, ticket) {
  const statusText = {
    IN_PROGRESS: "Em Andamento",
    COMPLETED: "Concluído",
  };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Atualização sobre seu Chamado #${ticket.id.slice(-5)}`,
    html: `
      <h2>Olá, ${user.name},</h2>
      <p>Houve uma atualização no seu chamado "<strong>${ticket.title}</strong>".</p>
      <p>Novo status: <strong>${statusText[ticket.status] || ticket.status}</strong></p>
      ${ticket.status === 'COMPLETED' ? '<p>Sua solicitação foi finalizada. Agradecemos o contato!</p>' : '<p>Nossa equipe já está trabalhando na sua solicitação.</p>'}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`E-mail de atualização de status enviado para: ${user.email}`);
  } catch (error) {
    console.error(`Erro ao enviar e-mail de atualização para ${user.email}:`, error);
  }
}