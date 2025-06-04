// js/main.js
import { initialDatabase } from './db.js'; // Importa os dados iniciais

// Função para obter dados do localStorage ou inicializar com dados padrão
function getDatabase() {
    const storedData = localStorage.getItem('itAssetsDatabase');
    if (storedData) {
        return JSON.parse(storedData);
    }
    // Se não houver dados no localStorage, use os dados iniciais e salve-os
    localStorage.setItem('itAssetsDatabase', JSON.stringify(initialDatabase));
    return initialDatabase;
}

// Função para salvar o estado atual do banco de dados no localStorage
function saveDatabase(db) {
    localStorage.setItem('itAssetsDatabase', JSON.stringify(db));
}

let database = getDatabase(); // Carrega o banco de dados

// --- Funções CRUD (simuladas com localStorage) ---

// READ: Obter todos os ativos de um tipo específico
export function getAssets(type) {
    return database[type] || [];
}

// READ: Obter um ativo específico por tipo e ID
export function getAssetById(type, id) {
    const assets = database[type];
    if (assets) {
        return assets.find(asset => asset.id === id);
    }
    return null;
}

// CREATE: Adicionar um novo ativo
export function addAsset(type, newAssetData) {
    if (!database[type]) {
        database[type] = [];
    }
    // Gera um novo ID simples (em um backend, o BD faria isso)
    const newId = database[type].length > 0 ? Math.max(...database[type].map(a => a.id)) + 1 : 1;
    const assetToAdd = { id: newId, ...newAssetData };
    database[type].push(assetToAdd);
    saveDatabase(database); // Salva a alteração no localStorage
    return assetToAdd;
}

// UPDATE: Atualizar um ativo existente
export function updateAsset(type, id, updates) {
    const assets = database[type];
    if (assets) {
        const index = assets.findIndex(asset => asset.id === id);
        if (index !== -1) {
            Object.assign(assets[index], updates);
            saveDatabase(database); // Salva a alteração no localStorage
            return assets[index];
        }
    }
    return null; // Ativo não encontrado
}

// DELETE: Excluir um ativo
export function deleteAsset(type, id) {
    const assets = database[type];
    if (assets) {
        const initialLength = assets.length;
        database[type] = assets.filter(asset => asset.id !== id);
        if (database[type].length < initialLength) {
            saveDatabase(database); // Salva a alteração no localStorage
            return true; // Excluído com sucesso
        }
    }
    return false; // Ativo não encontrado
}

// --- Funções de inicialização e eventos globais ---

document.addEventListener('DOMContentLoaded', () => {
    // Atualiza o ano no footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Lógica para o formulário de contato (se houver)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Mensagem enviada com sucesso! (Funcionalidade de envio real requer backend)');
            contactForm.reset();
        });
    }

    // Exemplo de como você renderizaria os cards de recursos (seção #recursos)
    // Usaremos os dados da categoria 'Computer' ou similar para popular.
    const dynamicFeaturesContainer = document.getElementById('dynamic-features-cards');
    if (dynamicFeaturesContainer) {
        const categories = Object.keys(database); // Pega todas as categorias de ativos
        
        dynamicFeaturesContainer.innerHTML = ''; // Limpa o conteúdo existente

        categories.forEach(categoryKey => {
            const assetsOfType = getAssets(categoryKey);
            if (assetsOfType.length > 0) {
                 const firstAsset = assetsOfType[0]; // Pega o primeiro ativo de cada categoria para representar
                 const card = document.createElement('div');
                 card.className = 'feature-card';
                 card.innerHTML = `
                     <div class="feature-icon"><i class="fas fa-desktop"></i></div> <h3>${categoryKey}s</h3>
                     <p>Gerencie ${assetsOfType.length} ${categoryKey.toLowerCase()}s como ${firstAsset.name} e outros dispositivos.</p>
                     <p>Status: ${firstAsset.status}</p>
                 `;
                 dynamicFeaturesContainer.appendChild(card);
            }
        });
        // Adicionar um card "Ver Tudo"
        const viewAllCard = document.createElement('div');
        viewAllCard.className = 'feature-card';
        viewAllCard.innerHTML = `
            <div class="feature-icon"><i class="fas fa-boxes"></i></div>
            <h3>Ver Todos os Ativos</h3>
            <p>Acesse a lista completa e detalhada de todos os seus ativos.</p>
            <a href="lista_equipamentos.html" class="btn btn-primary btn-sm" style="margin-top: 1rem;">Ver Lista</a>
        `;
        dynamicFeaturesContainer.appendChild(viewAllCard);
    }
});

// Exporta o banco de dados atualizado para ser usado por outros scripts (como servicos.js, cadastro.js, lista_equipamentos.js)
export { database };