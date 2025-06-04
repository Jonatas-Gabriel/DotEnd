// js/lista_equipamentos.js
import { getAssets, getAssetById, updateAsset, deleteAsset } from './main.js'; // Importa as funções CRUD

document.addEventListener('DOMContentLoaded', () => {
    const assetListContainer = document.getElementById('asset-list-container');
    const filterTypeSelect = document.getElementById('filterType');
    const editModal = document.getElementById('edit-modal');
    const editAssetForm = document.getElementById('edit-asset-form');
    const cancelEditModalBtn = document.getElementById('cancel-edit-modal');

    let currentEditingAsset = null; // Armazena o ativo que está sendo editado

    // Função para renderizar a lista de ativos
    async function renderAssetList(filter = 'All') { // Tornar a função assíncrona
        assetListContainer.innerHTML = ''; // Limpa a lista existente
        let allAssets = [];

        try {
            if (filter === 'All') {
                // Obter a lista de tipos de ativos que o JSON-Server pode ter
                // Uma forma mais robusta seria ter um endpoint de "tipos" no backend.
                // Por agora, vamos usar uma lista fixa para os tipos presentes no seu db.json.
                const allTypes = [
                    'Computer', 'Printer', 'Projector', 'Monitor', 'Scanner',
                    'NetworkDevice', 'StorageDevice', 'Accessories'
                ];
                for (const type of allTypes) {
                    const assetsOfType = await getAssets(type);
                    allAssets = allAssets.concat(assetsOfType.map(a => ({...a, type: type}))); // Adiciona o tipo ao objeto
                }
            } else {
                allAssets = await getAssets(filter);
                allAssets = allAssets.map(a => ({...a, type: filter})); // Garante que o tipo está no objeto
            }
        } catch (error) {
            console.error('Erro ao carregar ativos:', error);
            assetListContainer.innerHTML = '<p>Erro ao carregar equipamentos. Por favor, tente novamente.</p>';
            return;
        }

        if (allAssets.length === 0) {
            assetListContainer.innerHTML = '<p>Nenhum equipamento cadastrado para esta categoria.</p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'asset-table';

        // Cabeçalho da tabela
        table.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Modelo</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const tbody = table.querySelector('tbody');

        allAssets.forEach(asset => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${asset.id}</td>
                <td>${asset.type || 'N/A'}</td>
                <td>${asset.name}</td>
                <td>${asset.description || 'N/A'}</td>
                <td>${asset.model || 'N/A'}</td>
                <td>${asset.status}</td>
                <td>
                    <button class="btn btn-light btn-sm edit-btn" data-id="${asset.id}" data-type="${asset.type}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-secondary btn-sm delete-btn" data-id="${asset.id}" data-type="${asset.type}" style="margin-left: 5px;">
                        <i class="fas fa-trash-alt"></i> Excluir
                    </button>
                </td>
            `;
            // Adiciona data-label para responsividade da tabela
            row.querySelectorAll('td').forEach(td => {
                const header = table.querySelector(`th:nth-child(${td.cellIndex + 1})`).textContent;
                td.setAttribute('data-label', header);
            });
            tbody.appendChild(row);
        });

        assetListContainer.appendChild(table);
    }

    // Event listener para o filtro de tipo
    filterTypeSelect.addEventListener('change', (event) => {
        renderAssetList(event.target.value);
    });

    // Event listener para os botões de Editar e Excluir (delegação de eventos)
    assetListContainer.addEventListener('click', async (event) => { // Tornar assíncrona
        if (event.target.classList.contains('edit-btn') || event.target.closest('.edit-btn')) {
            const btn = event.target.classList.contains('edit-btn') ? event.target : event.target.closest('.edit-btn');
            const id = parseInt(btn.dataset.id);
            const type = btn.dataset.type;
            
            try {
                currentEditingAsset = await getAssetById(type, id); // Carrega o ativo para edição
            } catch (error) {
                console.error("Erro ao buscar ativo para edição:", error);
                alert("Não foi possível carregar o ativo para edição.");
                return;
            }

            if (currentEditingAsset) {
                document.getElementById('edit-asset-id').value = currentEditingAsset.id;
                document.getElementById('edit-asset-original-type').value = currentEditingAsset.type;
                document.getElementById('edit-asset-name').value = currentEditingAsset.name;
                document.getElementById('edit-asset-description').value = currentEditingAsset.description || '';
                document.getElementById('edit-asset-model').value = currentEditingAsset.model || '';
                document.getElementById('edit-asset-status').value = currentEditingAsset.status;
                
                editModal.style.display = 'flex'; // Exibe o modal
            } else {
                alert('Ativo não encontrado para edição.');
            }
        }

        if (event.target.classList.contains('delete-btn') || event.target.closest('.delete-btn')) {
            const btn = event.target.classList.contains('delete-btn') ? event.target : event.target.closest('.delete-btn');
            const id = parseInt(btn.dataset.id);
            const type = btn.dataset.type;

            if (confirm(`Tem certeza que deseja excluir o ativo "${(await getAssetById(type, id))?.name || 'Este ativo'}" do tipo ${type}?`)) { // Confirmação síncrona, mas a busca do nome é assíncrona
                try {
                    if (await deleteAsset(type, id)) { // Espera a exclusão
                        alert('Ativo excluído com sucesso!');
                        renderAssetList(filterTypeSelect.value); // Re-renderiza a lista
                    } else {
                        alert('Erro ao excluir ativo ou ativo não encontrado.');
                    }
                } catch (error) {
                    console.error("Erro ao excluir ativo:", error);
                    alert("Erro ao excluir ativo. Verifique o console para mais detalhes.");
                }
            }
        }
    });

    // Lógica para o formulário de edição do modal
    editAssetForm.addEventListener('submit', async (event) => { // Tornar assíncrona
        event.preventDefault();

        const id = parseInt(document.getElementById('edit-asset-id').value);
        const originalType = document.getElementById('edit-asset-original-type').value;

        const updatedData = {
            id: id, // Inclua o ID para o PUT
            name: document.getElementById('edit-asset-name').value,
            description: document.getElementById('edit-asset-description').value,
            model: document.getElementById('edit-asset-model').value,
            status: document.getElementById('edit-asset-status').value,
            type: originalType // Garante que o tipo seja mantido, pois o PUT substitui o recurso
        };

        try {
            if (await updateAsset(originalType, id, updatedData)) { // Espera a atualização
                alert('Ativo atualizado com sucesso!');
                editModal.style.display = 'none'; // Esconde o modal
                renderAssetList(filterTypeSelect.value); // Re-renderiza a lista
            } else {
                alert('Erro ao atualizar ativo ou ativo não encontrado.');
            }
        } catch (error) {
            console.error("Erro ao atualizar ativo:", error);
            alert("Erro ao atualizar ativo. Verifique o console para mais detalhes.");
        }
    });

    // Botão Cancelar no modal de edição
    cancelEditModalBtn.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    // Renderiza a lista inicial ao carregar a página
    renderAssetList('All');
});