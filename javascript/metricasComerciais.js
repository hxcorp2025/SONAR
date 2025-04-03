
function formatNumber(number) {
    return number.toLocaleString('pt-BR', { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
    });
}

function calcular() {
    // Obter valores dos sliders com correção específica para taxa de comparecimento
    const investimento = parseInt(document.getElementById("investimento").value);
    const precoLead = parseInt(document.getElementById("precoLead").value);
    const agendamento = parseInt(document.getElementById("agendamento").value) / 100;
    // Correção específica para taxa de comparecimento
    const comparecimentoRaw = document.getElementById("comparecimento").value;
    const comparecimento = (Math.floor(comparecimentoRaw / 5) * 5) / 100; // Garante incrementos de 5%
    const conversao = parseInt(document.getElementById("conversao").value) / 100;
    const ticketMedio = parseInt(document.getElementById("ticketMedio").value);

    // Cálculos principais
    const leadsGerados = Math.floor(investimento / precoLead);
    const leadsAgendados = Math.floor(leadsGerados * agendamento);
    const leadsPresentes = Math.floor(leadsAgendados * comparecimento);
    const vendas = Math.floor(leadsPresentes * conversao);
    const faturamento = vendas * ticketMedio;
    
    // Cálculos adicionais com proteção contra divisão por zero
    const custoPorCall = leadsPresentes > 0 ? investimento / leadsPresentes : 0;
    const cac = vendas > 0 ? investimento / vendas : 0;
    const roas = investimento > 0 ? faturamento / investimento : 0;

    // Atualizar valores dos sliders
    document.getElementById("investimentoVal").textContent = investimento.toLocaleString('pt-BR');
    document.getElementById("precoLeadVal").textContent = precoLead;
    document.getElementById("agendamentoVal").textContent = Math.round(agendamento * 100);
    // Exibição corrigida para taxa de comparecimento
    document.getElementById("comparecimentoVal").textContent = Math.floor(comparecimentoRaw / 5) * 5;
    document.getElementById("conversaoVal").textContent = Math.round(conversao * 100);
    document.getElementById("ticketMedioVal").textContent = ticketMedio.toLocaleString('pt-BR');

    // Atualizar resultados
    document.getElementById("faturamento").textContent = formatNumber(faturamento);
    document.getElementById("vendas").textContent = vendas;
    document.getElementById("custoCall").textContent = formatNumber(custoPorCall);
    document.getElementById("cac3").textContent = formatNumber(cac);
    document.getElementById("roas3").textContent = formatNumber(roas);
    
    // Cálculo de SDRs e Closers baseado no volume
    const sdrs = Math.max(1, Math.ceil(leadsPresentes / 100));
    const closers = Math.max(1, Math.ceil(vendas / 30));
    
    document.getElementById("sdrs").textContent = sdrs;
    document.getElementById("closers").textContent = closers;
}

// Inicializar cálculos quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos na aba correta antes de executar o cálculo
    const calculadoraElement = document.getElementById('calculator-3');
    if (calculadoraElement) {
        calcular();
    }
});
