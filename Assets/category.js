document.addEventListener("DOMContentLoaded", function () {
  console.log("JS loaded and running!");

  const tags = document.querySelectorAll(".category-tag");
  const mainImage = document.getElementById("dog-category-image"); // 主圖
  const mainLink = document.getElementById("dog-category-link"); // 包圖片的 <a>
  const hoverImage = document.getElementById("dog-hover-image"); // 擊掌圖
  const overlay = document.querySelector(".dark-overlay"); // 黑遮罩

  const defaultMainImage = "https://cdn.shopify.com/s/files/1/0611/7992/0584/files/dog-paw-pawinspired.jpg?v=1744794386";
  const hoverImageSrc = "https://cdn.shopify.com/s/files/1/0611/7992/0584/files/we-connect-hand-and-paw-pawinspired.jpg?v=1745225176";

  const imageMap = {
    "Disposable Diaper": {
      url: "https://cdn.shopify.com/s/files/1/0611/7992/0584/files/disposable-dog-diaper-shiba-sideview-pawinspired.jpg?v=1745216011",
      link: "/products/disposable-dog-diapers"
    },
    "Washable Diaper": {
      url: "https://cdn.shopify.com/s/files/1/0611/7992/0584/files/washsable-dog-diaper-yorkie-pawinspired.jpg?v=1745217580",
      link: "/products/washable-dog-diapers"
    },
    "Disposable Pad": {
      url: "https://cdn.shopify.com/s/files/1/0611/7992/0584/files/heavy-duty-dog-pads-24hr-adhesive-30ct-pawinspired.jpg?v=1745220636",
      link: "/collections/disposable-pee-pads"
    },
    "Washable Pad": {
      url: "https://cdn.shopify.com/s/files/1/0611/7992/0584/files/washable-dog-pad-westie-beige-pawinspired.jpg?v=1745221638",
      link: "/collections/washable-pee-pads"
    },
    "Crate Mat": {
      url: "https://cdn.shopify.com/s/files/1/0611/7992/0584/files/washable-dog-pad-chihuahua-gray-pawinspired.jpg?v=1745221883",
      link: "/products/crate-mats"
    },
    "Playpen Mat": {
      url: "https://cdn.shopify.com/s/files/1/0611/7992/0584/files/round-playpen-mats-bordercollie-gray-pawinspired.jpg?v=1745222609",
      link: "/collections/playpen-mats"
    }
  };

  // Hover 顯示擊掌圖，隱藏黑色遮罩
  mainImage.addEventListener("mouseenter", () => {
    mainImage.src = hoverImageSrc;
    overlay.style.opacity = "0";
  });

  mainImage.addEventListener("mouseleave", () => {
    mainImage.src = defaultMainImage;
    overlay.style.opacity = "1";
  });

  // 點擊 tag 切換圖片與連結
  tags.forEach(tag => {
    tag.addEventListener("click", () => {
      const selected = tag.innerText.trim();

      // 移除 active 樣式
      tags.forEach(t => t.classList.remove("active"));
      tag.classList.add("active");

      if (imageMap[selected]) {
        mainImage.src = imageMap[selected].url;
        mainLink.href = imageMap[selected].link;
        overlay.style.opacity = "0";
      } else {
        mainImage.src = defaultMainImage;
        mainLink.href = "/collections/dog-products";
        overlay.style.opacity = "1";
      }
    });
  });
});
