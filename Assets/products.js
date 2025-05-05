document.addEventListener('DOMContentLoaded', () => {
    const tabs      = document.querySelectorAll('.products-tabs .tab-button');
    const wrapper   = document.querySelector('.products-carousel-wrapper');
    const carousel  = wrapper.querySelector('.products-carousel');
    const progress  = document.createElement('div');
    const fill      = document.createElement('div');
    const dragBtn   = wrapper.querySelector('.drag-handle');
  
    // 建立 progress bar
    progress.classList.add('products-progress');
    fill.classList.add('progress-fill');
    progress.appendChild(fill);
    wrapper.insertAdjacentElement('afterend', progress);
  
    // 切 tab
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t=>t.classList.remove('active'));
        tab.classList.add('active');
        const key = tab.dataset.tab;
        // 重新 include snippet 的作法：把 Liquid 輸出到全域變數
        const data = window.products_data[key];
        renderCarousel(data);
      });
    });
  
    // 拖拉滑動
    let isDown = false, startX, scrollLeft;
    dragBtn.addEventListener('mousedown', e => {
      isDown = true;
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });
    window.addEventListener('mouseup', () => isDown = false);
    window.addEventListener('mousemove', e => {
      if(!isDown) return;
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2; // 滑速倍率
      carousel.scrollLeft = scrollLeft - walk;
    });
  
    // 進度條更新
    const updateProgress = () => {
      const pct = carousel.scrollLeft / (carousel.scrollWidth - carousel.clientWidth);
      fill.style.width = `${pct * 100}%`;
    };
    carousel.addEventListener('scroll', updateProgress);
  
    // 初始
    updateProgress();
  });
  
  // 將 Liquid products_data 變成 JS 全域變數
  window.products_data = {{ products_data | json }};
  