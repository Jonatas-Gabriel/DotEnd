// Front-End/js/api.js

// Apague o conteúdo antigo e substitua por este:
export const API_URL = 'http://localhost:4000'; // URL do nosso novo backend

// Função auxiliar para obter o token salvo no navegador
export function getToken() {
  return localStorage.getItem('authToken');
}

// Função auxiliar para criar os headers com o token de autorização
export function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}