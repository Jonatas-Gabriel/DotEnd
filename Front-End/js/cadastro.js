// Front-End/js/cadastro.js (CORRIGIDO)

import { API_URL, getAuthHeaders } from './api.js';

// Esta função precisa de estar disponível. Se ela estiver noutro ficheiro (como auth.js), importe-a.
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 500);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    const assetForm = document.getElementById('asset-form');

    if (assetForm) {
        assetForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const assetType = document.getElementById('assetType').value;
            const assetName = document.getElementById('assetName').value;
            const assetDescription = document.getElementById('assetDescription').value;
            const assetModel = document.getElementById('assetModel').value;
            const assetStatus = document.getElementById('assetStatus').value;

            if (!assetType || !assetName) {
                showToast('Tipo e Nome do ativo são obrigatórios!', 'error');
                return;
            }

            // --- CORREÇÃO APLICADA AQUI ---
            const newAssetData = {
                type: assetType, // A chave DEVE ser 'type' para corresponder ao backend
                name: assetName,
                description: assetDescription,
                model: assetModel,
                status: assetStatus,
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