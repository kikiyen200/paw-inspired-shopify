
document.addEventListener("DOMContentLoaded", function () {
  console.log("Category JS loaded");
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  // ========== DOG ==========
  const dogTags = document.querySelectorAll('.category-tag[data-type="dog"]');
  const dogImage = document.getElementById("dog-category-image");
  const dogLink = document.getElementById("dog-category-link");
  const dogOverlay = document.querySelector("#dog-category-image + .image-hover + .dark-overlay");
  const dogDefaultDesktopImage = "https://cdn.shopify.com/s/files/1/0611/7992/0584/files/dog-paw-pawinspired.jpg?v=1744794386";
  const dogDefaultMobileImage = "https://cdn.shopify.com/s/files/1/0611/7992/0584/files/dog-paw-pawinspired_Mb.jpg?v=1748228603";
  let dogHoverLocked = false;

  if (dogImage) {
    dogImage.src = isMobile ? dogDefaultMobileImage : dogDefaultDesktopImage;
  }

  const dogImageMap = {
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

  dogTags.forEach(tag => {
    tag.addEventListener("click", () => {
      const label = tag.innerText.trim();

      if (tag.classList.contains("active") && dogImageMap[label]) {
        window.location.href = dogImageMap[label].link;
        return;
      }

      dogTags.forEach(t => t.classList.remove("active"));
      tag.classList.add("active");

      if (dogImageMap[label]) {
        dogImage.src = dogImageMap[label].url;
        dogLink.href = dogImageMap[label].link;
        dogOverlay.style.opacity = "0";
        dogImage.classList.add("no-hover");
        dogHoverLocked = true;
      } else {
        dogImage.src = isMobile ? dogDefaultMobileImage : dogDefaultDesktopImage;
        dogLink.href = "/collections/dog-products";
        dogOverlay.style.opacity = "1";
        dogImage.classList.remove("no-hover");
        dogHoverLocked = false;
      }
    });
  });

  // ========== CAT ==========
  const catTags = document.querySelectorAll('.category-tag[data-type="cat"]');
  const catImage = document.getElementById("cat-category-image");
  const catLink = document.getElementById("cat-category-link");
  const catOverlay = document.querySelector("#cat-category-image + .image-hover + .dark-overlay");
  const catDefaultDesktopImage = "https://cdn.shopify.com/s/files/1/0611/7992/0584/files/cat-paw-pawinspired.jpg?v=1744794386";
  const catDefaultMobileImage = "https://cdn.shopify.com/s/files/1/0611/7992/0584/files/cat-paw-pawinspired_Mb.jpg?v=1748228603";
  let catHoverLocked = false;

  if (catImage) {
    catImage.src = isMobile ? catDefaultMobileImage : catDefaultDesktopImage;
  }

  const catImageMap = {
    "Disposable Pads": {
      url: "https://cdn.shopify.com/s/files/1/0611/7992/0584/products/Product-PreviewDisposable-Cat-Pad.png?v=1658734959",
      link: "/products/generic-refill-cat-pads-for-purina-tidy-cats-breeze-litter-system"
    },
    "Cleaning Spray": {
      url: "https://cdn.shopify.com/s/files/1/0611/7992/0584/products/Product-PreviewSpray-Bottle.png?v=1658731241",
      link: "/products/stain-and-odor-eliminator"
    }
  };

  catTags.forEach(tag => {
    tag.addEventListener("click", () => {
      const label = tag.innerText.trim();

      if (tag.classList.contains("active") && catImageMap[label]) {
        window.location.href = catImageMap[label].link;
        return;
      }

      catTags.forEach(t => t.classList.remove("active"));
      tag.classList.add("active");

      if (catImageMap[label]) {
        catImage.src = catImageMap[label].url;
        catLink.href = catImageMap[label].link;
        catOverlay.style.opacity = "0";
        catImage.classList.add("no-hover");
        catHoverLocked = true;
      } else {
        catImage.src = isMobile ? catDefaultMobileImage : catDefaultDesktopImage;
        catLink.href = "/collections/cat-products";
        catOverlay.style.opacity = "1";
        catImage.classList.remove("no-hover");
        catHoverLocked = false;
      }
    });
  });

  // ========== SMALL PET ==========
  const smallPetTags = document.querySelectorAll('.category-tag[data-type="small pet"]');
  const smallPetImage = document.getElementById("small-pet-category-image");
  const smallPetLink = document.getElementById("small-pet-category-link");
  const smallPetOverlay = document.querySelector("#small-pet-category-image + .image-hover + .dark-overlay");
  const smallPetDefaultDesktopImage = "https://cdn.shopify.com/s/files/1/0611/7992/0584/files/guinea-pig-paw-pawinspired.jpg?v=1744794386";
  const smallPetDefaultMobileImage = "https://cdn.shopify.com/s/files/1/0611/7992/0584/files/guinea-pig-paw-pawinspired_Mb.jpg?v=1748228603";
  let smallPetHoverLocked = false;

  if (smallPetImage) {
    smallPetImage.src = isMobile ? smallPetDefaultMobileImage : smallPetDefaultDesktopImage;
  }

  const smallPetImageMap = {
    "Toilet": {
      url: "https://cdn.shopify.com/s/files/1/0611/7992/0584/files/small-pet-toilet.jpg?v=1745229999",
      link: "/products/small-pet-toilet"
    },
    "Pads": {
      url: "https://cdn.shopify.com/s/files/1/0611/7992/0584/files/small-pet-pads.jpg?v=1745230001",
      link: "/collections/small-pet-pads"
    },
    "Mats": {
      url: "https://cdn.shopify.com/s/files/1/0611/7992/0584/files/small-pet-mats.jpg?v=1745230002",
      link: "/collections/small-pet-mats"
    },
    "Liners": {
      url: "https://cdn.shopify.com/s/files/1/0611/7992/0584/products/1630_gray.green_01.jpg?v=1675230330",
      link: "/collections/cage-liners"
    },
    "Hammock": {
      url: "https://cdn.shopify.com/s/files/1/0611/7992/0584/files/green-hammock-listing-01.jpg?v=1716537495",
      link: "/products/hammock"
    },
    "Furr-O®": {
      url: "https://cdn.shopify.com/s/files/1/0611/7992/0584/files/pet-bed_45e67ce4-9c5c-4d90-801c-f9d92c22260d.png?v=1712566830",
      link: "/products/furr-o"
    },
    "Snuggle Bunny®": {
      url: "https://cdn.shopify.com/s/files/1/0611/7992/0584/files/Snuggle-Bunny_GREEN_01.jpg?v=1702522612",
      link: "/products/snuggle-bed"
    }
  };

  smallPetTags.forEach(tag => {
    tag.addEventListener("click", () => {
      const label = tag.innerText.trim();

      if (tag.classList.contains("active") && smallPetImageMap[label]) {
        window.location.href = smallPetImageMap[label].link;
        return;
      }

      smallPetTags.forEach(t => t.classList.remove("active"));
      tag.classList.add("active");

      if (smallPetImageMap[label]) {
        smallPetImage.src = smallPetImageMap[label].url;
        smallPetLink.href = smallPetImageMap[label].link;
        smallPetOverlay.style.opacity = "0";
        smallPetImage.classList.add("no-hover");
        smallPetHoverLocked = true;
      } else {
        smallPetImage.src = isMobile ? smallPetDefaultMobileImage : smallPetDefaultDesktopImage;
        smallPetLink.href = "/collections/small-animal-products";
        smallPetOverlay.style.opacity = "1";
        smallPetImage.classList.remove("no-hover");
        smallPetHoverLocked = false;
      }
    });
  });

});