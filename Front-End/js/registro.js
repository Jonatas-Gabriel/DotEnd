// Front-End/js/registro.js
import { API_URL } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Validação simples no lado do cliente
            if (password !== confirmPassword) {
                alert('As senhas não coincidem!');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await response.json();

                if (!response.ok) {
                    // Lança um erro com a mensagem vinda da API (ex: "Usuário já existe")
                    throw new Error(data.message || 'Ocorreu um erro no registro.');
                }

                alert('Usuário registrado com sucesso! Você será redirecionado para a página de login.');
                
                // Redireciona para o login após o sucesso
                window.location.href = 'login.html';

            } catch (error) {
                console.error('Falha no registro:', error);
                alert(error.message); // Exibe a mensagem de erro específica da API
            }
        });
    }
});