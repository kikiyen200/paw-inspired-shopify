document.addEventListener('DOMContentLoaded', initCarousel);
document.addEventListener('shopify:section:load', initCarousel);

function initCarousel() {
  document.querySelectorAll('.reviews-carousel').forEach((carousel) => {
    const track = carousel.querySelector('.rc-track');
    if (!track) return;

    const slides = Array.from(track.querySelectorAll('.rc-slide'));
    if (!slides.length) return;

    const prev = carousel.querySelector('.rc-arrow.prev');
    const next = carousel.querySelector('.rc-arrow.next');

    let centerIndex = Math.min(2, slides.length - 1);

    const leftInTrack = (el) => {
      const er = el.getBoundingClientRect();
      const tr = track.getBoundingClientRect();
      return (er.left - tr.left) + track.scrollLeft;
    };

    const withNoSnap = (fn) => {
      const prevSnap = track.style.scrollSnapType;
      track.style.scrollSnapType = 'none';
      fn();
      setTimeout(() => { track.style.scrollSnapType = prevSnap || ''; }, 320);
    };

    function setActive(index) {
      slides.forEach((s, i) => {
        const v = s.querySelector('video');
        if (i === index) {
          s.classList.add('active');
          v?.play().catch(()=>{});
        } else {
          s.classList.remove('active');
          if (v) { v.pause(); v.currentTime = 0; }
        }
      });
      centerIndex = index;
    }

    function centerByIndex(index, { smooth = true } = {}) {
      const slide = slides[index];
      if (!slide) return;

      setActive(index);

      const doCenter = () => {
        const left = leftInTrack(slide) - (track.clientWidth - slide.clientWidth) / 2;
        track.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          withNoSnap(doCenter);
        });
      });

      const onEnd = (e) => {
        if (!e || e.target === slide) {
          withNoSnap(doCenter);
          slide.removeEventListener('transitionend', onEnd);
        }
      };
      slide.addEventListener('transitionend', onEnd);
      setTimeout(() => { withNoSnap(doCenter); slide.removeEventListener('transitionend', onEnd); }, 420);
    }

    function updateActiveByCenter() {
      const mid = track.scrollLeft + track.clientWidth / 2;
      let best = 0, min = Infinity;
      slides.forEach((s, i) => {
        const cx = leftInTrack(s) + s.clientWidth / 2;
        const d = Math.abs(cx - mid);
        if (d < min) { min = d; best = i; }
      });
      if (best !== centerIndex) setActive(best);
    }

    prev?.addEventListener('click', () => {
      const i = Math.max(0, centerIndex - 1);
      centerByIndex(i);
    });
    next?.addEventListener('click', () => {
      const i = Math.min(slides.length - 1, centerIndex + 1);
      centerByIndex(i);
    });

    track.addEventListener('scroll', () => {
      cancelAnimationFrame(track.__rcRaf);
      track.__rcRaf = requestAnimationFrame(updateActiveByCenter);
    });

    window.addEventListener('resize', () => {
      centerByIndex(centerIndex, { smooth: false });
    });

    centerByIndex(centerIndex, { smooth: false });
  });
}
