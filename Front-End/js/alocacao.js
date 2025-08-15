// Front-End/js/alocacao.js
import { api } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.querySelector('.formulario');
    const equipamentoSelect = document.getElementById('equipamento');

    // Função para carregar equipamentos disponíveis
    async function carregarEquipamentos() {
        try {
            const equipamentos = await api.getAllAssets();
            const equipamentosDisponiveis = equipamentos.filter(eq => eq.status === 'Available');

            equipamentoSelect.innerHTML = '<option value="">Selecione...</option>'; // Limpa opções antigas

            equipamentosDisponiveis.forEach(eq => {
                const option = document.createElement('option');
                // Guardamos o ID e o tipo no value
                option.value = `${eq.type}:${eq.id}`;
                option.textContent = `${eq.name} (${eq.type})`;
                equipamentoSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar equipamentos:', error);
            alert('Não foi possível carregar a lista de equipamentos.');
        }
    }

    // Lógica do formulário de alocação
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const equipamentoSelecionado = equipamentoSelect.value;
        const localizacao = document.getElementById('localizacao').value;
        // Simulando que o usuário logado tem ID 1
        const usuarioLogadoId = 1;

        if (!equipamentoSelecionado || !localizacao) {
            alert('Por favor, selecione um equipamento e informe a localização.');
            return;
        }

        // Extrai o tipo e o ID do valor do <option>
        const [tipo, id] = equipamentoSelecionado.split(':');

        try {
            // Aqui você chamaria uma função da API para salvar a alocação
            // await api.alocarEquipamento(usuarioLogadoId, id, tipo, localizacao);

            alert(`Equipamento ${id} alocado para "${localizacao}" com sucesso!`);
            form.reset();
            carregarEquipamentos(); // Recarrega a lista
        } catch (error) {
            console.error('Erro ao alocar:', error);
            alert('Falha ao alocar o equipamento.');
        }
    });

    // Carrega os equipamentos ao iniciar a página
    carregarEquipamentos();
});