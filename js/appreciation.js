// js/appreciation.js

document.addEventListener("DOMContentLoaded", () => {
  // Sample data for appreciation photos. Each item now has an 'images' array.
  // REMEMBER TO REPLACE THESE WITH YOUR ACTUAL IMAGE PATHS!
  const appreciationPhotos = [{
    id: 1,
    thumbnail: "images/appreciation/test/1.jpg",
    images: [
      "images/appreciation/test/1.jpg", // First image for lightbox
      "images/appreciation/test/2.jpg", // Second image for lightbox
      "images/appreciation/test/3.jpg" // Third image for lightbox
    ],
    productUsed: "Front Bumper, Lower Grill",
    productLink: "product.html?id=1",
    instagramHandle: "@awesome_customer_1"
  }, {
    id: 2,
    thumbnail: "images/appreciation/rozov/1.jpg",
    images: [
      "images/appreciation/rozov/1.jpg",
      "images/appreciation/rozov/2.jpg",
    ],
    productUsed: "Custom Dice Set",
    productLink: "product.html?id=2",
    instagramHandle: "@happy_user_2"
  }, {
    id: 3,
    thumbnail: "images/appreciation/customer_mod_thumb_3.jpg",
    images: [
      "images/appreciation/customer_mod_full_3a.jpg" // Even if only one, keep as array for consistency
    ],
    productUsed: "Another Product Example",
    productLink: "product.html?id=3",
    instagramHandle: "@design_lover_3"
  }, {
    id: 4,
    thumbnail: "images/appreciation/customer_car_thumb_4.jpg",
    images: [
      "images/appreciation/customer_car_full_4a.jpg",
      "images/appreciation/customer_car_full_4b.jpg"
    ],
    productUsed: "Front Bumper, Lower Grill",
    productLink: "product.html?id=1",
    instagramHandle: "@car_enthusiast_4"
  }, {
    id: 5,
    thumbnail: "images/appreciation/customer_interior_thumb_5.jpg",
    images: [
      "images/appreciation/customer_interior_full_5a.jpg"
    ],
    productUsed: "Custom Dice Set",
    productLink: "product.html?id=2",
    instagramHandle: "@interior_stylist_5"
  }, ];

  const gridContainer = document.getElementById('appreciation-grid');
  const lightbox = document.getElementById('lightbox');
  const lightboxProductLink = document.getElementById('lightbox-product-link');
  const lightboxInstagramLink = document.getElementById('lightbox-instagram-link');
  const desktopNav = document.getElementById("nav-buttons-desktop");

  let currentSwiper = null; // To hold the Swiper instance
  let isLightboxActive = false; // NEW: State variable to track lightbox status

  // SVG Data URIs for arrows (white and blue)
  const svgRightArrowWhite = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' id='Outline' viewBox='0 0 24 24' width='512' height='512'%3E%3Cpath d='M7,24a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42l8.17-8.17a3,3,0,0,0,0-4.24L6.29,1.71A1,1,0,0,1,7.71.29l8.17,8.17a5,5,0,0,1,0,7.08L7.71,23.71A1,1,0,0,1,7,24Z' fill='gray'/%3E%3C/svg%3E\")";
  const svgLeftArrowWhite = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' id='Outline' viewBox='0 0 24 24' width='512' height='512'%3E%3Cpath d='M17.17,24a1,1,0,0,1-.71-.29L8.29,15.54a5,5,0,0,1,0-7.08L16.46.29a1,1,0,1,1,1.42,1.42L9.71,9.88a3,3,0,0,0,0,4.24l8.17,8.17a1,1,0,0,1,0,1.42A1,1,0,0,1,17.17,24Z' fill='gray'/%3E%3C/svg%3E\")";

  const svgRightArrowBlue = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' id='Outline' viewBox='0 0 24 24' width='512' height='512'%3E%3Cpath d='M7,24a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42l8.17-8.17a3,3,0,0,0,0-4.24L6.29,1.71A1,1,0,0,1,7.71.29l8.17,8.17a5,5,0,0,1,0,7.08L7.71,23.71A1,1,0,0,1,7,24Z' fill='%232563eb'/%3E%3C/svg%3E\")"; // Changed fill to blue
  const svgLeftArrowBlue = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' id='Outline' viewBox='0 0 24 24' width='512' height='512'%3E%3Cpath d='M17.17,24a1,1,0,0,1-.71-.29L8.29,15.54a5,5,0,0,1,0-7.08L16.46.29a1,1,0,1,1,1.42,1.42L9.71,9.88a3,3,0,0,0,0,4.24l8.17,8.17a1,1,0,0,1,0,1.42A1,1,0,0,1,17.17,24Z' fill='%232563eb'/%3E%3C/svg%3E\")"; // Changed fill to blue


  function renderAppreciationGrid() {
    gridContainer.innerHTML = appreciationPhotos.map(photo => `
      <div class="bg-white rounded-sm border border-gray-300 shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer"
           onclick="openAppreciationLightbox(${photo.id})">
        <img src="${photo.thumbnail}" alt="Appreciation Photo Thumbnail" class="w-full h-96 object-cover">
      </div>
    `).join('');
  }

  window.openAppreciationLightbox = (photoId) => {
    const photo = appreciationPhotos.find(p => p.id === photoId);
    if (photo) {
      lightboxProductLink.href = photo.productLink;
      lightboxProductLink.textContent = photo.productUsed;
      lightboxInstagramLink.href = `https://www.instagram.com/${photo.instagramHandle.replace('@', '')}`;
      lightboxInstagramLink.textContent = photo.instagramHandle;

      // Hide the desktop navigation bar when lightbox opens
      if (desktopNav) {
        desktopNav.classList.add("-translate-y-full");
      }
      // NEW: Set lightbox active state and add class to body
      isLightboxActive = true;
      document.body.classList.add('lightbox-active');

      // Initialize or update Swiper
      const swiperWrapper = document.querySelector('.lightbox-swiper .swiper-wrapper');
      swiperWrapper.innerHTML = ''; // Clear previous slides

      photo.images.forEach(imageSrc => {
        const swiperSlide = document.createElement('div');
        swiperSlide.classList.add('swiper-slide');
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = "Appreciation Photo";
        // Ensure 'max-h-[XXvh]' is adjusted here if you changed it earlier
        img.classList.add('w-full', 'h-auto', 'max-h-[72vh]', 'object-contain');
        swiperSlide.appendChild(img);
        swiperWrapper.appendChild(swiperSlide);
      });

      // Destroy previous Swiper instance if it exists
      if (currentSwiper) {
        currentSwiper.destroy(true, true);
      }

      // Initialize new Swiper instance
      currentSwiper = new Swiper(".lightbox-swiper", {
        loop: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        on: {
          init: function() {
            // Apply initial arrow colors
            const nextButton = document.querySelector('.lightbox-swiper .swiper-button-next');
            const prevButton = document.querySelector('.lightbox-swiper .swiper-button-prev');
            if (nextButton) {
              nextButton.style.backgroundImage = svgRightArrowWhite;
              nextButton.style.backgroundRepeat = 'no-repeat';
              nextButton.style.backgroundPosition = 'center';
              nextButton.style.backgroundSize = '90% auto';
              nextButton.style.transition = 'background-image 0.3s ease, background-color 0.3s ease'; // Add transition for image
            }
            if (prevButton) {
              prevButton.style.backgroundImage = svgLeftArrowWhite;
              prevButton.style.backgroundRepeat = 'no-repeat';
              prevButton.style.backgroundPosition = 'center';
              prevButton.style.backgroundSize = '90% auto';
              prevButton.style.transition = 'background-image 0.3s ease, background-color 0.3s ease'; // Add transition for image
            }
          }
        }
      });

      // Add hover effects for arrows
      const nextButton = document.querySelector('.lightbox-swiper .swiper-button-next');
      const prevButton = document.querySelector('.lightbox-swiper .swiper-button-prev');

      if (nextButton) {
        nextButton.addEventListener('mouseenter', () => {
          nextButton.style.backgroundImage = svgRightArrowBlue;
        });
        nextButton.addEventListener('mouseleave', () => {
          nextButton.style.backgroundImage = svgRightArrowWhite;
        });
      }

      if (prevButton) {
        prevButton.addEventListener('mouseenter', () => {
          prevButton.style.backgroundImage = svgLeftArrowBlue;
        });
        prevButton.addEventListener('mouseleave', () => {
          prevButton.style.backgroundImage = svgLeftArrowWhite;
        });
      }


      lightbox.classList.remove('hidden');
      setTimeout(() => {
        lightbox.classList.add('opacity-100');
        lightbox.classList.remove('opacity-0');
      }, 10);
    }
  };

  window.closeLightbox = () => {
    lightbox.classList.remove('opacity-100');
    lightbox.classList.add('opacity-0');
    setTimeout(() => {
      lightbox.classList.add('hidden');
      if (currentSwiper) {
        currentSwiper.destroy(true, true);
        currentSwiper = null;
      }
      // Reset arrow styles when lightbox closes
      const nextButton = document.querySelector('.lightbox-swiper .swiper-button-next');
      const prevButton = document.querySelector('.lightbox-swiper .swiper-button-prev');
      if (nextButton) nextButton.style.backgroundImage = svgRightArrowWhite;
      if (prevButton) prevButton.style.backgroundImage = svgLeftArrowWhite;

      // Show the desktop navigation bar when lightbox closes, based on scroll position
      if (desktopNav) {
        // Only show if user is at top or scrolling up
        // Assuming 'lastScrollY' is accessible (e.g., from a global scope or similar)
        // If 'lastScrollY' is NOT globally accessible, you might need to re-fetch window.scrollY here
        if (window.scrollY <= window.lastScrollY || window.scrollY === 0) {
             desktopNav.classList.remove("-translate-y-full");
        }
      }
      // NEW: Set lightbox inactive state and remove class from body
      isLightboxActive = false;
      document.body.classList.remove('lightbox-active');
    }, 300);
  };

  renderAppreciationGrid();
});