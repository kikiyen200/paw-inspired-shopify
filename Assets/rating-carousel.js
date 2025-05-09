document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.rating-carousel .rc-track');
    const slides = Array.from(track.children);
    const prevBtn = document.querySelector('.rating-carousel .prev');
    const nextBtn = document.querySelector('.rating-carousel .next');
    let index = 0;
  
    function scrollToSlide(i) {
      slides[i].scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  
    prevBtn.addEventListener('click', () => {
      index = Math.max(0, index - 1);
      scrollToSlide(index);
    });
  
    nextBtn.addEventListener('click', () => {
      index = Math.min(slides.length - 1, index + 1);
      scrollToSlide(index);
    });
  });
  