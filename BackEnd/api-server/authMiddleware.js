// BackEnd/api-server/authMiddleware.js
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // O token geralmente é enviado no header 'Authorization' no formato "Bearer TOKEN"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifica se o token é válido usando a mesma chave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adiciona os dados do usuário (ex: { userId: 1, ... }) à requisição
    next(); // Se o token for válido, permite que a requisição continue
  } catch (error) {
    res.status(403).json({ message: 'Token inválido ou expirado.' });
  }
};

export default authMiddleware;