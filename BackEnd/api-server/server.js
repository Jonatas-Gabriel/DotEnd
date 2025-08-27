// BackEnd/api-server/server.js (VERSÃO FINAL E CORRIGIDA)

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import authMiddleware from './authMiddleware.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
console.log(prisma);
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

// ROTA PARA CADASTRAR UM NOVO EQUIPAMENTO (CORRIGIDA E MAIS SEGURA)
app.post('/api/equipamentos', authMiddleware, async (req, res) => {
  const { type, ...data } = req.body; // Separa o 'type' do resto dos dados

  if (!type || !data.name || !data.status) {
    return res.status(400).json({ message: 'Tipo, nome e status são obrigatórios.' });
  }

  try {
    let newEquipment;
    const equipmentData = {
        name: data.name,
        description: data.description,
        model: data.model,
        status: data.status,
    };
    
    // Abordagem explícita e segura com switch case
    switch (type) {
        case 'Computer':
            newEquipment = await prisma.computer.create({ data: equipmentData });
            break;
        case 'Printer':
            newEquipment = await prisma.printer.create({ data: equipmentData });
            break;
        case 'Projector':
            newEquipment = await prisma.projector.create({ data: equipmentData });
            break;
        case 'Monitor':
            newEquipment = await prisma.monitor.create({ data: equipmentData });
            break;
        case 'Scanner':
            newEquipment = await prisma.scanner.create({ data: equipmentData });
            break;
        case 'NetworkDevice':
            newEquipment = await prisma.networkDevice.create({ data: equipmentData });
            break;
        case 'StorageDevice':
            newEquipment = await prisma.storageDevice.create({ data: equipmentData });
            break;
        case 'Accessories':
            newEquipment = await prisma.accessories.create({ data: equipmentData });
            break;
        default:
            return res.status(400).json({ message: `Tipo de equipamento inválido: ${type}` });
    }
    
    res.status(201).json({ message: 'Equipamento cadastrado com sucesso!', equipment: newEquipment });

  } catch (error) {
    console.error('Erro ao cadastrar equipamento:', error);
    res.status(500).json({ message: 'Erro interno ao cadastrar o equipamento.' });
  }
});

// ROTA PARA LISTAR TODOS OS EQUIPAMENTOS (COM PRISMA)
app.get('/api/equipamentos', authMiddleware, async (req, res) => {
    try {
        const [computers, printers, projectors, monitors, scanners, networkDevices, storageDevices, accessories] = await Promise.all([
            prisma.computer.findMany(),
            prisma.printer.findMany(),
            prisma.projector.findMany(),
            prisma.monitor.findMany(),
            prisma.scanner.findMany(),
            prisma.networkDevice.findMany(),
            prisma.storageDevice.findMany(),
            prisma.accessories.findMany(),
        ]);

        const allEquipments = [
            ...computers.map(item => ({ ...item, type: 'Computer' })),
            ...printers.map(item => ({ ...item, type: 'Printer' })),
            ...projectors.map(item => ({ ...item, type: 'Projector' })),
            ...monitors.map(item => ({ ...item, type: 'Monitor' })),
            ...scanners.map(item => ({ ...item, type: 'Scanner' })),
            ...networkDevices.map(item => ({ ...item, type: 'NetworkDevice' })),
            ...storageDevices.map(item => ({ ...item, type: 'StorageDevice' })),
            ...accessories.map(item => ({ ...item, type: 'Accessories' })),
        ];

        res.json(allEquipments);
    } catch (error) {
        console.error('Erro ao buscar equipamentos:', error);
        res.status(500).json({ message: 'Erro ao buscar equipamentos.' });
    }
});


app.listen(PORT, () => {
  console.log(`Servidor da API a rodar em http://localhost:${PORT}`);
});