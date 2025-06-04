// js/lista_equipamentos.js
import { database, getAssets, updateAsset, deleteAsset } from './main.js'; // Importa o db e funções CRUD

document.addEventListener('DOMContentLoaded', () => {
    const assetListContainer = document.getElementById('asset-list-container');
    const filterTypeSelect = document.getElementById('filterType');
    const editModal = document.getElementById('edit-modal');
    const editAssetForm = document.getElementById('edit-asset-form');
    const cancelEditModalBtn = document.getElementById('cancel-edit-modal');

    let currentEditingAsset = null; // Armazena o ativo que está sendo editado

    // Função para renderizar a lista de ativos
    function renderAssetList(filter = 'All') {
        assetListContainer.innerHTML = ''; // Limpa a lista existente
        let allAssets = [];

        if (filter === 'All') {
            for (const type in database) {
                allAssets = allAssets.concat(getAssets(type));
            }
        } else {
            allAssets = getAssets(filter);
        }

        if (allAssets.length === 0) {
            assetListContainer.innerHTML = '<p>Nenhum equipamento cadastrado para esta categoria.</p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'asset-table'; // Adicione uma classe para estilização via CSS

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
            tbody.appendChild(row);
        });

        assetListContainer.appendChild(table);
    }

    // Event listener para o filtro de tipo
    filterTypeSelect.addEventListener('change', (event) => {
        renderAssetList(event.target.value);
    });

    // Event listener para os botões de Editar e Excluir (delegação de eventos)
    assetListContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-btn') || event.target.closest('.edit-btn')) {
            const btn = event.target.classList.contains('edit-btn') ? event.target : event.target.closest('.edit-btn');
            const id = parseInt(btn.dataset.id);
            const type = btn.dataset.type;
            
            currentEditingAsset = getAssetById(type, id); // Carrega o ativo para edição

            if (currentEditingAsset) {
                document.getElementById('edit-asset-id').value = currentEditingAsset.id;
                document.getElementById('edit-asset-original-type').value = currentEditingAsset.type; // Guarda o tipo original
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

            if (confirm(`Tem certeza que deseja excluir o ativo "${getAssetById(type, id)?.name || 'Este ativo'}" do tipo ${type}?`)) {
                if (deleteAsset(type, id)) {
                    alert('Ativo excluído com sucesso!');
                    renderAssetList(filterTypeSelect.value); // Re-renderiza a lista
                } else {
                    alert('Erro ao excluir ativo ou ativo não encontrado.');
                }
            }
        }
    });

    // Lógica para o formulário de edição do modal
    editAssetForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const id = parseInt(document.getElementById('edit-asset-id').value);
        const originalType = document.getElementById('edit-asset-original-type').value; // Usamos o tipo original

        const updatedData = {
            name: document.getElementById('edit-asset-name').value,
            description: document.getElementById('edit-asset-description').value,
            model: document.getElementById('edit-asset-model').value,
            status: document.getElementById('edit-asset-status').value
        };

        if (updateAsset(originalType, id, updatedData)) {
            alert('Ativo atualizado com sucesso!');
            editModal.style.display = 'none'; // Esconde o modal
            renderAssetList(filterTypeSelect.value); // Re-renderiza a lista
        } else {
            alert('Erro ao atualizar ativo ou ativo não encontrado.');
        }
    });

    // Botão Cancelar no modal de edição
    cancelEditModalBtn.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    // Renderiza a lista inicial ao carregar a página
    renderAssetList('All');
});