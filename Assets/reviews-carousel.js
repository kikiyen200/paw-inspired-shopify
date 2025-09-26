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
    let isScrolling = false;
    let animationId = null;

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    const leftInTrack = (el) => {
      const er = el.getBoundingClientRect();
      const tr = track.getBoundingClientRect();
      return (er.left - tr.left) + track.scrollLeft;
    };

    function smoothScrollTo(targetLeft, duration = 300) {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      const startLeft = track.scrollLeft;
      const distance = targetLeft - startLeft;
      const startTime = performance.now();

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        
        const currentLeft = startLeft + (distance * easedProgress);
        track.scrollLeft = currentLeft;

        if (progress < 1) {
          animationId = requestAnimationFrame(animate);
        } else {
          animationId = null;
          isScrolling = false;
          track.scrollLeft = targetLeft;
        }
      }

      isScrolling = true;
      animationId = requestAnimationFrame(animate);
    }

    const withNoSnap = (fn) => {
      const prevSnap = track.style.scrollSnapType;
      track.style.scrollSnapType = 'none';
      fn();
      
      setTimeout(() => { 
        track.style.scrollSnapType = prevSnap || 'x mandatory'; 
      }, isSafari ? 350 : 200);
    };

    function setActive(index) {
      slides.forEach((s, i) => {
        const v = s.querySelector('video');
        if (i === index) {
          s.classList.add('active');
          if (v) {
            v.play().catch(() => {
              v.muted = true;
              v.play().catch(() => {});
            });
          }
        } else {
          s.classList.remove('active');
          if (v) { 
            v.pause(); 
            v.currentTime = 0; 
          }
        }
      });
      centerIndex = index;
    }

    function centerByIndex(index, { smooth = true } = {}) {
      const slide = slides[index];
      if (!slide) return;

      setActive(index);

      const doCenter = () => {
        const slideLeft = leftInTrack(slide);
        const targetLeft = slideLeft - (track.clientWidth - slide.clientWidth) / 2;
        
        if (smooth && !isSafari) {
          track.scrollTo({ 
            left: targetLeft, 
            behavior: 'smooth' 
          });
          setTimeout(() => { isScrolling = false; }, 400);
        } else if (smooth && isSafari) {
          smoothScrollTo(targetLeft, 400);
        } else {
          track.scrollLeft = targetLeft;
          isScrolling = false;
        }
      };

      requestAnimationFrame(() => {
        withNoSnap(doCenter);
      });
    }

    function updateActiveByCenter() {
      if (isScrolling) return;
      
      const mid = track.scrollLeft + track.clientWidth / 2;
      let best = 0, min = Infinity;
      
      slides.forEach((s, i) => {
        const cx = leftInTrack(s) + s.clientWidth / 2;
        const d = Math.abs(cx - mid);
        if (d < min) { 
          min = d; 
          best = i; 
        }
      });
      
      if (best !== centerIndex) {
        setActive(best);
      }
    }

    prev?.addEventListener('click', (e) => {
      e.preventDefault();
      if (isScrolling) return; 
      
      const i = Math.max(0, centerIndex - 1);
      centerByIndex(i);
    });
    
    next?.addEventListener('click', (e) => {
      e.preventDefault();
      if (isScrolling) return; 
      
      const i = Math.min(slides.length - 1, centerIndex + 1);
      centerByIndex(i);
    });

    let scrollTimeout;
    let lastScrollTime = 0;
    
    track.addEventListener('scroll', (e) => {
      const now = performance.now();
      
      if (now - lastScrollTime < 16) { 
        return;
      }
      lastScrollTime = now;
      
      clearTimeout(scrollTimeout);
      cancelAnimationFrame(track.__rcRaf);
      
      scrollTimeout = setTimeout(() => {
        if (!isScrolling) {
          track.__rcRaf = requestAnimationFrame(updateActiveByCenter);
        }
      }, isSafari ? 100 : 50);
    }, { passive: true });

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!isScrolling) {
          centerByIndex(centerIndex, { smooth: false });
        }
      }, 200);
    });

    let touchStartX = null;
    let touchStartScrollLeft = null;
    let isTouching = false;
    
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartScrollLeft = track.scrollLeft;
      isTouching = true;
    }, { passive: true });
    
    track.addEventListener('touchmove', (e) => {
      if (!isTouching || !touchStartX) return;
      
      const touchCurrentX = e.touches[0].clientX;
      const deltaX = touchStartX - touchCurrentX;
      
      if (isSafari) {
        e.preventDefault();
        track.scrollLeft = touchStartScrollLeft + deltaX;
      }
    }, { passive: false });
    
    track.addEventListener('touchend', (e) => {
      isTouching = false;
      touchStartX = null;
      touchStartScrollLeft = null;
 
      setTimeout(() => {
        if (!isScrolling) {
          updateActiveByCenter();
          setTimeout(() => {
            centerByIndex(centerIndex, { smooth: true });
          }, 100);
        }
      }, 50);
    }, { passive: true });

    track.addEventListener('keydown', (e) => {
      if (isScrolling) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          const prevIndex = Math.max(0, centerIndex - 1);
          centerByIndex(prevIndex);
          break;
        case 'ArrowRight':
          e.preventDefault();
          const nextIndex = Math.min(slides.length - 1, centerIndex + 1);
          centerByIndex(nextIndex);
          break;
      }
    });

    setTimeout(() => {
      centerByIndex(centerIndex, { smooth: false });
    }, 100);

    if (isSafari) {
      const ensureProperInit = () => {
        setTimeout(() => {
          if (!isScrolling) {
            centerByIndex(centerIndex, { smooth: false });
          }
        }, 500);
      };

      if (document.readyState === 'complete') {
        ensureProperInit();
      } else {
        window.addEventListener('load', ensureProperInit);
      }
    }

    carousel._cleanup = () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      clearTimeout(scrollTimeout);
      clearTimeout(resizeTimeout);
    };
  });
}

window.addEventListener('beforeunload', () => {
  document.querySelectorAll('.reviews-carousel').forEach((carousel) => {
    if (carousel._cleanup) {
      carousel._cleanup();
    }
  });
});

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    setTimeout(() => {
      initCarousel();
    }, 100);
  }
});