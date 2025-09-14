// cart.js – 3 колони: ляво (инфо+qty), среда (вариации/цветове), дясно (цена+X)

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartContainer = document.getElementById("cart-items-container");
const orderSummaryContainer = document.getElementById("order-summary-container");
const orderSummaryTotal = document.getElementById("order-summary-total");

// === Helpers за ID ===
function parseProductId(raw) {
  const clean = raw.replace("Код на продукта: ", "");
  const parts = clean.split("-");
  const base = parseInt(parts[0]);
  const model = parts[1] ? parseInt(parts[1].replace(/\D/g, "")) : null;
  const variant = parts[2] ? parseInt(parts[2]) : null;
  const color = parts[3] ? parseInt(parts[3]) : null;
  const hasParens = parts[1] ? /^\(\d+\)$/.test(parts[1]) : false;

  return { base, model, variant, color, hasParens };
}

function buildProductId(base, model, variant, color, useParens = true) {
  const modelPart = useParens && model !== null ? `(${model})` : `${model}`;
  let id = `${base}-${modelPart}-${variant}`;
  if (color !== null && color !== undefined) id += `-${color}`;
  return id;
}

function createColorMap() {
  const colorMap = {};
  for (const [name, hex] of Object.entries(availableColors)) {
    const index = colorIndexMap[name];
    if (index !== undefined) colorMap[index] = hex;
  }
  return colorMap;
}

// === Рендериране на количката ===
function renderCart() {
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p class='text-gray-600'>Количката е празна.</p>";
    return;
  }

  const colorMap = createColorMap();

  cart.forEach((item, index) => {
    const { base, model, variant, color, hasParens } = parseProductId(item.id);
    const product = products.find(p => p.id === base);
    if (!product) return;

    const variation = model !== null ? product.variations.find(v => v.id === model) : null;
    const option = variant !== null ? variation?.options.find(opt => opt.id === variant) : null;

    const price = option ? option.price : product.price;
    const image = variation?.spotlightImage || product.images[0];

    const row = document.createElement("div");
    row.className = "flex items-start border-b py-4 gap-4";

    let colorSwatchesHtml = "";
    if (variation?.hasColors) {
      colorSwatchesHtml = `
        <div class="flex space-x-1 mt-1">
          ${Object.entries(colorMap).map(([id, hex]) => `
            <div 
              class="color-swatch w-5 h-5 rounded-full border border-gray-300 cursor-pointer ${parseInt(id) === color ? 'ring-2 ring-blue-500' : ''}"
              style="background-color: ${hex};"
              data-color-id="${id}"
            ></div>
          `).join('')}
        </div>
      `;
    }

    // HTML за персонализирани бутони и падащи менюта
    const modelsDropdown = variation ? `
      <div class="relative inline-block text-left w-full" data-dropdown-id="model-${index}">
        <button type="button" class="w-full text-left text-sm font-medium text-black px-3 py-1 border border-gray-300 bg-white rounded-sm shadow-sm flex justify-between items-center transition-colors duration-200 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" aria-haspopup="listbox" aria-expanded="false">
          <span class="block truncate">${variation.model}</span>
          <svg class="-mr-1 ml-2 h-4 w-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1.51,6.079a1.492,1.492,0,0,1,1.06.44l7.673,7.672a2.5,2.5,0,0,0,3.536,0L21.44,6.529A1.5,1.5,0,1,1,23.561,8.65L15.9,16.312a5.505,5.505,0,0,1-7.778,0L.449,8.64A1.5,1.5,0,0,1,1.51,6.079Z" />
          </svg>
        </button>
        <div class="hidden origin-top-left absolute right-0 mt-1 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10" role="menu" tabindex="-1">
          <div class="py-1" role="none">
            ${product.variations.map(v => `
              <div class="py-1 px-4 hover:bg-gray-100 cursor-pointer text-sm" data-value="${v.id}" data-type="model">${v.model}</div>
            `).join('')}
          </div>
        </div>
      </div>
    ` : '';

    const variantsDropdown = option ? `
      <div class="relative inline-block text-left w-full" data-dropdown-id="variant-${index}">
        <button type="button" class="w-full text-left text-sm font-medium text-black px-3 py-1 border border-gray-300 bg-white rounded-sm shadow-sm flex justify-between items-center transition-colors duration-200 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" aria-haspopup="listbox" aria-expanded="false">
          <span class="block truncate">${option.variant}</span>
          <svg class="-mr-1 ml-2 h-4 w-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1.51,6.079a1.492,1.492,0,0,1,1.06.44l7.673,7.672a2.5,2.5,0,0,0,3.536,0L21.44,6.529A1.5,1.5,0,1,1,23.561,8.65L15.9,16.312a5.505,5.505,0,0,1-7.778,0L.449,8.64A1.5,1.5,0,0,1,1.51,6.079Z" />
          </svg>
        </button>
        <div class="hidden origin-top-left absolute right-0 mt-1 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10" role="menu" tabindex="-1">
          <div class="py-1" role="none">
            ${variation.options.map(opt => `
              <div class="py-1 px-4 hover:bg-gray-100 cursor-pointer text-sm" data-value="${opt.id}" data-type="variant">${opt.variant}</div>
            `).join('')}
          </div>
        </div>
      </div>
    ` : '';

    row.innerHTML = `
      <img src="${image}" class="w-24 h-24 object-cover rounded border"/>

      <div class="w-full">
        <div class="item-grid grid grid-cols-3 gap-4 items-start">
          <div>
            <h3 class="font-semibold text-lg">${item.name}</h3>
            <p class="text-gray-600 text-base">Код на продукта: ${item.id}</p>
            <div class="flex items-center mt-1 font-semibold">
              <button class="quantity-btn text-gray-600 hover:text-red-500" data-item-id="${item.id}" data-change="-1">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
              </button>
              <span class="mx-2 text-sm">${item.quantity}</span>
              <button class="quantity-btn text-gray-600 hover:text-blue-600" data-item-id="${item.id}" data-change="1">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
          </div>

          <div class="flex flex-col items-center gap-2">
            ${modelsDropdown}
            ${variantsDropdown}
            ${colorSwatchesHtml}
          </div>

          <div class="self-center">
            <div class="flex items-center justify-end gap-3">
              <p class="text-gray-800 font-bold">BGN ${(price * item.quantity).toFixed(2)}</p>
              <button class="remove-item-btn text-gray-400 hover:text-red-500 transition-colors duration-200" data-item-id="${item.id}" onclick="event.preventDefault(); event.stopPropagation();">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // === Слушатели ===
    row.querySelectorAll(".quantity-btn").forEach(button => {
      button.addEventListener("click", e => {
        const id = e.currentTarget.dataset.itemId;
        const change = parseInt(e.currentTarget.dataset.change);
        updateQuantity(id, change);
      });
    });

    row.querySelector(".remove-item-btn").addEventListener("click", e => {
      const id = e.currentTarget.dataset.itemId;
      removeItem(id);
    });

    // Логика за персонализираните dropdown-и
    const modelButton = row.querySelector('[data-dropdown-id^="model-"] > button');
    if (modelButton) {
      const modelOptions = row.querySelector('[data-dropdown-id^="model-"] > div');
      const modelOptionsList = row.querySelectorAll('[data-dropdown-id^="model-"] [data-type="model"]');
      const modelSvg = row.querySelector('[data-dropdown-id^="model-"] svg');

      modelButton.addEventListener("click", () => {
        const isExpanded = modelButton.getAttribute('aria-expanded') === 'true';
        modelButton.setAttribute('aria-expanded', !isExpanded);
        modelOptions.classList.toggle('hidden');
        modelSvg.classList.toggle('svg-active');
      });

      modelOptionsList.forEach(option => {
        option.addEventListener("click", (e) => {
          const newModel = parseInt(e.target.dataset.value);
          const newVariation = product.variations.find(v => v.id === newModel);
          const newOptionId = newVariation?.options[0]?.id || 1;
          const newColor = newVariation?.hasColors ? 1 : null;
          cart[index].id = buildProductId(base, newModel, newOptionId, newColor, hasParens);
          
          row.querySelector('[data-dropdown-id^="model-"] > button > span').textContent = newVariation.model;
          
          saveCart();
          modelOptions.classList.add('hidden');
          modelButton.setAttribute('aria-expanded', 'false');
          modelSvg.classList.remove('svg-active');
        });
      });
    }

    const variantButton = row.querySelector('[data-dropdown-id^="variant-"] > button');
    if (variantButton) {
      const variantOptions = row.querySelector('[data-dropdown-id^="variant-"] > div');
      const variantOptionsList = row.querySelectorAll('[data-dropdown-id^="variant-"] [data-type="variant"]');
      const variantSvg = row.querySelector('[data-dropdown-id^="variant-"] svg');

      variantButton.addEventListener("click", () => {
        const isExpanded = variantButton.getAttribute('aria-expanded') === 'true';
        variantButton.setAttribute('aria-expanded', !isExpanded);
        variantOptions.classList.toggle('hidden');
        variantSvg.classList.toggle('svg-active');
      });

      variantOptionsList.forEach(option => {
        option.addEventListener("click", (e) => {
          const newVariant = parseInt(e.target.dataset.value);
          cart[index].id = buildProductId(base, model, newVariant, color, hasParens);

          const selectedOption = variation.options.find(opt => opt.id === newVariant);
          row.querySelector('[data-dropdown-id^="variant-"] > button > span').textContent = selectedOption.variant;

          saveCart();
          variantOptions.classList.add('hidden');
          variantButton.setAttribute('aria-expanded', 'false');
          variantSvg.classList.remove('svg-active');
        });
      });
    }

    row.querySelectorAll(".color-swatch").forEach(swatch => {
      swatch.addEventListener("click", () => {
        const newColor = parseInt(swatch.dataset.colorId);
        cart[index].id = buildProductId(base, model, variant, newColor, hasParens);
        saveCart();
      });
    });

    cartContainer.appendChild(row);
  });
}

function updateQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        saveCart();
    }
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
}

// === Преглед на поръчката ===
function renderOrderSummary() {
  orderSummaryContainer.innerHTML = "";
  let totalOrderPrice = 0;

  if (cart.length === 0) {
    orderSummaryContainer.innerHTML = "<p class='text-gray-600'>Няма артикули за поръчка.</p>";
    orderSummaryTotal.textContent = "0.00";
    return;
  }

  cart.forEach(item => {
    const { base, model, variant } = parseProductId(item.id);
    const product = products.find(p => p.id === base);
    if (!product) return;

    const variation = model !== null ? product.variations.find(v => v.id === model) : null;
    const option = variant !== null ? variation?.options.find(opt => opt.id === variant) : null;

    const price = option ? option.price : product.price;
    const itemTotalPrice = price * item.quantity;
    totalOrderPrice += itemTotalPrice;

    const div = document.createElement("div");
    div.className = "flex justify-between items-start py-2 border-b";

    div.innerHTML = `
      <div>
        <h4 class="font-semibold">${item.quantity} x ${item.name}</h4>
        <p class="text-xs text-gray-500">Код: ${item.id}</p>
      </div>
      <p class="font-medium">BGN ${itemTotalPrice.toFixed(2)}</p>
    `;

    orderSummaryContainer.appendChild(div);
  });

  orderSummaryTotal.textContent = totalOrderPrice.toFixed(2);
}

// === Запис и инициализация ===
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  renderOrderSummary();
}

renderCart();
renderOrderSummary();