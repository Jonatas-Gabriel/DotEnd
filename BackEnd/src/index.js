import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API rodando!' });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
