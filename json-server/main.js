// js/main.js

// URL base do seu JSON-Server. Ele geralmente roda na porta 3000 por padrão.
// O nome do recurso (ex: 'Computer', 'Printer') será o endpoint.
const JSON_SERVER_BASE_URL = 'http://localhost:3000/';

// --- Funções CRUD usando Fetch ---

// READ: Obter todos os ativos de um tipo específico
export async function getAssets(type) {
    try {
        const response = await fetch(`${JSON_SERVER_BASE_URL}${type}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar ${type}: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Erro ao obter ativos do tipo ${type}:`, error);
        return []; // Retorna um array vazio em caso de erro
    }
}

// READ: Obter um ativo específico por tipo e ID
export async function getAssetById(type, id) {
    try {
        const response = await fetch(`${JSON_SERVER_BASE_URL}${type}/${id}`);
        if (!response.ok) {
            if (response.status === 404) {
                console.warn(`Ativo com ID ${id} do tipo ${type} não encontrado.`);
                return null;
            }
            throw new Error(`Erro ao obter ativo ${id} de ${type}: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Erro ao obter ativo por ID (${id}, ${type}):`, error);
        return null;
    }
}

// CREATE: Adicionar um novo ativo
export async function addAsset(type, newAssetData) {
    try {
        const response = await fetch(`${JSON_SERVER_BASE_URL}${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAssetData)
        });

        if (!response.ok) {
            const errorBody = await response.text(); // Pega o texto da resposta para depuração
            throw new Error(`Erro ao adicionar ativo: ${response.status} ${response.statusText} - ${errorBody}`);
        }
        return await response.json(); // JSON-Server retorna o novo recurso com o ID
    } catch (error) {
        console.error('Erro na adição de ativo:', error);
        throw error; // Re-lança para que o chamador possa lidar com o erro
    }
}

// UPDATE: Atualizar um ativo existente
export async function updateAsset(type, id, updates) {
    try {
        const response = await fetch(`${JSON_SERVER_BASE_URL}${type}/${id}`, {
            method: 'PUT', // PUT substitui o recurso completo. PATCH atualiza parcialmente. Use PUT para este exemplo.
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Erro ao atualizar ativo: ${response.status} ${response.statusText} - ${errorBody}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erro na atualização de ativo:', error);
        throw error;
    }
}

// DELETE: Excluir um ativo
export async function deleteAsset(type, id) {
    try {
        const response = await fetch(`${JSON_SERVER_BASE_URL}${type}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Erro ao excluir ativo: ${response.status} ${response.statusText} - ${errorBody}`);
        }
        return true; // JSON-Server geralmente retorna um objeto vazio ou 200 OK
    } catch (error) {
        console.error('Erro na exclusão de ativo:', error);
        throw error;
    }
}

// --- Funções de inicialização e eventos globais para index.html ---

document.addEventListener('DOMContentLoaded', async () => { // Usar async aqui para chamar getAssets
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

    // Renderizar os cards de recursos (seção #recursos) dinamicamente
    const dynamicFeaturesContainer = document.getElementById('dynamic-features-cards');
    if (dynamicFeaturesContainer) {
        dynamicFeaturesContainer.innerHTML = ''; // Limpa o conteúdo existente

        // Precisamos obter a lista de tipos de ativos do JSON-Server
        // Isso pode ser feito fazendo uma requisição ao endpoint raiz ou tendo uma lista de tipos pré-definida
        // Para simplificar, vamos usar uma lista pré-definida ou hardcoded aqui para os cards.
        const assetTypes = [
            'Computer', 'Printer', 'Projector', 'Monitor', 'Scanner',
            'NetworkDevice', 'StorageDevice', 'Accessories'
        ];

        for (const type of assetTypes) {
            try {
                const assetsOfType = await getAssets(type); // Busca os ativos para cada tipo
                if (assetsOfType.length > 0) {
                    const firstAsset = assetsOfType[0]; // Pega o primeiro ativo para representação
                    const card = document.createElement('div');
                    card.className = 'feature-card';
                    card.innerHTML = `
                        <div class="feature-icon"><i class="fas fa-desktop"></i></div>
                        <h3>${type}s</h3>
                        <p>Gerencie ${assetsOfType.length} ${type.toLowerCase()}s como ${firstAsset.name} e outros dispositivos.</p>
                        <p>Status: ${firstAsset.status}</p>
                    `;
                    dynamicFeaturesContainer.appendChild(card);
                }
            } catch (error) {
                console.error(`Não foi possível carregar dados para ${type}:`, error);
                // Pode adicionar um card de erro ou pular este tipo
            }
        }
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