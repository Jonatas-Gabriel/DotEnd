// Front-End/js/cadastro.js (CORRIGIDO PARA O NOVO SCHEMA)

import { API_URL, getAuthHeaders } from './api.js';

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { toast.classList.add('show'); }, 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => { document.body.removeChild(toast); }, 500);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    const assetForm = document.getElementById('asset-form');

    if (assetForm) {
        assetForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // O 'assetType' do formulário agora é a 'category'
            const category = document.getElementById('assetType').value;
            const name = document.getElementById('assetName').value;
            const description = document.getElementById('assetDescription').value;
            const model = document.getElementById('assetModel').value;
            // O status do formulário agora precisa de corresponder ao enum (Active, Inactive, Maintenance)
            const status = document.getElementById('assetStatus').value;
            // O campo 'type' (Desktop, Laptop) não está no formulário, então enviaremos um valor padrão
            const type = 'Other';

            if (!category || !name) {
                showToast('Categoria e Nome do ativo são obrigatórios!', 'error');
                return;
            }

            const newAssetData = {
                category,
                name,
                description,
                model,
                status,
                type,
            };

            try {
                const response = await fetch(`${API_URL}/api/equipamentos`, {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(newAssetData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Falha ao cadastrar o equipamento.');
                }

                showToast('Equipamento cadastrado com sucesso!');
                assetForm.reset();
                setTimeout(() => {
                    window.location.href = 'listar_equipamentos.html';
                }, 1500);

            } catch (error) {
                console.error('Erro ao cadastrar:', error);
                showToast(error.message, 'error');
            }
        });
    }
});