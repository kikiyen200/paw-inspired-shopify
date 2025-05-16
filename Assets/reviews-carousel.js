document.addEventListener('DOMContentLoaded', initCarousel);
document.addEventListener('shopify:section:load', initCarousel);

function initCarousel() {
  document.querySelectorAll('.reviews-carousel').forEach(carousel => {
    const track = carousel.querySelector('.rc-track');
    const slides = Array.from(track.querySelectorAll('.rc-slide'));
    const prev = carousel.querySelector('.rc-arrow.prev');
    const next = carousel.querySelector('.rc-arrow.next');

    let centerIndex = Math.floor(slides.length / 2);

    function scrollToCenter(index) {
      const targetSlide = slides[index];
      if (!targetSlide) return;

      const trackRect = track.getBoundingClientRect();
      const targetRect = targetSlide.getBoundingClientRect();

      const scrollLeft =
        track.scrollLeft +
        (targetRect.left - trackRect.left) -
        (track.offsetWidth / 2 - targetSlide.offsetWidth / 2);

      track.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      setTimeout(updateActiveByCenter, 400);
    }

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

    next.addEventListener('click', () => {
      centerIndex = Math.min(centerIndex + 1, slides.length - 1);
      scrollToCenter(centerIndex);
    });

    prev.addEventListener('click', () => {
      centerIndex = Math.max(centerIndex - 1, 0);
      scrollToCenter(centerIndex);
    });

    track.addEventListener('scroll', () => {
      window.requestAnimationFrame(updateActiveByCenter);
    });

    window.addEventListener('resize', () => {
      scrollToCenter(centerIndex);
    });

    scrollToCenter(centerIndex);
    updateActiveByCenter();
  });
}
