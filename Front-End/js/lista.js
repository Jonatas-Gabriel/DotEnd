import { api } from './api.js';
import { API_URL, getAuthHeaders } from './api.js';


document.addEventListener('DOMContentLoaded', () => {
    // Procura pelo elemento usando seu ID específico. É mais rápido e seguro.
    const assetListContainer = document.getElementById('asset-list-container');

    // Se o elemento não for encontrado no HTML, o script para e avisa no console.
    if (!assetListContainer) {
        console.error('ERRO CRÍTICO: Não foi possível encontrar o elemento com id="asset-list-container" no arquivo HTML.');
        return;
    }

    // Função para carregar e exibir os ativos
    async function loadAssets() {
    assetListContainer.innerHTML = '<p>Carregando equipamentos...</p>';
    try {
        const response = await fetch(`${API_URL}/api/equipamentos`, {
            headers: getAuthHeaders() // <<-- IMPORTANTE!
        });

        if (!response.ok) {
            // Se o token for inválido, o servidor retornará 401 ou 403
            if (response.status === 401 || response.status === 403) {
               window.location.href = 'login.html'; // Redireciona para o login
            }
            throw new Error('Falha ao carregar dados.');
        }

        const assets = await response.json();
        renderAssetList(assets);
    } catch (error) {
        console.error('Erro ao carregar equipamentos:', error);
        // ... resto da função de erro
    }
}


    // Função para renderizar a lista de ativos em uma tabela
    function renderAssetList(assets) {
        assetListContainer.innerHTML = ''; // Limpa o conteúdo (ex: "Carregando...")

        if (assets.length === 0) {
            assetListContainer.innerHTML = '<p>Nenhum equipamento cadastrado.</p>';
            return;
        }

        const table = createTable(assets);
        assetListContainer.appendChild(table);

        // Adiciona o evento de clique para cada botão de exclusão
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    }

    // Função para lidar com o clique no botão de exclusão
    async function handleDelete(event) {
        const { assetId, assetType } = event.target.dataset;

        if (confirm(`Tem certeza que deseja excluir o ativo do tipo "${assetType}"?`)) {
            try {
                await api.deleteAsset(assetType, assetId);
                alert('Ativo excluído com sucesso!');
                loadAssets(); // Recarrega a lista para refletir a exclusão
            } catch (error) {
                alert('Falha ao excluir o ativo.');
                console.error(error);
            }
        }
    }

    // Função para criar a estrutura da tabela HTML
    function createTable(assets) {
        const table = document.createElement('table');
        table.className = 'asset-table';

        table.innerHTML = `
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Status</th>
                    <th>Descrição</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${assets.map(asset => `
                    <tr>
                        <td data-label="Nome">${asset.name}</td>
                        <td data-label="Tipo">${asset.type}</td>
                        <td data-label="Status">${asset.status}</td>
                        <td data-label="Descrição">${asset.description || '-'}</td>
                        <td data-label="Ações">
                            <button class="btn btn-secondary btn-sm delete-btn" data-asset-id="${asset.id}" data-asset-type="${asset.type}">
                                Excluir
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        return table;
    }

    // Inicia o processo carregando os ativos
    loadAssets();
});
