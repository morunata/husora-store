// js/index.js

// Today's Deals - Now references the globally available products array
const todaysDeals = [
  products[1], products[2], products[4], products[5], products[0], products[3]
];

// Helper to build label row - Now references globally available name objects
function renderLabels(product) {
  return `
    <div class="px-2 pt-2 pb-0 flex items-center space-x-2 text-xs font-semibold">
      <span class="text-sm text-gray-600 mb-2">${categoryNames[product.category] || product.category}</span>
      <span class="text-sm text-blue-600 mb-2 ">&gt;</span>
      <span class="text-sm text-gray-600 mb-2">${subcategoryNames[product.subcategory] || product.subcategory}</span>
      ${product.subcategory2 ? `
        <span class="text-sm text-blue-600 text-gray-600 mb-2">&gt;</span>
        <span class="text-sm text-gray-600 mb-2">${subcategory2Names[product.subcategory2] || product.subcategory2}</span>` : ``}
    </div>
  `;
}

function renderGroupedSubcategories(category, displayName, bgClass = "bg-white") {
  const container = document.getElementById("category-sections");
  if (!container) return;

  const categoryProducts = products.filter(p => p.category === category);
  if (categoryProducts.length === 0) return;

  const groupedBySub = categoryProducts.reduce((acc, product) => {
    const sub = product.subcategory || "Other";
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(product);
    return acc;
  }, {});

  let sectionHTML = `<section class="py-12 ${bgClass}">
    <div class="max-w-[1600px] mx-auto px-20">
      <h2 class="text-2xl font-bold mb-6">${displayName}</h2>`;

  for (const [subKey, items] of Object.entries(groupedBySub)) {
    const subDisplay = subcategoryNames[subKey] || subKey;

    sectionHTML += `
      <h3 class="text-xl font-semibold mb-4 mt-8">${subDisplay}</h3>
      <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        ${items.map(product => `
          <div class="bg-white rounded-sm border border-gray-300 shadow-sm hover:shadow-md transition overflow-hidden">
            ${renderLabels(product)}
            <a href="product.html?id=${product.id}">
              <img src="${product.images[0] || 'placeholder.jpg'}" alt="${product.name}" class="w-full h-60 object-cover"/>
            </a>
            <div class="p-4">
              <h3 class="text-lg font-semibold">${product.name}</h3>
              <p class="text-gray-600 text-sm">${product.description}</p>
              <p class="text-gray-800 font-medium mt-1">BGN ${product.price.toFixed(2)}</p>
            </div>
          </div>
        `).join('')}
      </div>`;
  }

  sectionHTML += `</div></section>`;
  container.insertAdjacentHTML("beforeend", sectionHTML);
}

// Function to render sections by subcategory (e.g., "Селекция Audi")
function renderSubcategorySection(subcategory, displayName, bgClass = "bg-white") {
  const container = document.getElementById("category-sections");
  if (!container) return;

  const subcategoryProducts = products.filter(p => p.subcategory === subcategory).slice(0, 4);
  if (subcategoryProducts.length === 0) return;

  const sectionHTML = `
    <section class="py-12 ${bgClass}">
      <div class="max-w-[1600px] mx-auto px-20">
        <h2 class="text-2xl font-bold mb-6">${displayName}</h2>
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          ${subcategoryProducts.map(product => `
            <div class="product-card bg-white rounded-sm border border-gray-300 shadow-sm hover:shadow-md transition overflow-hidden" data-product-id="${product.id}">
              ${renderLabels(product)}
              <a href="product.html?id=${product.id}">
                <img src="${product.images[0] || 'placeholder.jpg'}" alt="${product.name}" class="product-image w-full h-60 object-cover mb-0"/>
              </a>
              ${product.images.length > 1 ? `
                <div class="image-dots-container">
                  ${product.images.map((img, index) => `<span class="dot ${index === 0 ? 'active' : ''}"></span>`).join('')}
                </div>
              ` : ``}
              <div class="p-4">
                <h3 class="text-lg font-semibold">${product.name}</h3>
                <p class="text-gray-600 text-sm">${product.description}</p>
                <p class="text-gray-800 font-medium mt-1">BGN ${product.price.toFixed(2)}</p>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="mt-8 text-center">
<button 
  onclick="
    this.classList.add('clicked-effect');
    setTimeout(() => {
      this.classList.remove('clicked-effect');
      window.location.href = 'catalog.html';
    }, 150);
  " window.location.href='catalog.html?subcategory=${subcategory}'"
  class="animate-glow px-14 h-14 rounded-full border-2 border-blue-600 bg-blue-600 text-white font-semibold shadow-md transition duration-300 hover:bg-blue-800 hover:text-white hover:border-blue-800">
  Разгледай ${displayName}
</button>

        </div>
      </div>
    </section>
  `; // Tuk e kopcheto za razgledai audi/bmw ili kvoto i da e

  container.insertAdjacentHTML("beforeend", sectionHTML);
}

function renderTodaysDeals() {
  const container = document.getElementById("todays-deals");
  if (!container) return;

  container.innerHTML = todaysDeals.map(product => `
    <div class="product-card bg-white rounded-sm border border-gray-300 shadow-sm hover:shadow-md transition overflow-hidden" data-product-id="${product.id}">
      ${renderLabels(product)}
      <a href="product.html?id=${product.id}">
        <img src="${product.images[0] || 'placeholder.jpg'}" alt="${product.name}" class="product-image w-full h-80 object-cover mb-0"/>
      </a>
      ${product.images.length > 1 ? `
        <div class="image-dots-container">
          ${product.images.map((img, index) => `<span class="dot ${index === 0 ? 'active' : ''}"></span>`).join('')}
        </div>
      ` : ``}
      <div class="p-6">
        <h3 class="text-2xl font-semibold">${product.name}</h3>
        <p class="text-gray-600 text-sm mb-2">${product.description}</p>
        <p class="text-gray-800 font-medium text-xl">BGN ${product.price.toFixed(2)}</p>
      </div>
    </div>
  `).join('');
}

// Function to render random products (e.g., "Избрани продукти")
function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return; // Add check for grid existence

  const shuffled = [...products].sort(() => 0.5 - Math.random()).slice(0, 10);

  grid.innerHTML = shuffled.map(product => `
    <div class="product-card bg-white rounded-sm border border-gray-300 shadow-sm hover:shadow-md transition overflow-hidden" data-product-id="${product.id}">
      ${renderLabels(product)}
<a href="product.html?id=${product.id}">
  <img src="${product.images[0] || 'placeholder.jpg'}" alt="${product.name}" class="product-image w-full h-60 object-cover"/>
</a>
${product.images.length > 1 ? `
  <div class="image-dots-container">
    ${product.images.map((img, index) => `<span class="dot ${index === 0 ? 'active' : ''}"></span>`).join('')}
  </div>
` : ``}
<div class="p-4">
  <h3 class="text-lg font-semibold">${product.name}</h3>
        <p class="text-gray-600 text-sm">${product.description}</p>
        <p class="text-gray-800 font-medium mt-1">BGN ${product.price.toFixed(2)}</p>
      </div>
    </div>
  `).join('');
}

document.addEventListener("DOMContentLoaded", () => {
  renderTodaysDeals();
  renderProducts(); // This renders the "Избрани продукти" section
  renderSubcategorySection("audi", "Селекция Audi", "bg-gray-50");
  renderSubcategorySection("bmw", "Селекция BMW", "bg-white");
  renderSubcategorySection("vw", "Селекция Volkswagen", "bg-gray-50");
  renderSubcategorySection("int", "Селекция Интериор", "bg-white");
  
  // New section: Add image scrub and dot effect
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach(card => {
    const imgElement = card.querySelector('.product-image');
    const dotContainer = card.querySelector('.image-dots-container');
    const dots = dotContainer ? Array.from(dotContainer.querySelectorAll('.dot')) : [];
    const productId = card.dataset.productId;
    const product = products.find(p => p.id === parseInt(productId));

    // Skip if product data is missing, there's only one image, or no dots container
    if (!product || !imgElement || !product.images || product.images.length < 2) {
      return; 
    }

    // Add a mousemove event listener to the card
    card.addEventListener('mousemove', (event) => {
      // Get the bounding box of the image element
      const rect = imgElement.getBoundingClientRect();
      // Calculate the horizontal position of the mouse relative to the image
      const mouseX = event.clientX - rect.left;
      // Calculate what percentage the mouse is across the image
      const percentage = (mouseX / rect.width);
      
      // Determine which image to show based on the percentage
      const imageIndex = Math.min(
        Math.floor(percentage * product.images.length),
        product.images.length - 1 // Make sure the index doesn't go out of bounds
      );

      // Update the image source
      imgElement.src = product.images[imageIndex];

      // Update the active dot
      if (dots.length > 0) {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[imageIndex].classList.add('active');
      }
    });

    // Reset to the first image and dot when the mouse leaves
    card.addEventListener('mouseleave', () => {
      imgElement.src = product.images[0];
      if (dots.length > 0) {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[0].classList.add('active');
      }
    });
  });
});

