import { api } from './api.js';

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
                alert('Tipo e Nome do ativo são obrigatórios!');
                return;
            }

            const newAssetData = {
                name: assetName,
                description: assetDescription,
                model: assetModel,
                status: assetStatus,
            };

            try {
                await api.addAsset(assetType, newAssetData);
                alert('Equipamento cadastrado com sucesso!');
                assetForm.reset();
                window.location.href = 'lista_equipamentos.html'; // Redireciona para a lista
            } catch (error) {
                console.error('Erro ao cadastrar:', error);
                alert('Falha ao cadastrar o equipamento.');
            }
        });
    }
});