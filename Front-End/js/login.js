// Front-End/js/login.js
import { API_URL } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Erro ao fazer login.');
                }

                // Salva o token no localStorage do navegador
                localStorage.setItem('authToken', data.token);

                alert('Login realizado com sucesso!');
                // Redireciona o usuário para a página de serviços após o login
                window.location.href = 'servicos.html';

            } catch (error) {
                console.error('Falha no login:', error);
                alert(error.message);
            }
        });
    }
});