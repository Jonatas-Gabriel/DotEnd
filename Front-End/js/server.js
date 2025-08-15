// Importa a função 'createRequire' do módulo 'module' nativo do Node.js
import { createRequire } from 'module';

// Cria uma função 'require' relativa ao arquivo atual
const require = createRequire(import.meta.url);

// Usa a função 'require' que acabamos de criar para carregar o json-server
const jsonServer = require('json-server');

// O restante do seu código continua exatamente igual...
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = 3000;

server.use(middlewares);
server.use(router);

server.listen(port, () => {
  console.log(`DotEnd JSON-Server está rodando em http://localhost:${port}`);
});