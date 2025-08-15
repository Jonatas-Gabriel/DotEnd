// Front-End/js/auth.js
import { getToken } from './api.js';

function checkAuth() {
    const token = getToken();
    // Se não há token e a página não é a de login ou a inicial, redireciona
    if (!token && !window.location.pathname.endsWith('login.html') && !window.location.pathname.endsWith('index.html')) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
    }
}

// Executa a verificação assim que o script é carregado
checkAuth();

// Função de logout
window.logout = function() {
    localStorage.removeItem('authToken');
    alert('Você foi desconectado.');
    window.location.href = 'index.html';
}