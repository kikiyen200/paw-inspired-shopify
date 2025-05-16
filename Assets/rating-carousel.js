document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.rating-carousel .rc-track');
  const prev  = document.querySelector('.rating-carousel .rc-arrow.prev');
  const next  = document.querySelector('.rating-carousel .rc-arrow.next');
  if (!track || !prev || !next) return;

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const visibleCount = isMobile ? 1 : 2;

  const reviews = Array.from(track.querySelectorAll('.rc-review'));
  const originalWidth = track.scrollWidth;
  reviews.slice(0, visibleCount).forEach(card => {
    track.appendChild(card.cloneNode(true));
  });

  const style = getComputedStyle(track);
  const gap   = parseInt(style.getPropertyValue('gap'), 10) || 0;
  const card  = track.querySelector('.rc-review');
  const step  = card.offsetWidth + gap;

  next.addEventListener('click', () => {
    track.scrollBy({ left: step * visibleCount, behavior: 'smooth' });
    setTimeout(() => {
      if (track.scrollLeft >= originalWidth) {
        track.scrollLeft -= originalWidth;
      }
    }, 300);
  });

  prev.addEventListener('click', () => {
    if (track.scrollLeft <= 0) {
      track.scrollLeft = originalWidth;
    }
    track.scrollBy({ left: -step * visibleCount, behavior: 'smooth' });
  });
});