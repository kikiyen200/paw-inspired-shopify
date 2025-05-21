document.addEventListener("DOMContentLoaded", function () {
  const iframe = document.getElementById("video-frame");

  if (iframe) {
    const isMobile = window.innerWidth <= 768;
    const initialUrl = isMobile ? iframe.dataset.mobile : iframe.dataset.web;

    if (initialUrl) {
      let videoId = '';
      if (initialUrl.includes('youtu.be/')) {
        videoId = initialUrl.split('youtu.be/')[1].split('?')[0];
      } else if (initialUrl.includes('v=')) {
        videoId = initialUrl.split('v=')[1].split('&')[0];
      }

      if (videoId) {
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${videoId}&modestbranding=1&rel=0&iv_load_policy=3`;
      }
    }
  }

  const cards = document.querySelectorAll('.video-carousel-section .product-card');

  cards.forEach(card => {
    card.addEventListener('click', function (e) {
      if (e.target.closest('.add-to-cart')) return;

      const isMobile = window.innerWidth <= 768;
      const newVideo = isMobile
        ? this.dataset.videoMobile
        : this.dataset.videoWeb;

      if (newVideo && iframe) {
        let videoId = '';
        if (newVideo.includes('youtu.be/')) {
          videoId = newVideo.split('youtu.be/')[1].split('?')[0];
        } else if (newVideo.includes('watch?v=')) {
          videoId = newVideo.split('v=')[1].split('&')[0];
        } else if (newVideo.includes('/shorts/')) {
          videoId = newVideo.split('/shorts/')[1].split('?')[0];
        }

        if (videoId) {
          iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${videoId}&modestbranding=1&rel=0&iv_load_policy=3`;
          e.preventDefault(); 
        }
      }
    });
  });
});