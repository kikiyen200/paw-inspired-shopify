document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.products-section');
    if (!section) return;
  
    const tabs = section.querySelectorAll('.tab-button');
    const wrappers = section.querySelectorAll('.products-carousel-wrapper');
  
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        section.querySelector('.tab-button.active')?.classList.remove('active');
        tab.classList.add('active');
        const name = tab.dataset.tab;
        wrappers.forEach(w => {
          w.style.display = (w.dataset.tab === name) ? 'block' : 'none';
        //   if (shouldShow) {
        //   w.scrollLeft = 0; 
        // }
        });
      });
    });
  
    wrappers.forEach(wrap => {

      const carousel = wrap.querySelector('.products-carousel');
      const prevButton = wrap.querySelector('.carousel-arrow.prev');
const nextButton = wrap.querySelector('.carousel-arrow.next');

if (prevButton && nextButton && carousel) {
  const card = carousel.querySelector('.product-card');
  const gap = parseFloat(getComputedStyle(carousel).gap || 16);
  const cardWidth = card.offsetWidth + gap;

  prevButton.addEventListener('click', () => {
    carousel.scrollBy({ left: -cardWidth * 2, behavior: 'smooth' });
  });

  nextButton.addEventListener('click', () => {
    carousel.scrollBy({ left: cardWidth * 2, behavior: 'smooth' });
  });
}

    
  
      let isDown = false, startX = 0, scrollLeft = 0, clickStart = 0;
  
      drag.addEventListener('mousedown', e => {
        isDown = true;
        startX = e.pageX;
        scrollLeft = scrollTarget.scrollLeft;
        drag.style.cursor = 'grabbing';
        clickStart = Date.now();
      });
  
      document.addEventListener('mouseup', () => {
        isDown = false;
        drag.style.cursor = 'grab';
      });
  
      document.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const walk = (e.pageX - startX) * 2;
        scrollTarget.scrollLeft = scrollLeft - walk;
        updateProgress();
      });
  
      drag.addEventListener('click', () => {
        if (Date.now() - clickStart > 300) return;
        const card = carousel.querySelector('.product-card');
        if (!card) return;
        const gap = parseFloat(getComputedStyle(carousel).gap || 16);
        const cardWidth = card.offsetWidth + gap;
        scrollTarget.scrollBy({ left: cardWidth * 4, behavior: 'smooth' });
  
        let frameCount = 0;
        const maxFrames = 30;
        const trackProgress = () => {
          updateProgress();
          frameCount++;
          if (frameCount < maxFrames) {
            requestAnimationFrame(trackProgress);
          }
        };
        requestAnimationFrame(trackProgress);
      });
    });
  });
  