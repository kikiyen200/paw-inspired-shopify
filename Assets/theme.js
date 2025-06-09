window.onload = function () {
    const overlay = document.getElementById("entry-logo-overlay");
    const body = document.body;
  
    const logoWhite = document.querySelector("meta[name='theme-logo-white']").content;
    const logoColor = document.querySelector("meta[name='theme-logo-color']").content;
  
    body.style.overflow = "hidden";
    setTimeout(() => {
      overlay.classList.add("hidden");
      body.classList.add("show-header");
      body.style.overflow = "auto";
    }, 2000);
  
    window.addEventListener("scroll", function () {
      const header = document.querySelector("header.site-header");
      const logoWhiteImg = header.querySelector(".logo-white");
      const logoColorImg = header.querySelector(".logo-color");
  
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
        logoWhiteImg.style.display = "none";
        logoColorImg.style.display = "block";
      } else {
        header.classList.remove("scrolled");
        logoWhiteImg.style.display = "block";
        logoColorImg.style.display = "none";
      }
    });
    window.onload = function () {
    const overlay = document.getElementById("entry-logo-overlay");
    const body = document.body;
  
    if (overlay) {
      body.style.overflow = "hidden";
      setTimeout(() => {
        overlay.classList.add("hidden");
        body.classList.add("show-header");
        body.style.overflow = "auto";
      }, 2000); // 可調整停留秒數
    }
  };
  