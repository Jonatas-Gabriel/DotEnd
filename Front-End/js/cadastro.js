import { api } from './api.js'; 
// Importa o módulo 'api' que provavelmente contém métodos para interagir com backend (ex: adicionar ativos)

/*
 * Aguarda o carregamento completo do DOM para garantir que os elementos estejam disponíveis
 */
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona o formulário com id 'asset-form'
    const assetForm = document.getElementById('asset-form');

    // Se o formulário existir na página
    if (assetForm) {
        // Adiciona um listener para o evento de submit do formulário
        assetForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Previna o comportamento padrão de recarregar a página

            // Coleta os valores dos campos do formulário
            const assetType = document.getElementById('assetType').value;
            const assetName = document.getElementById('assetName').value;
            const assetDescription = document.getElementById('assetDescription').value;
            const assetModel = document.getElementById('assetModel').value;
            const assetStatus = document.getElementById('assetStatus').value;

            // Validação simples: tipo e nome são obrigatórios
            if (!assetType || !assetName) {
                alert('Tipo e Nome do ativo são obrigatórios!');
                return; // Para a execução se algum campo obrigatório estiver vazio
            }

            // Monta o objeto com os dados do novo ativo a ser cadastrado
            const newAssetData = {
                name: assetName,
                description: assetDescription,
                model: assetModel,
                status: assetStatus,
            };

            try {
                // Chama a função assíncrona para adicionar o ativo via API
                await api.addAsset(assetType, newAssetData);

                // Exibe mensagem de sucesso
                alert('Equipamento cadastrado com sucesso!');

                // Reseta o formulário para os valores iniciais
                assetForm.reset();

                // Redireciona o usuário para a página da lista de equipamentos
                window.location.href = 'lista_equipamentos.html';
            } catch (error) {
                // Caso ocorra erro, loga no console e alerta o usuário
                console.error('Erro ao cadastrar:', error);
                alert('Falha ao cadastrar o equipamento.');
            }
        });
    }
});
