const API_URL = 'http://localhost:3000';

// Função para buscar todos os ativos de um tipo específico (ex: 'Computer')
async function getAssets(type) {
  const response = await fetch(`${API_URL}/${type}`);
  if (!response.ok) {
    throw new Error(`Erro ao buscar ${type}`);
  }
  return response.json();
}

// Função para buscar todos os ativos de todas as categorias
async function getAllAssets() {
  const assetTypes = ['Computer', 'Printer', 'Monitor', 'Projector', 'Scanner', 'NetworkDevice', 'StorageDevice', 'Accessories'];
  let allAssets = [];

  for (const type of assetTypes) {
    const assets = await getAssets(type);
    // Adiciona a propriedade 'type' a cada objeto para sabermos a que categoria ele pertence
    const assetsWithType = assets.map(asset => ({ ...asset, type }));
    allAssets = allAssets.concat(assetsWithType);
  }
  return allAssets;
}

// Função para adicionar um novo ativo
async function addAsset(type, assetData) {
  const response = await fetch(`${API_URL}/${type}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(assetData),
  });
  if (!response.ok) {
    throw new Error('Erro ao adicionar o ativo');
  }
  return response.json();
}

// Função para deletar um ativo
async function deleteAsset(type, id) {
  const response = await fetch(`${API_URL}/${type}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erro ao deletar o ativo');
  }
  return response.ok;
}

// Exporta as funções para serem usadas em outros scripts
export const api = {
  getAllAssets,
  addAsset,
  deleteAsset
};