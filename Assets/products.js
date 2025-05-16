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
      });
    });
  });

  wrappers.forEach(wrap => {
    const carousel = wrap.querySelector('.products-carousel');
    const drag = wrap.querySelector('.drag-handle');
    const fill = wrap.querySelector('.progress-fill');

    if (!carousel || !drag || !fill) return;

    function updateProgress() {
      const card = carousel.querySelector('.product-card');
      if (!card) return;
      const total = carousel.scrollWidth - carousel.clientWidth;
      const percent = total ? (carousel.scrollLeft / total) * 100 : 0;
      fill.style.width = `${percent}%`;
    }

    carousel.addEventListener('scroll', updateProgress);
    updateProgress();

    // 拖拉滑動
    let isDown = false, startX = 0, scrollLeft = 0;

    drag.addEventListener('mousedown', e => {
      isDown = true;
      startX = e.pageX;
      scrollLeft = carousel.scrollLeft;
      drag.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', () => {
      isDown = false;
      drag.style.cursor = 'grab';
    });

    document.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const walk = (e.pageX - startX) * 2;
      carousel.scrollLeft = scrollLeft - walk;
      updateProgress();
    });

    // ➡ 按下「Drag Me」時，滾動一頁（4卡寬度）
    drag.addEventListener('click', () => {
      const card = carousel.querySelector('.product-card');
      if (!card) return;
      const gap = parseFloat(getComputedStyle(carousel).gap || 16);
      const cardWidth = card.offsetWidth + gap;
      carousel.scrollBy({ left: cardWidth * 4, behavior: 'smooth' });
    });
  });
});
