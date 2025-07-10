// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso não autorizado. Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adiciona os dados do usuário (ex: userId) ao objeto da requisição
    next(); // Passa para a próxima etapa (a rota)
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'IT') {
    return res.status(403).json({ error: 'Acesso negado. Rota exclusiva para administradores de TI.' });
  }
  next();
};