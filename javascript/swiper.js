  // Inicialização do Swiper
  const swiper = new Swiper('.swiper', {
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    allowTouchMove: false,
    speed: 300,
});

// Navegação pelos botões
const navButtons = document.querySelectorAll('.nav-button');

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        swiper.slideTo(button.dataset.slide);
    });
});