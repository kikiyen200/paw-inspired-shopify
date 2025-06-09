document.addEventListener('DOMContentLoaded', initCarousel);
document.addEventListener('shopify:section:load', initCarousel);

function initCarousel() {
  document.querySelectorAll('.reviews-carousel').forEach(carousel => {
    const track = carousel.querySelector('.rc-track');
    const slides = Array.from(track.querySelectorAll('.rc-slide'));
    const prev = carousel.querySelector('.rc-arrow.prev');
    const next = carousel.querySelector('.rc-arrow.next');

    let centerIndex = Math.floor(slides.length / 2);

    function updateActiveByCenter() {
      const center = track.scrollLeft + track.offsetWidth / 2;
      let minDiff = Infinity;
      let activeIndex = 0;

      slides.forEach((slide, i) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const diff = Math.abs(center - slideCenter);
        if (diff < minDiff) {
          minDiff = diff;
          activeIndex = i;
        }
      });

      centerIndex = activeIndex;

      slides.forEach((slide, i) => {
        const video = slide.querySelector('video');
        if (i === activeIndex) {
          slide.classList.add('active');
          video?.play().catch(() => {});
        } else {
          slide.classList.remove('active');
          if (video) {
            video.pause();
            video.currentTime = 0;
          }
        }
      });
    }

    // 💡 改用固定 scroll 量（每次滾動一個卡片+間距）
    const scrollStep = 300 + 48; // 假設 slide 寬度 300px，gap 48px（3rem）

    next?.addEventListener('click', () => {
      console.log("➡️ next clicked");
      track.scrollBy({ left: scrollStep, behavior: 'smooth' });
    });

    prev?.addEventListener('click', () => {
      console.log("⬅️ prev clicked");
      track.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    });

    track.addEventListener('scroll', () => {
      window.requestAnimationFrame(updateActiveByCenter);
    });

    window.addEventListener('resize', () => {
      updateActiveByCenter();
    });

    // 初始進場定位到中間
    const initialCenter = slides[centerIndex];
    if (initialCenter) {
      const trackRect = track.getBoundingClientRect();
      const targetRect = initialCenter.getBoundingClientRect();
      const scrollLeft =
        track.scrollLeft +
        (targetRect.left - trackRect.left) -
        (track.offsetWidth / 2 - targetRect.width / 2);

      track.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }

    updateActiveByCenter();
  });
}
