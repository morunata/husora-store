// js/index.js

// Today's Deals - Now references the globally available products array
const todaysDeals = [
  products[1], products[2], products[4], products[5], products[0], products[3]
];

// Helper to build label row - Now references globally available name objects
function renderLabels(product) {
  return `
    <div class="px-2 pt-2 pb-2 flex items-center space-x-2 text-xs font-semibold">
      <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-sm uppercase">${categoryNames[product.category] || product.category}</span>
      <span class="text-blue-800">&gt;</span>
      <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-sm uppercase">${subcategoryNames[product.subcategory] || product.subcategory}</span>
      ${product.subcategory2 ? `
        <span class="text-blue-800">&gt;</span>
        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-sm uppercase">${subcategory2Names[product.subcategory2] || product.subcategory2}</span>` : ``}
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
              <p class="text-gray-800 font-medium mt-1">$${product.price.toFixed(2)}</p>
            </div>
          </div>
        `).join('')}
      </div>`;
  }

  sectionHTML += `</div></section>`;
  container.insertAdjacentHTML("beforeend", sectionHTML);
}

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
            <div class="bg-white rounded-sm border border-gray-300 shadow-sm hover:shadow-md transition overflow-hidden">
              ${renderLabels(product)}
              <a href="product.html?id=${product.id}">
                <img src="${product.images[0] || 'placeholder.jpg'}" alt="${product.name}" class="w-full h-60 object-cover mb-0"/>
              </a>
              <div class="p-4">
                <h3 class="text-lg font-semibold">${product.name}</h3>
                <p class="text-gray-600 text-sm">${product.description}</p>
                <p class="text-gray-800 font-medium mt-1">$${product.price.toFixed(2)}</p>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="mt-8 text-center">
          <a href="catalog.html?subcategory=${subcategory}"
             class="inline-block bg-blue-600 text-white px-6 py-3 rounded-sm font-semibold hover:bg-blue-700 transition whitespace-nowrap min-w-[160px]">
            Разгледай ${displayName}
          </a>
        </div>
      </div>
    </section>
  `;

  container.insertAdjacentHTML("beforeend", sectionHTML);
}

function renderTodaysDeals() {
  const container = document.getElementById("todays-deals");
  if (!container) return;

  container.innerHTML = todaysDeals.map(product => `
    <div class="bg-white rounded-sm border border-gray-300 shadow-sm hover:shadow-md transition overflow-hidden">
      ${renderLabels(product)}
      <a href="product.html?id=${product.id}">
        <img src="${product.images[0] || 'placeholder.jpg'}" alt="${product.name}" class="w-full h-80 object-cover mb-0"/>
      </a>
      <div class="p-6">
        <h3 class="text-2xl font-semibold">${product.name}</h3>
        <p class="text-gray-600 text-sm mb-2">${product.description}</p>
        <p class="text-gray-800 font-medium text-xl">$${product.price.toFixed(2)}</p>
      </div>
    </div>
  `).join('');
}

function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return; // Add check for grid existence

  const shuffled = [...products].sort(() => 0.5 - Math.random()).slice(0, 10);

  grid.innerHTML = shuffled.map(product => `
    <div class="bg-white rounded-sm border border-gray-300 shadow-sm hover:shadow-md transition overflow-hidden">
      ${renderLabels(product)}
      <a href="product.html?id=${product.id}">
        <img src="${product.images[0] || 'placeholder.jpg'}" alt="${product.name}" class="w-full h-60 object-cover"/>
      </a>
      <div class="p-4">
        <h3 class="text-lg font-semibold">${product.name}</h3>
        <p class="text-gray-600 text-sm">${product.description}</p>
        <p class="text-gray-800 font-medium mt-1">$${product.price.toFixed(2)}</p>
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
  renderSubcategorySection("seat", "Селекция Seat", "bg-white");
});
