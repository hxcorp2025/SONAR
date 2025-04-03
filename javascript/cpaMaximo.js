
// Função para formatar valores como moeda brasileira
function formatCurrencyCPA(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Função para formatar valores como percentual
function formatPercentage(value) {
    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + '%';
}

// Função para criar um novo elemento de custo variável
function createVariableCostElement(id) {
    const costContainer = document.createElement('div');
    costContainer.className = 'variable-cost';
    costContainer.dataset.id = id;
    
    costContainer.innerHTML = `
        <div class="cost-name">
            <input type="text" class="variable-cost-name" placeholder="Nome do custo variável" autocomplete="off">
        </div>
        <div class="cost-value">
            <input type="number" class="variable-cost-value" placeholder="Valor" step="0.01">
        </div>
        <div class="cost-type">
            <label>
                <input type="radio" name="costType${id}" value="fixed" checked> R$
            </label>
            <label>
                <input type="radio" name="costType${id}" value="percentage"> %
            </label>
        </div>
        <button class="remove-cost" title="Remover custo">×</button>
    `;
    
    return costContainer;
}

// Função para calcular todas as métricas
function calculateCPAMaximo() {
    // Obter valores dos campos
    const productPrice = parseFloat(document.getElementById('product-price').value) || 0;
    const platformPercentage = parseFloat(document.getElementById('platform-percentage').value) || 0;
    const platformFixed = parseFloat(document.getElementById('platform-fixed').value) || 0;
    
    // Calcular taxa da plataforma
    const platformFee = (productPrice * (platformPercentage / 100)) + platformFixed;
    
    // Obter e calcular todos os custos variáveis
    let totalVariableCosts = platformFee;
    const costElements = document.querySelectorAll('.variable-cost');
    
    costElements.forEach(costElement => {
        const costValue = parseFloat(costElement.querySelector('.variable-cost-value').value) || 0;
        const costType = costElement.querySelector('input[type="radio"]:checked').value;
        
        if (costType === 'fixed') {
            totalVariableCosts += costValue;
        } else {
            totalVariableCosts += (productPrice * (costValue / 100));
        }
    });
    
    // Calcular margem de contribuição
    const contributionMargin = productPrice - totalVariableCosts;
    const contributionPercentage = (contributionMargin / productPrice) * 100;
    
    // Calcular CPA máximo para diferentes ROIs
    const cpaRoi1 = contributionMargin;
    const cpaRoi1_5 = contributionMargin / 1.5;
    const cpaRoi2 = contributionMargin / 2;
    
    // Atualizar os elementos na interface
    document.getElementById('revenue-per-sale').textContent = formatCurrencyCPA(productPrice);
    document.getElementById('total-variable-costs').textContent = formatCurrencyCPA(totalVariableCosts);
    document.getElementById('contribution-margin').textContent = formatCurrencyCPA(contributionMargin);
    document.getElementById('contribution-percentage').textContent = formatPercentage(contributionPercentage);
    
    document.getElementById('cpa-roi-1').textContent = formatCurrencyCPA(cpaRoi1);
    document.getElementById('cpa-roi-1-5').textContent = formatCurrencyCPA(cpaRoi1_5);
    document.getElementById('cpa-roi-2').textContent = formatCurrencyCPA(cpaRoi2);
    
    // Calcular orçamentos baseados na meta de vendas
    calculateBudgets(cpaRoi1, cpaRoi1_5, cpaRoi2);
}

// Função para calcular orçamentos baseados na meta de vendas e CPAs máximos
function calculateBudgets(cpaRoi1, cpaRoi1_5, cpaRoi2) {
    const salesGoal = parseInt(document.getElementById('sales-goal').value) || 0;
    
    const budgetRoi1 = salesGoal * cpaRoi1;
    const budgetRoi1_5 = salesGoal * cpaRoi1_5;
    const budgetRoi2 = salesGoal * cpaRoi2;
    
    document.getElementById('budget-roi-1').textContent = formatCurrencyCPA(budgetRoi1);
    document.getElementById('budget-roi-1-5').textContent = formatCurrencyCPA(budgetRoi1_5);
    document.getElementById('budget-roi-2').textContent = formatCurrencyCPA(budgetRoi2);
}

// Inicializar a aba CPA Máximo
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar evento para o botão de adicionar custo variável
    const addCostBtn = document.getElementById('add-cost-btn');
    if (addCostBtn) {
        addCostBtn.addEventListener('click', function() {
            const costId = Date.now(); // ID único baseado no timestamp
            const newCost = createVariableCostElement(costId);
            document.getElementById('variable-costs-container').appendChild(newCost);
            
            // Adicionar evento para remover este custo
            newCost.querySelector('.remove-cost').addEventListener('click', function() {
                newCost.remove();
            });
        });
        
        // Criar o primeiro campo de custo variável quando a página carregar
        addCostBtn.click();
    }
    
    // Adicionar evento para o botão de calcular
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateCPAMaximo);
    }
    
    // Adicionar evento para calcular orçamentos quando a meta de vendas mudar
    const salesGoalInput = document.getElementById('sales-goal');
    if (salesGoalInput) {
        salesGoalInput.addEventListener('input', function() {
            // Remover símbolos de moeda e converter para número
            const cpaRoi1Text = document.getElementById('cpa-roi-1').textContent;
            const cpaRoi1_5Text = document.getElementById('cpa-roi-1-5').textContent;
            const cpaRoi2Text = document.getElementById('cpa-roi-2').textContent;
            
            const cpaRoi1 = parseFloat(cpaRoi1Text.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
            const cpaRoi1_5 = parseFloat(cpaRoi1_5Text.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
            const cpaRoi2 = parseFloat(cpaRoi2Text.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
            
            calculateBudgets(cpaRoi1, cpaRoi1_5, cpaRoi2);
        });
    }
});
