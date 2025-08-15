// BackEnd/api-server/db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'equipamentos',
  port: process.env.DB_PORT || 3307, // Usando a porta do Docker
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;