import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'equipamentos',
};

const dbPath = path.join(__dirname, 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

async function migrateCollection(connection, collectionName, fields) {
  const items = dbData[collectionName];
  if (!items || !Array.isArray(items)) {
    console.log(`Coleção '${collectionName}' vazia ou inexistente.`);
    return;
  }

  console.log(`Migrando ${collectionName}...`);

  for (const item of items) {
    const values = fields.map(field => item[field] ?? null);
    const placeholders = fields.map(() => '?').join(', ');
    const sql = `INSERT INTO ${collectionName} (${fields.join(', ')}) VALUES (${placeholders})`;

    try {
      await connection.execute(sql, values);
    } catch (err) {
      console.error(`Erro ao inserir na tabela ${collectionName}:`, err);
    }
  }

  console.log(`${collectionName} migrados com sucesso!`);
}

async function migrateData() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Conectado ao MySQL.');

    // Mapeie os campos para cada coleção
    const collections = {
      Computer: ['id', 'name', 'description', 'type', 'status'],
      Printer: ['id', 'name', 'description', 'type', 'status'],
      Projector: ['id', 'name', 'description', 'type', 'status'],
      Monitor: ['id', 'name', 'description', 'type', 'status'],
      Scanner: ['id', 'name', 'description', 'type', 'status'],
      NetworkDevice: ['id', 'name', 'description', 'type', 'status'],
      StorageDevice: ['id', 'name', 'description', 'type', 'status'],
      Accessories: ['id', 'name', 'description', 'type', 'model', 'status'],
    };

    for (const [collectionName, fields] of Object.entries(collections)) {
      await migrateCollection(connection, collectionName, fields);
    }

  } catch (err) {
    console.error('Erro durante a migração:', err);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Conexão fechada.');
    }
  }
}

migrateData();
