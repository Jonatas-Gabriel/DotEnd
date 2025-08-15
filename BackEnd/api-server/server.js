// BackEnd/api-server/server.js
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db.js';
import dotenv from 'dotenv';
import authMiddleware from './authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors()); // Habilita o CORS para todas as rotas
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// --- ROTAS DE AUTENTICAÇÃO ---

// Rota de Registro de Usuário
app.post('/auth/register', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }

  try {
    // Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10); // 10 é o "custo" do hash

    const [result] = await pool.query(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email]
    );

    res.status(201).json({ message: 'Usuário registrado com sucesso!', userId: result.insertId });
  } catch (error) {
    // Código 'ER_DUP_ENTRY' para entradas duplicadas (usuário ou email já existem)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Usuário ou email já existe.' });
    }
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário.' });
  }
});

// Rota de Login de Usuário
app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
    }

    try {
        // Busca o usuário no banco de dados
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' }); // Usuário não encontrado
        }

        // Compara a senha enviada com a senha criptografada no banco
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' }); // Senha incorreta
        }

        // Se as credenciais estiverem corretas, gera um Token JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expira em 1 hora
        );

        res.json({ message: 'Login bem-sucedido!', token });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

// --- ROTAS PROTEGIDAS PARA EQUIPAMENTOS ---
// Todas as rotas abaixo desta linha exigirão um token válido

// Rota para buscar TODOS os equipamentos de TODAS as tabelas
app.get('/api/equipamentos', authMiddleware, async (req, res) => {
  try {
    const tabelas = ['Computer', 'Printer', 'Monitor', 'Projector', 'Scanner', 'NetworkDevice', 'StorageDevice', 'Accessories'];
    let todosOsEquipamentos = [];

    for (const tabela of tabelas) {
      const [rows] = await pool.query(`SELECT *, '${tabela}' as type FROM ${tabela}`);
      todosOsEquipamentos = todosOsEquipamentos.concat(rows);
    }

    res.json(todosOsEquipamentos);
  } catch (error) {
    console.error('Erro ao buscar equipamentos:', error);
    res.status(500).json({ message: 'Erro ao buscar equipamentos.' });
  }
});

// Rota para cadastrar um novo equipamento
app.post('/api/equipamentos', authMiddleware, async (req, res) => {
  const { type, name, description, model, status } = req.body;
  
  if (!type || !name || !status) {
      return res.status(400).json({ message: 'Tipo, nome e status são obrigatórios.' });
  }
  
  try {
      const tabela = type; // O tipo corresponde ao nome da tabela
      // Cuidado: Esta abordagem é simples mas vulnerável a SQL Injection se 'type' não for validado.
      // Para um projeto de produção, valide se 'tabela' é um dos valores esperados.
      const [result] = await pool.query(
          `INSERT INTO ?? (name, description, model, status) VALUES (?, ?, ?, ?)`,
          [tabela, name, description, model, status]
      );
      res.status(201).json({ message: 'Equipamento cadastrado com sucesso!', id: result.insertId });
  } catch (error) {
      console.error('Erro ao cadastrar equipamento:', error);
      res.status(500).json({ message: 'Erro ao cadastrar equipamento.' });
  }
});

// Adicione aqui as rotas para DELETAR e ALOCAR no futuro...

// --- FIM DAS ROTAS DE AUTENTICAÇÃO ---

app.listen(PORT, () => {
  console.log(`Servidor da API rodando em http://localhost:${PORT}`);
});