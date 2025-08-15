import { API_URL, getAuthHeaders } from './api.js';

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
    const response = await fetch(`${API_URL}/api/equipamentos`, {
        method: 'POST',
        headers: getAuthHeaders(), // <<-- IMPORTANTE!
        body: JSON.stringify(newAssetData)
    });

    if (!response.ok) throw new Error('Falha ao cadastrar.');

    alert('Equipamento cadastrado com sucesso!');
    // ... resto da lógica de sucesso
} catch (error) {
    alert(error.message);
}
        });
    }
});
