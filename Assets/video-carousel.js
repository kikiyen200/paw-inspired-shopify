document.querySelectorAll('.product-carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const prev = carousel.querySelector('.prev');
    const next = carousel.querySelector('.next');
    const step = track.querySelector('.product-card').offsetWidth + 8; 
  
    prev.addEventListener('click', () => {
      track.scrollBy({ left: -step, behavior: 'smooth' });
    });
    next.addEventListener('click', () => {
      track.scrollBy({ left: step, behavior: 'smooth' });
    });
  });
  