// Function to format number as Brazilian currency
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Function to calculate and update all values
function calculateProfit() {
    // Get current slider values
    const desiredProfit = parseFloat(document.getElementById('profitSlider').value);
    const productPrice = parseFloat(document.getElementById('productSlider').value);
    const leadsPerSale = parseFloat(document.getElementById('leadsSlider').value);
    const leadCost = parseFloat(document.getElementById('leadValueSlider').value);

    // Calculate sales required
    const salesRequired = Math.ceil(desiredProfit / productPrice);

    // Calculate total leads required
    const leadsRequired = Math.ceil(salesRequired * leadsPerSale);

    // Calculate total investment in leads
    const totalInvestment = leadsRequired * leadCost;

    // Calculate conversion rate
    const conversionRate = ((1 / leadsPerSale) * 100).toFixed(2);

    // Calculate actual profit
    const actualProfit = (salesRequired * productPrice) - totalInvestment;

    // Update displays
    document.getElementById('profitDisplay').textContent = formatCurrency(desiredProfit);
    document.getElementById('productDisplay').textContent = formatCurrency(productPrice);
    document.getElementById('leadsDisplay').textContent = leadsPerSale;
    document.getElementById('leadValueDisplay').textContent = formatCurrency(leadCost);
    
    document.getElementById('conversionDisplay').textContent = conversionRate + '%';
    document.getElementById('profitCalcDisplay').textContent = formatCurrency(Math.max(actualProfit, 0));
    document.getElementById('salesDisplay').textContent = salesRequired;
    document.getElementById('leadsRequiredDisplay').textContent = leadsRequired;
    document.getElementById('investmentDisplay').textContent = formatCurrency(totalInvestment);
}

// Add event listeners to all sliders
const sliders = [
    'profitSlider', 
    'productSlider', 
    'leadsSlider', 
    'leadValueSlider'
];

sliders.forEach(sliderId => {
    const slider = document.getElementById(sliderId);
    slider.addEventListener('input', calculateProfit);
});

// Initial calculation
document.addEventListener('DOMContentLoaded', function() {
    calculateProfit();
});