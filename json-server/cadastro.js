// js/cadastro.js
import { addAsset } from './main.js'; // Importa a função addAsset do main.js

document.addEventListener('DOMContentLoaded', () => {
    const assetForm = document.getElementById('asset-form');

    if (assetForm) {
        assetForm.addEventListener('submit', async (event) => { // Tornar a função assíncrona
            event.preventDefault(); // Impede o envio padrão do formulário

            const assetType = document.getElementById('assetType').value;
            const assetName = document.getElementById('assetName').value;
            const assetDescription = document.getElementById('assetDescription').value;
            const assetModel = document.getElementById('assetModel').value;
            const assetStatus = document.getElementById('assetStatus').value;

            const newAssetData = {
                name: assetName,
                description: assetDescription,
                // O 'type' do ativo será usado como o endpoint do JSON-Server,
                // mas também incluímos no objeto para consistência dos dados.
                type: assetType,
                model: assetModel,
                status: assetStatus
                // Adicione outros campos do formulário aqui
            };

            if (assetType) {
                try {
                    const addedAsset = await addAsset(assetType, newAssetData); // Chama a função assíncrona
                    alert(`Equipamento "${addedAsset.name}" (${addedAsset.type}) cadastrado com sucesso! ID: ${addedAsset.id}`);
                    assetForm.reset(); // Limpa o formulário
                    window.location.href = 'lista_equipamentos.html'; // Redireciona para a lista
                } catch (error) {
                    console.error("Erro ao cadastrar equipamento:", error);
                    alert("Erro ao cadastrar equipamento. Verifique o console para mais detalhes.");
                }
            } else {
                alert('Por favor, selecione um tipo de ativo.');
            }
        });
    }
});