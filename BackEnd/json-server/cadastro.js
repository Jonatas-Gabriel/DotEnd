// js/cadastro.js
import { addAsset } from './main.js'; // Importa a função addAsset do main.js

document.addEventListener('DOMContentLoaded', () => {
    const assetForm = document.getElementById('asset-form');

    if (assetForm) {
        assetForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            const assetType = document.getElementById('assetType').value;
            const assetName = document.getElementById('assetName').value;
            const assetDescription = document.getElementById('assetDescription').value;
            const assetModel = document.getElementById('assetModel').value;
            const assetStatus = document.getElementById('assetStatus').value;

            const newAsset = {
                name: assetName,
                description: assetDescription,
                type: assetType, // Usamos o tipo do formulário para o 'type' do objeto
                model: assetModel,
                status: assetStatus
                // Adicione outros campos do formulário aqui
            };

            if (assetType) {
                const addedAsset = addAsset(assetType, newAsset);
                alert(`Equipamento "${addedAsset.name}" (${addedAsset.type}) cadastrado com sucesso! ID: ${addedAsset.id}`);
                assetForm.reset(); // Limpa o formulário
                window.location.href = 'lista_equipamentos.html'; // Redireciona para a lista
            } else {
                alert('Por favor, selecione um tipo de ativo.');
            }
        });
    }
});