
// Função para criar efeito de pulso no sonar
function createPulseWave() {
    const wave = document.createElement('div');
    wave.className = 'pulse-wave';
    
    document.getElementById('pulseContainer').appendChild(wave);
    
    wave.addEventListener('animationend', () => {
        wave.remove();
    });
}

// Criar nova onda a cada 4 segundos
setInterval(createPulseWave, 4000);

// Função para atualizar a posição do ponto no sonar com base no status
function updateSonarPosition(status) {
    const point = document.getElementById('detectionPoint');
    const message = document.getElementById('status-message');
    const centerX = 250;
    const centerY = 250;
    let distance;
    let x, y;

    // Atualizar posição com base no status
    if (status === 'green') {
        // No centro exato quando verde
        x = centerX;
        y = centerY;
    } else if (status === 'yellow') {
        // Distância intermediária quando amarelo (50% do raio)
        distance = 100;
        const angle = Math.random() * Math.PI * 2;
        x = centerX + Math.cos(angle) * distance;
        y = centerY + Math.sin(angle) * distance;
    } else {
        // Maior distância quando vermelho (80% do raio)
        distance = 180;
        const angle = Math.random() * Math.PI * 2;
        x = centerX + Math.cos(angle) * distance;
        y = centerY + Math.sin(angle) * distance;
    }

    // Atualizar posição
    if (point) {
        point.style.left = `${x}px`;
        point.style.top = `${y}px`;
    }

    // Atualizar cor e mensagem
    if (message) {
        message.classList.remove('active');
        setTimeout(() => {
            if (status === 'green') {
                point.style.backgroundColor = '#4CAF50';
                point.style.boxShadow = '0 0 10px #4CAF50';
                message.innerHTML = '<span class="green-text">MOMENTO IDEAL PARA ESCALA! Suas métricas estão excelentes, hora de investir mais!</span>';
                message.style.borderLeft = '4px solid #4CAF50';
            } else if (status === 'yellow') {
                point.style.backgroundColor = '#FFC107';
                point.style.boxShadow = '0 0 10px #FFC107';
                message.innerHTML = '<span class="yellow-text">QUASE LÁ! Estamos nos aproximando do momento ideal para escalar. Otimize os pontos indicados abaixo.</span>';
                message.style.borderLeft = '4px solid #FFC107';
            } else {
                point.style.backgroundColor = '#f44336';
                point.style.boxShadow = '0 0 10px #f44336';
                message.innerHTML = '<span class="red-text">MOMENTO DE OTIMIZAÇÃO! É necessário melhorar significativamente suas métricas antes de escalar.</span>';
                message.style.borderLeft = '4px solid #f44336';
            }
            message.classList.add('active');
        }, 300);
    }
}

// Definição dos limites para cada métrica
const metricThresholds = {
    ctr: { ruim: 0, bom: 1, otimo: 2 },  // %
    connectRate: { ruim: 0, bom: 75, otimo: 90 },  // %
    pageConversion: { ruim: 0, bom: 5, otimo: 10 },  // %
    checkoutConversion: { ruim: 0, bom: 20, otimo: 40 },  // %
    roas: { ruim: 0, bom: 1.5, otimo: 2.5 }  // multiplicador
};

// Função para determinar o cenário de uma métrica (ruim, bom, ótimo)
function getScenario(value, metric) {
    const thresholds = metricThresholds[metric];
    
    if (value >= thresholds.otimo) return 'otimo';
    if (value >= thresholds.bom) return 'bom';
    return 'ruim';
}

// Função para atualizar o termômetro de uma métrica
function updateThermometer(metricId, value, metric) {
    const scenario = getScenario(value, metric);
    const levelElement = document.getElementById(`${metricId}-level`);
    const valueElement = document.getElementById(`${metricId}-therm-value`);
    const nextStepElement = document.getElementById(`${metricId}-next-step`);
    
    // Atualizar valor
    valueElement.textContent = value.toFixed(2) + '%';
    
    // Definir nível no termômetro
    let percentage;
    const thresholds = metricThresholds[metric];
    
    if (scenario === 'otimo') {
        percentage = 100;
    } else if (scenario === 'bom') {
        const range = thresholds.otimo - thresholds.bom;
        const position = value - thresholds.bom;
        percentage = 66.66 + (position / range) * 33.33;
    } else {
        const range = thresholds.bom - thresholds.ruim;
        const position = value - thresholds.ruim;
        percentage = Math.max(5, (position / range) * 66.66);
    }
    
    levelElement.style.width = `${percentage}%`;
    
    // Definir próximo passo
    if (scenario === 'otimo') {
        nextStepElement.innerHTML = `<strong>Parabéns!</strong> Sua métrica está ótima. Continue mantendo essa performance.`;
    } else if (scenario === 'bom') {
        const improvement = (thresholds.otimo - value).toFixed(2);
        nextStepElement.innerHTML = `<strong>Próximo nível:</strong> Aumente ${improvement}% para atingir o nível ótimo.`;
    } else {
        const improvement = (thresholds.bom - value).toFixed(2);
        nextStepElement.innerHTML = `<strong>Próximo nível:</strong> Aumente ${improvement}% para atingir o nível bom.`;
    }
    
    return scenario;
}

// Função para formatar valor como moeda brasileira
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para adicionar uma seção de otimização
function addOptimizationSection(metric, scenario, container) {
    const section = document.createElement('div');
    section.className = 'optimization-section';
    
    const statusColor = scenario === 'otimo' ? '#4CAF50' : scenario === 'bom' ? '#FFC107' : '#f44336';
    const metricName = getMetricDisplayName(metric);
    
    let causesHTML = '';
    let actionsHTML = '';
    let detailedAction = '';
    
    // Define as causas, ações e detalhes com base na métrica e cenário
    if (metric === 'ctr') {
        if (scenario === 'ruim') {
            causesHTML = `
                <li>Criativo visual pouco atrativo ou genérico</li>
                <li>Ausência de um gancho claro no anúncio</li>
                <li>Público desinteressado ou não qualificado</li>
                <li>Contraste ruim com a plataforma</li>
            `;
            actionsHTML = `
                <li>Redesenhar anúncios com foco em um gancho emocional mais forte</li>
                <li>Fazer testes A/B em elementos visuais e texto</li>
                <li>Revisar segmentações e expandir para públicos baseados em lookalike</li>
            `;
            detailedAction = `
                <strong>Epiphany Bridge:</strong> Desenvolva anúncios que utilizem a técnica do "Epiphany Bridge", 
                onde você conta uma história transformadora que conecte o público ao seu produto ou serviço. 
                Este tipo de narrativa cria uma conexão emocional forte e aumenta significativamente o engajamento. 
                Combine isso com elementos visuais impactantes que se destaquem no feed, com cores contrastantes 
                e textos curtos e diretos que despertem curiosidade imediata.
            `;
        } else if (scenario === 'bom') {
            causesHTML = `
                <li>Criativo conectado com o público, mas com potencial de melhoria</li>
                <li>Call to Action (CTA) presente, mas não otimizado</li>
                <li>Segmentação adequada, mas não refinada</li>
            `;
            actionsHTML = `
                <li>Aprimorar o gancho emocional do anúncio</li>
                <li>Testar variações de CTA mais diretas e irresistíveis</li>
                <li>Refinar ainda mais o alinhamento da oferta com o público-alvo</li>
            `;
            detailedAction = `
                <strong>Otimização do CTA:</strong> Experimente CTAs mais específicos e orientados à ação que 
                criem um senso de urgência e exclusividade. Por exemplo, em vez de "Saiba mais", use "Descubra o método 
                que transformou meu negócio em 30 dias" ou "Acesse agora o sistema exclusivo (por tempo limitado)". 
                Combine isso com uma segmentação mais precisa baseada nos resultados obtidos até agora, focando nos 
                subgrupos que demonstraram maior engajamento.
            `;
        } else {
            causesHTML = `
                <li>Criativo fortemente conectado com o público</li>
                <li>Call to Action (CTA) claro e irresistível</li>
                <li>Segmentação de público adequada e otimizada</li>
            `;
            actionsHTML = `
                <li>Duplicar campanhas vencedoras e aumentar orçamento progressivamente</li>
                <li>Criar variações do anúncio vencedor para evitar fadiga de anúncio</li>
                <li>Aplicar aprendizados em outras campanhas</li>
            `;
            detailedAction = `
                <strong>Escala inteligente:</strong> Você atingiu um CTR excelente! Agora é hora de escalar 
                gradualmente, aumentando o orçamento em incrementos de 20-30% a cada 3-4 dias. Simultaneamente, 
                prepare 2-3 variações do anúncio vencedor para alternar e evitar a fadiga de anúncio, mantendo 
                o mesmo gancho e estrutura que funcionaram, mas com elementos visuais ou exemplos diferentes. 
                Documente os elementos-chave que tornaram este anúncio bem-sucedido para replicar em futuras campanhas.
            `;
        }
    } else if (metric === 'connectRate') {
        if (scenario === 'ruim') {
            causesHTML = `
                <li>Página lenta ou com problemas de carregamento</li>
                <li>Links quebrados ou redirecionamentos errados</li>
                <li>Problemas de responsividade (experiência ruim no mobile)</li>
                <li>Hospedagem de baixa qualidade</li>
            `;
            actionsHTML = `
                <li>Fazer auditoria técnica da página com ferramentas especializadas</li>
                <li>Otimizar imagens, vídeos e elementos pesados</li>
                <li>Verificar links e redirecionamentos</li>
                <li>Implementar CDN ou avaliar troca de hospedagem</li>
            `;
            detailedAction = `
                <strong>Auditoria técnica completa:</strong> Use ferramentas como GTmetrix e PageSpeed Insights para 
                identificar exatamente o que está causando a lentidão. Foque em otimizar as imagens (compressão sem perda 
                de qualidade), implementar carregamento lazy para elementos abaixo da dobra, e minificar CSS/JavaScript. 
                Considere implementar um CDN como Cloudflare para melhorar o tempo de resposta. Teste rigorosamente a 
                experiência em dispositivos móveis, pois eles geralmente representam mais de 70% do tráfego e são mais 
                suscetíveis a problemas de performance.
            `;
        } else if (scenario === 'bom') {
            causesHTML = `
                <li>Página com velocidade moderada</li>
                <li>Experiência mobile funcional mas não otimizada</li>
                <li>Configurações de redirecionamento não otimizadas</li>
            `;
            actionsHTML = `
                <li>Implementar otimizações avançadas de velocidade</li>
                <li>Revisar e aprimorar especificamente a experiência mobile</li>
                <li>Otimizar configurações de redirecionamento e tracking</li>
            `;
            detailedAction = `
                <strong>Otimização mobile-first:</strong> Revise sua landing page com uma abordagem genuinamente 
                mobile-first. Simplifique a navegação para telas pequenas, aumente os elementos clicáveis para tamanho 
                mínimo de 44x44px, e verifique se o conteúdo principal aparece sem necessidade de rolagem. 
                Para melhorar ainda mais a velocidade, considere implementar técnicas avançadas como pré-carregamento de 
                recursos críticos, redução de JavaScript de terceiros, e utilização de formatos de imagem modernos como WebP. 
                Uma melhoria de 0.1 segundo pode aumentar significativamente sua taxa de conversão.
            `;
        } else {
            causesHTML = `
                <li>Página rápida e responsiva</li>
                <li>Links funcionando corretamente</li>
                <li>Experiência do usuário otimizada</li>
            `;
            actionsHTML = `
                <li>Escalar campanhas com alta taxa de conexão</li>
                <li>Usar esta página como modelo para novas campanhas</li>
                <li>Implementar pequenos testes para melhorias incrementais</li>
            `;
            detailedAction = `
                <strong>Manutenção e monitoramento:</strong> Sua página está tecnicamente excelente! Implemente um 
                sistema de monitoramento constante para manter essa performance, como alertas automáticos se a velocidade 
                cair abaixo de determinados limites. Considere pequenas otimizações incrementais, como pré-carregamento 
                inteligente da próxima página mais provável ou implementação de um sistema de PWA (Progressive Web App) 
                para melhorar ainda mais a experiência do usuário. Documente as práticas que levaram a esse resultado para 
                aplicar em futuros projetos.
            `;
        }
    } else if (metric === 'pageConversion') {
        if (scenario === 'ruim') {
            causesHTML = `
                <li>Gatilhos persuasivos mal posicionados</li>
                <li>Falta de clareza ou ordem nas seções da página</li>
                <li>Falta de elementos persuasivos</li>
                <li>Experiência do usuário confusa</li>
            `;
            actionsHTML = `
                <li>Mapear comportamento do usuário com ferramentas de análise</li>
                <li>Testar novas versões da página com mudanças específicas</li>
                <li>Adicionar elementos de prova social e escassez</li>
            `;
            detailedAction = `
                <strong>Reestruturação baseada em dados:</strong> Implemente ferramentas como Hotjar ou Microsoft Clarity 
                para criar mapas de calor e gravações de sessão. Analise onde os usuários estão parando, clicando e desistindo. 
                Com base nesses dados, reestruture sua página seguindo um fluxo persuasivo claro: gancho atraente → problema 
                agitado → solução apresentada → benefícios específicos → prova social robusta → oferta irresistível com 
                escassez real → CTA claro. Em cada seção, elimine distrações e mantenha um único objetivo de conversão.
            `;
        } else if (scenario === 'bom') {
            causesHTML = `
                <li>Estrutura de página adequada mas não otimizada</li>
                <li>Elementos de prova social presentes mas limitados</li>
                <li>Proposta de valor clara mas não irresistível</li>
            `;
            actionsHTML = `
                <li>Fortalecer elementos de prova social (depoimentos, cases)</li>
                <li>Aprimorar a proposta de valor e diferenciação</li>
                <li>Testar variações de copy com foco em benefícios</li>
            `;
            detailedAction = `
                <strong>Amplificação de prova social:</strong> Intensifique significativamente os elementos de prova social, 
                passando de depoimentos simples para histórias completas de transformação com resultados mensuráveis e 
                específicos. Adicione vídeos de depoimentos autênticos (não apenas texto) e demonstre resultados com números 
                concretos. Reforce a proposta de valor ressaltando claramente o que torna sua oferta única, com comparativos 
                diretos quando possível. Teste diferentes abordagens em títulos e subtítulos que enfatizem benefícios transformadores, 
                não apenas características do produto/serviço.
            `;
        } else {
            causesHTML = `
                <li>Página persuasiva com gatilhos claros</li>
                <li>Estrutura de copy bem organizada</li>
                <li>Elementos de confiança evidentes</li>
            `;
            actionsHTML = `
                <li>Escalar tráfego para a página</li>
                <li>Testar pequenas variações para otimização contínua</li>
                <li>Analisar elementos vencedores para replicar</li>
            `;
            detailedAction = `
                <strong>Otimização contínua e segmentada:</strong> Sua página está convertendo excepcionalmente bem! 
                Agora é o momento para testes mais refinados e específicos. Implemente testes A/B segmentados por 
                origem do tráfego, dispositivo e demografia para personalizar ainda mais a experiência. 
                Considere implementar personalização dinâmica baseada no comportamento anterior do usuário ou 
                parâmetros de URL. Documente detalhadamente os elementos que estão gerando essa alta conversão 
                e crie um playbook para aplicar em futuras páginas e campanhas.
            `;
        }
    } else if (metric === 'checkoutConversion') {
        if (scenario === 'ruim') {
            causesHTML = `
                <li>Alta taxa de rejeição nos pagamentos</li>
                <li>Checkout complexo ou não intuitivo</li>
                <li>Falta de elementos de segurança visíveis</li>
                <li>Muitos campos obrigatórios</li>
            `;
            actionsHTML = `
                <li>Simplificar o processo de checkout</li>
                <li>Adicionar badges de segurança e provas de confiabilidade</li>
                <li>Testar diferentes gateways de pagamento</li>
            `;
            detailedAction = `
                <strong>Simplificação radical do checkout:</strong> Reduza o processo de checkout ao mínimo absoluto 
                necessário, eliminando qualquer campo que não seja estritamente essencial. Implemente autopreenchimento 
                sempre que possível e ofereça opção de "comprar como visitante" sem necessidade de criar conta. 
                Adicione selos de segurança (SSL, PCI compliance) proeminentemente visíveis em cada etapa, especialmente 
                próximo aos campos de pagamento. Teste múltiplos gateways de pagamento e métodos alternativos como Pix, 
                especialmente para o público brasileiro onde a taxa de aprovação de cartões pode ser um desafio.
            `;
        } else if (scenario === 'bom') {
            causesHTML = `
                <li>Checkout funcional mas com pontos de atrito</li>
                <li>Elementos de segurança presentes mas não destacados</li>
                <li>Opções de pagamento limitadas</li>
            `;
            actionsHTML = `
                <li>Revisar e eliminar passos desnecessários</li>
                <li>Destacar garantias e elementos de segurança</li>
                <li>Ampliar opções de pagamento</li>
            `;
            detailedAction = `
                <strong>Otimização de finalização:</strong> Implemente uma barra de progresso clara para mostrar exatamente 
                em que etapa o cliente está e quanto falta para concluir. Destaque a garantia de satisfação ou política de 
                reembolso diretamente na página de pagamento para reduzir a ansiedade de compra. Adicione uma seção de "Perguntas 
                Frequentes" específicas sobre pagamento e segurança. Considere implementar um sistema de recuperação de carrinho 
                abandonado via email ou WhatsApp que ofereça um incentivo especial (como frete grátis ou desconto por tempo limitado) 
                para completar a compra.
            `;
        } else {
            causesHTML = `
                <li>Processo de checkout simplificado e confiável</li>
                <li>Processo de compra fluido</li>
                <li>Boa taxa de aprovação</li>
                <li>Elementos de segurança efetivos</li>
            `;
            actionsHTML = `
                <li>Escalar campanhas que levam a esse checkout eficiente</li>
                <li>Usar o checkout como referência para outras ofertas</li>
                <li>Implementar upsells e cross-sells estratégicos</li>
            `;
            detailedAction = `
                <strong>Maximização de valor por cliente:</strong> Com um checkout tão eficiente, é o momento ideal 
                para implementar upsells e cross-sells inteligentes que aumentem o valor médio do pedido sem complicar 
                o processo. Implemente ofertas complementares relevantes logo após a conclusão da compra, com ênfase na 
                complementaridade e valor agregado. Considere implementar uma página de "one-click upsell" para produtos 
                relacionados após a compra principal, onde o cliente pode adicionar itens com apenas um clique, sem precisar 
                inserir novamente os dados de pagamento.
            `;
        }
    }
    
    section.innerHTML = `
        <div class="optimization-header">
            <div class="status-indicator" style="background-color: ${statusColor};"></div>
            <h3>${metricName}</h3>
        </div>
        <div class="optimization-content">
            <div class="optimization-causes">
                <h4>POSSÍVEIS CAUSAS:</h4>
                <ul>${causesHTML}</ul>
            </div>
            <div class="optimization-actions">
                <h4>AÇÕES RECOMENDADAS:</h4>
                <ul>${actionsHTML}</ul>
            </div>
            <div class="detailed-action">
                ${detailedAction}
            </div>
        </div>
    `;
    
    container.appendChild(section);
}

// Função para obter o nome de exibição de uma métrica
function getMetricDisplayName(metric) {
    const displayNames = {
        'ctr': 'CTR (Taxa de Cliques)',
        'connectRate': 'Connect Rate (Clique → Page View)',
        'pageConversion': 'Conversão da Página (Page View → Checkout)',
        'checkoutConversion': 'Conversão do Checkout (Checkout → Compra)'
    };
    
    return displayNames[metric] || metric;
}

// Função para calcular e exibir os resultados
function calculateMetrics() {
    // Obter valores dos campos
    const impressions = parseFloat(document.getElementById('impressions').value) || 0;
    const clicks = parseFloat(document.getElementById('clicks').value) || 0;
    const pageviews = parseFloat(document.getElementById('pageviews').value) || 0;
    const checkouts = parseFloat(document.getElementById('checkouts').value) || 0;
    const purchases = parseFloat(document.getElementById('purchases').value) || 0;
    const cpm = parseFloat(document.getElementById('cpm').value) || 0;
    const cpc = parseFloat(document.getElementById('cpc').value) || 0;
    const adSpend = parseFloat(document.getElementById('adSpend').value) || 0;
    const averageOrder = parseFloat(document.getElementById('averageOrder').value) || 0;
    
    // Calcular métricas
    let ctr = 0;
    let connectRate = 0;
    let pageConversion = 0;
    let checkoutConversion = 0;
    let totalConversion = 0;
    let cac = 0;
    let roas = 0;
    
    if (impressions > 0) {
        ctr = (clicks / impressions) * 100;
    }
    
    if (clicks > 0) {
        connectRate = (pageviews / clicks) * 100;
    }
    
    if (pageviews > 0) {
        pageConversion = (checkouts / pageviews) * 100;
    }
    
    if (checkouts > 0) {
        checkoutConversion = (purchases / checkouts) * 100;
    }
    
    if (impressions > 0) {
        totalConversion = (purchases / impressions) * 100;
    }
    
    if (purchases > 0) {
        cac = adSpend / purchases;
    }
    
    if (adSpend > 0) {
        roas = (purchases * averageOrder) / adSpend;
    }
    
    // Atualizar exibição das métricas calculadas
    document.getElementById('ctr-value').textContent = ctr.toFixed(2) + '%';
    document.getElementById('connect-rate-value').textContent = connectRate.toFixed(2) + '%';
    document.getElementById('page-conversion-value').textContent = pageConversion.toFixed(2) + '%';
    document.getElementById('checkout-conversion-value').textContent = checkoutConversion.toFixed(2) + '%';
    document.getElementById('total-conversion-value').textContent = totalConversion.toFixed(2) + '%';
    document.getElementById('cac-value').textContent = formatCurrency(cac);
    document.getElementById('roas-value').textContent = roas.toFixed(2);
    
    // Métricas adicionais
    document.getElementById('sales-count-value').textContent = purchases;
    
    // Cálculo do lucro bruto (receita total)
    const revenue = purchases * averageOrder;
    document.getElementById('gross-profit-value').textContent = formatCurrency(revenue);
    
    // Cálculo do lucro percentual (ROI)
    let profitPercentage = 0;
    if (adSpend > 0) {
        profitPercentage = ((revenue - adSpend) / adSpend) * 100;
    }
    document.getElementById('profit-percentage-value').textContent = profitPercentage.toFixed(2) + '%';
    
    // Atualizar termômetros
    const ctrScenario = updateThermometer('ctr', ctr, 'ctr');
    const connectRateScenario = updateThermometer('connect-rate', connectRate, 'connectRate');
    const pageConversionScenario = updateThermometer('page-conversion', pageConversion, 'pageConversion');
    const checkoutConversionScenario = updateThermometer('checkout-conversion', checkoutConversion, 'checkoutConversion');
    
    // Determinar status geral com base nas métricas
    let status = 'red';
    let greenCount = 0;
    let yellowCount = 0;
    
    if (ctrScenario === 'otimo') greenCount++;
    else if (ctrScenario === 'bom') yellowCount++;
    
    if (connectRateScenario === 'otimo') greenCount++;
    else if (connectRateScenario === 'bom') yellowCount++;
    
    if (pageConversionScenario === 'otimo') greenCount++;
    else if (pageConversionScenario === 'bom') yellowCount++;
    
    if (checkoutConversionScenario === 'otimo') greenCount++;
    else if (checkoutConversionScenario === 'bom') yellowCount++;
    
    if (roas >= metricThresholds.roas.otimo) greenCount++;
    else if (roas >= metricThresholds.roas.bom) yellowCount++;
    
    if (greenCount >= 3) {
        status = 'green';
    } else if (yellowCount >= 3 || (yellowCount >= 2 && greenCount >= 1)) {
        status = 'yellow';
    }
    
    // Atualizar posição do sonar
    updateSonarPosition(status);
    
    // Atualizar recomendações de otimização
    const optimizationContainer = document.getElementById('optimization-recommendations');
    optimizationContainer.innerHTML = '<h2>Mapa de Otimização</h2>';
    
    // Adicionar seções de otimização com base nos cenários de cada métrica
    addOptimizationSection('ctr', ctrScenario, optimizationContainer);
    addOptimizationSection('connectRate', connectRateScenario, optimizationContainer);
    addOptimizationSection('pageConversion', pageConversionScenario, optimizationContainer);
    addOptimizationSection('checkoutConversion', checkoutConversionScenario, optimizationContainer);
}

// Adicionar evento ao botão de calcular
document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateMetrics);
    }

    // Iniciar as animações do sonar
    createPulseWave();
});
