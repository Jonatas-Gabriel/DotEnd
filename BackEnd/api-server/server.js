// BackEnd/api-server/server.js (VERSÃO FINAL ALINHADA COM O SCHEMA)

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto'; // Para gerar IDs únicos
import dotenv from 'dotenv';
import authMiddleware from './authMiddleware.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// --- ROTAS DE AUTENTICAÇÃO ---
app.post('/auth/register', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, email },
    });
    res.status(201).json({ message: 'Usuário registado com sucesso!', userId: user.id });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Usuário ou email já existe.' });
    }
    console.error('Erro no registo:', error);
    res.status(500).json({ message: 'Erro ao registar usuário.' });
  }
});

app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
    }
    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return res.status(401).json({ message: 'Credenciais inválidas.' });
        
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) return res.status(401).json({ message: 'Credenciais inválidas.' });

        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ message: 'Login bem-sucedido!', token });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

// --- ROTAS PROTEGIDAS PARA EQUIPAMENTOS ---

// ROTA PARA CADASTRAR UM NOVO EQUIPAMENTO (CORRIGIDA PARA O NOVO SCHEMA)
app.post('/api/equipamentos', authMiddleware, async (req, res) => {
  const { category, name, description, model, status, type } = req.body;

  if (!category || !name || !status) {
    return res.status(400).json({ message: 'Categoria, nome e status são obrigatórios.' });
  }

  try {
    const newEquipment = await prisma.equipment.create({
      data: {
        id: randomUUID(), // Gera um ID único, como o schema espera
        category, // Ex: "Computer", "Printer" (deve corresponder ao enum)
        name,
        description,
        model,
        status, // Ex: "Active", "Maintenance" (deve corresponder ao enum)
        type,   // Ex: "Desktop", "Laptop" (deve corresponder ao enum)
      },
    });
    res.status(201).json({ message: 'Equipamento cadastrado com sucesso!', equipment: newEquipment });

  } catch (error) {
    console.error('Erro ao cadastrar equipamento:', error);
    // Erro comum do Prisma se um valor de enum for inválido
    if (error.code === 'P2002' || error.message.includes('enum')) {
        return res.status(400).json({ message: 'Valor inválido para categoria, tipo ou status.' });
    }
    res.status(500).json({ message: 'Erro interno ao cadastrar o equipamento.' });
  }
});

// ROTA PARA LISTAR TODOS OS EQUIPAMENTOS (CORRIGIDA PARA O NOVO SCHEMA)
app.get('/api/equipamentos', authMiddleware, async (req, res) => {
    try {
        const allEquipments = await prisma.equipment.findMany();
        res.json(allEquipments);
    } catch (error) {
        console.error('Erro ao buscar equipamentos:', error);
        res.status(500).json({ message: 'Erro ao buscar equipamentos.' });
    }
});


app.listen(PORT, () => {
  console.log(`Servidor da API a rodar em http://localhost:${PORT}`);
});