// Front-End/js/relatorios.js
import { api } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('report-container');
    container.innerHTML = '<p>Gerando relatórios...</p>';

    try {
        const todosEquipamentos = await api.getAllAssets();

        // 1. Contagem por Status
        const statusCount = todosEquipamentos.reduce((acc, eq) => {
            acc[eq.status] = (acc[eq.status] || 0) + 1;
            return acc;
        }, {});

        // 2. Contagem por Tipo
        const typeCount = todosEquipamentos.reduce((acc, eq) => {
            acc[eq.type] = (acc[eq.type] || 0) + 1;
            return acc;
        }, {});

        renderReports(statusCount, typeCount);

    } catch (error) {
        container.innerHTML = '<p style="color: red;">Erro ao gerar relatórios.</p>';
        console.error(error);
    }

    function renderReports(statusData, typeData) {
        container.innerHTML = `
            <div class="report-card">
                <h3>Equipamentos por Status</h3>
                <ul>
                    ${Object.entries(statusData).map(([status, count]) => `<li><strong>${status}:</strong> ${count}</li>`).join('')}
                </ul>
            </div>
            <div class="report-card">
                <h3>Equipamentos por Tipo</h3>
                <ul>
                    ${Object.entries(typeData).map(([type, count]) => `<li><strong>${type}:</strong> ${count}</li>`).join('')}
                </ul>
            </div>
        `;
    }
});