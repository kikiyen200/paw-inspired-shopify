document.addEventListener("DOMContentLoaded", function() {
    const track = document.querySelector(".rc-track");
    const slides = Array.from(track.children);
    const prevBtn = document.querySelector(".rc-arrow.prev");
    const nextBtn = document.querySelector(".rc-arrow.next");
  
    // 偵測哪一個 slide 最接近容器中心
    function updateActive() {
      const trackRect = track.getBoundingClientRect();
      const centerX = trackRect.left + trackRect.width / 2;
      let closest = null, minDist = Infinity;
  
      slides.forEach(slide => {
        const rect = slide.getBoundingClientRect();
        const slideCenter = rect.left + rect.width / 2;
        const dist = Math.abs(slideCenter - centerX);
        if (dist < minDist) {
          minDist = dist;
          closest = slide;
        }
      });
  
      slides.forEach(slide => {
        const video = slide.querySelector("video");
        if (slide === closest) {
          slide.classList.add("active");
          video.play();
        } else {
          slide.classList.remove("active");
          video.pause();
          video.currentTime = 0;
        }
      });
    }
  
    // Throttle 函數
    function throttle(fn, wait = 100) {
      let last = 0;
      return function(...args) {
        const now = Date.now();
        if (now - last > wait) {
          last = now;
          fn.apply(this, args);
        }
      };
    }
  
    // 滾動時更新
    track.addEventListener("scroll", throttle(updateActive, 100));
    updateActive(); // 初次啟動
  
    // 箭頭事件：平滑滾動到上一／下一張
    prevBtn.addEventListener("click", () => {
      const idx = slides.findIndex(s => s.classList.contains("active"));
      const target = slides[Math.max(0, idx - 1)];
      target.scrollIntoView({ behavior: "smooth", inline: "center" });
    });
    nextBtn.addEventListener("click", () => {
      const idx = slides.findIndex(s => s.classList.contains("active"));
      const target = slides[Math.min(slides.length - 1, idx + 1)];
      target.scrollIntoView({ behavior: "smooth", inline: "center" });
    });
  });
  