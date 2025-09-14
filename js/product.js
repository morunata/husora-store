    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get("id"));
    const product = products.find(p => p.id === productId);

    const colorSelectContainer = document.getElementById("color-select-container");
    const colorSwatchesContainer = document.getElementById("color-swatches");
    const priceElement = document.getElementById("product-price");
    const mainImage = document.getElementById("main-image");
    const thumbnailsContainer = document.getElementById("thumbnails");

    // Get the buy button
    const buyButton = document.getElementById("buy-button");

    // Cart Modal elements
    const cartModal = document.getElementById('cart-modal');
    const closeModalButton = document.getElementById('close-modal-button');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCartItemsContainer = document.getElementById('modal-cart-items-container');
    const cartItemCountSpan = document.getElementById('cart-item-count');

if (product) {
    console.log("Current Product Data:", product);

    document.getElementById("product-name").textContent = product.name;
    
    document.getElementById("product-description").textContent = product.description;
    document.getElementById("product-category").textContent = categoryNames[product.category] || product.category;
    document.getElementById("product-subcategory").textContent = subcategoryNames[product.subcategory] || product.subcategory;
    const subcat2Elem = document.getElementById("product-subcategory2");
    if (product.subcategory2) {
        subcat2Elem.textContent = subcategory2Names[product.subcategory2] || product.subcategory2;
    } else {
        subcat2Elem.style.display = "none";
    }

    function updateThumbnailScroll(offset) {
        thumbnailsContainer.style.transform = `translateX(-${offset}px)`;
    }

    function setupThumbnails(images) {
        thumbnailsContainer.innerHTML = '';
        if (images && images.length > 0) {
            images.forEach(img => {
                const thumb = document.createElement("img");
                thumb.src = img;
                thumb.className = "w-20 h-20 object-cover border border-gray-300 cursor-pointer hover:border-blue-500";
                thumb.onclick = () => { mainImage.src = img; };
                thumbnailsContainer.appendChild(thumb);
            });
        }
    }

    const modelVariantSection = document.getElementById('model-variant-options');
    const hasVariations = Array.isArray(product.variations) && product.variations.length > 0;

    if (hasVariations) {
        console.log("Product has variations. Showing model/variant options.");
        modelVariantSection.classList.remove("hidden");
        modelVariantSection.style.display = '';

        const modelSelect = document.getElementById("modelSelect");
        const variantSelect = document.getElementById("variantSelect");
        const customModelButton = document.getElementById('custom-model-button');
        const customModelOptionsList = document.getElementById('custom-model-options').querySelector('div');
        const selectedModelValueSpan = document.getElementById('selected-model-value');
        const customVariantButton = document.getElementById('custom-variant-button');
        const customVariantOptionsList = document.getElementById('custom-variant-options').querySelector('div');
        const selectedVariantValueSpan = document.getElementById('selected-variant-value');

        // Populate models
        product.variations.forEach(v => {
            const option = document.createElement("option");
            option.value = v.id;
            option.textContent = v.model;
            modelSelect.appendChild(option);
        });

        // Update variant dropdown based on the selected model
        function updateOptions() {
            const selectedVariation = product.variations.find(v => v.id == modelSelect.value);
            variantSelect.innerHTML = '';
            if (selectedVariation) {
                selectedVariation.options.forEach((opt, index) => {
                    const optionEl = document.createElement("option");
                    optionEl.value = opt.id;
                    optionEl.textContent = opt.variant;
                    variantSelect.appendChild(optionEl);
                });
            }
            updateProductDetails();
        }
        
        // Update product price, ID, and image
        function updateProductDetails() {
            const selectedVariation = product.variations.find(v => v.id == modelSelect.value);
            const selectedOption = selectedVariation.options.find(opt => opt.id == variantSelect.value);
            
            if (selectedOption) {
                priceElement.textContent = `BGN ${selectedOption.price.toFixed(2)}`;
            }

            // Check if the selected model has colors
            if (selectedVariation.hasColors) {
                setupColorSwatches(product.id, selectedVariation.id, selectedOption.id);
            } else {
                colorSelectContainer.classList.add("hidden");
                updateProductIdDisplay(product.id, selectedVariation.id, selectedOption.id);
            }

            updateSpotlightImage(selectedVariation.spotlightImage);
        }

        // Logic for custom dropdown buttons
        function populateCustomDropdown(nativeSelect, customOptionsList, selectedValueSpan, customButton) {
            if (!nativeSelect || !customOptionsList || !selectedValueSpan || !customButton) return;
            customOptionsList.innerHTML = '';
            Array.from(nativeSelect.options).forEach(option => {
                const link = document.createElement('a');
                link.href = '#';
                link.classList.add('block', 'px-4', 'py-2', 'text-sm', 'text-gray-700', 'hover:bg-gray-100');
                link.dataset.value = option.value;
                link.textContent = option.textContent;
                link.addEventListener('click', event => {
                    event.preventDefault();
                    selectedValueSpan.textContent = link.textContent;
                    nativeSelect.value = link.dataset.value;
                    nativeSelect.dispatchEvent(new Event('change'));
                    customButton.nextElementSibling.classList.add('hidden');
                    customButton.setAttribute('aria-expanded', 'false');
                    customButton.querySelector('svg')?.classList.remove('svg-active');
                });
                customOptionsList.appendChild(link);
            });
            const initial = nativeSelect.options[nativeSelect.selectedIndex];
            selectedValueSpan.textContent = initial ? initial.textContent : 'Select an option';
        }

        function setupCustomDropdownToggle(customButton) {
            if (!customButton) return;
            const optionsContainer = customButton.nextElementSibling;
            const svgArrow = customButton.querySelector('svg');
            customButton.addEventListener('click', event => {
                const isHidden = optionsContainer.classList.contains('hidden');
                document.querySelectorAll('.origin-top-left').forEach(container => {
                    if (container !== optionsContainer) {
                        container.classList.add('hidden');
                        container.previousElementSibling?.querySelector('svg')?.classList.remove('svg-active');
                    }
                });
                optionsContainer.classList.toggle('hidden', !isHidden);
                customButton.setAttribute('aria-expanded', isHidden);
                svgArrow?.classList.toggle('svg-active', isHidden);
            });
            document.addEventListener('click', event => {
                if (!customButton.contains(event.target) && !optionsContainer.contains(event.target)) {
                    optionsContainer.classList.add('hidden');
                    customButton.setAttribute('aria-expanded', 'false');
                    svgArrow?.classList.remove('svg-active');
                }
            });
        }
        
        // Function to change the spotlight image
        function updateSpotlightImage(imageSource) {
            if (imageSource) {
                mainImage.src = imageSource;
            } else {
                mainImage.src = product.images[0] || "placeholder.jpg";
            }
        }

        // Function to update the product number with the selected color index
        function updateProductIdDisplay(baseId, variationId, variantId, colorIndex = null) {
            let newProductId = `${baseId}-${variationId}-${variantId}`;
            if (colorIndex !== null) {
                newProductId += `-${colorIndex}`;
            }
            document.getElementById("product-id-display").textContent = `${newProductId}`;
        }
        
        // Function to generate and display all color swatches from the master list
function setupColorSwatches(currentProductId, variationId, variantId) {
    colorSelectContainer.classList.remove("hidden");
    colorSwatchesContainer.innerHTML = '';

    orderedColorNames.forEach((colorName, index) => {
        const colorCode = availableColors[colorName];
        if (!colorCode) return; // Skip if color name doesn't exist in availableColors

        const button = document.createElement("button");
        button.className = `w-6 h-6 rounded-full border-2 focus:outline-none transition-transform transform hover:scale-110 ring-gray-300 ring-offset-2 ring-1`;
        button.style.backgroundColor = colorCode;
        button.title = colorName.charAt(0).toUpperCase() + colorName.slice(1);
        button.dataset.colorName = colorName;
        // Assign the ID from the `colorIndexMap` or a new index
        button.dataset.colorIndex = colorIndexMap[colorName]; 

        button.addEventListener("click", () => {
            document.querySelectorAll("#color-swatches button").forEach(btn => {
                btn.classList.remove("ring-2", "ring-offset-2", "ring-blue-500", "ring-1");
                btn.classList.add("ring-gray-300", "ring-1");
            });
            button.classList.remove("ring-gray-300", "ring-1");
            button.classList.add("ring-2", "ring-offset-2", "ring-blue-500");
            updateProductIdDisplay(currentProductId, variationId, variantId, button.dataset.colorIndex);
        });

        colorSwatchesContainer.appendChild(button);
    });

    // Automatically select the first color
    const firstColorButton = colorSwatchesContainer.querySelector("button");
    if (firstColorButton) {
        firstColorButton.click();
    }
}
        
        // Initialization
        populateCustomDropdown(modelSelect, customModelOptionsList, selectedModelValueSpan, customModelButton);
        updateOptions(); // loads variants and details
        populateCustomDropdown(variantSelect, customVariantOptionsList, selectedVariantValueSpan, customVariantButton);

        // Listeners for changes
        modelSelect.addEventListener('change', () => {
            updateOptions();
        });

        variantSelect.addEventListener('change', updateProductDetails);

        setupCustomDropdownToggle(customModelButton);
        setupCustomDropdownToggle(customVariantButton);

        setupThumbnails(product.images);
    } else {
        modelVariantSection.classList.add('hidden');
        mainImage.src = product.images[0] || "placeholder.jpg";
        priceElement.textContent = `BGN ${product.price.toFixed(2)}`;
        setupThumbnails(product.images);
        console.log("No models or variations found. Hiding section.");
        document.getElementById("product-id-display").textContent = `${product.id}`;
    }
    renderRelevantProducts(product.subcategory, product.subcategory2, product.id);

window.changeQuantity = (change) => {
    const quantityInput = document.getElementById('quantity');
    let currentQuantity = parseInt(quantityInput.value);
    currentQuantity += change;
    if (currentQuantity < 1) {
        currentQuantity = 1;
    }
    quantityInput.value = currentQuantity;
};

const buyButton = document.getElementById("buy-button");

if (buyButton) {
    buyButton.addEventListener('click', () => {
        const productName = document.getElementById('product-name').textContent;
        const productId = document.getElementById('product-id-display').textContent;
        const quantity = parseInt(document.getElementById('quantity').value);
        const cartItem = {
            name: productName,
            id: productId,
            quantity: quantity
        };

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === cartItem.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        
        // This is the correct way to open the modal
        if (typeof openCartModal === 'function') {
            openCartModal();
        }

        // Обнови брояча на продуктите в хедъра
        if (cartItemCountSpan) {
            const uniqueItemsCount = cart.length;
            cartItemCountSpan.textContent = uniqueItemsCount;
            cartItemCountSpan.classList.remove('hidden');
        }
    });
}

} else {
    console.warn("Product not found or ID missing from URL.");
     document.body.innerHTML = "<div class='flex flex-col items-center justify-center min-h-screen text-center text-gray-700'> <h1 class='text-3xl font-bold'>Продуктът не е намерен.</h1> <p class='mt-2'>Моля, проверете URL адреса.</p> </div>";
}

// Populate tab contents

// 1. PRODUCT DETAIL TAB
document.getElementById("tab-detail").innerHTML = product.productDetail || "No details available.";

// 2. FITS THESE CARS TAB (render as a table)
if (Array.isArray(product.fitsTheseCars) && product.fitsTheseCars.length > 0) {
  const tableHTML = `
    <table class="min-w-full text-sm border border-gray-300 text-gray-800">
      <thead class="bg-gray-300 font-semibold">
        <tr>
          <th class="px-4 py-2 border-b text-left">Марка</th>
          <th class="px-4 py-2 border-b text-left">Модел</th>
          <th class="px-4 py-2 border-b text-left">Генерация</th>
          <th class="px-4 py-2 border-b text-left">Двигател</th>
          <th class="px-4 py-2 border-b text-left">Бележки</th>
        </tr>
      </thead>
      <tbody>
        ${product.fitsTheseCars.map(car => {
            // Handle both object and string formats for fitsTheseCars
            if (typeof car === 'object' && car !== null) {
                return `
                  <tr class="border-t even:bg-gray-50">
                    <td class="px-4 py-2">${car.make || '-'}</td>
                    <td class="px-4 py-2">${car.model || '-'}</td>
                    <td class="px-4 py-2">${car.submodel || '-'}</td>
                    <td class="px-4 py-2">${car.engine || '-'}</td>
                    <td class="px-4 py-2">${car.notes || '-'}</td>
                  </tr>
                `;
            } else {
                // For old string format, display in the first column or a suitable column
                return `
                  <tr class="border-t even:bg-gray-50">
                    <td class="px-4 py-2" colspan="5">${car}</td>
                  </tr>
                `;
            }
        }).join('')}
      </tbody>
    </table>
  `;
  document.getElementById("tab-fits").innerHTML = tableHTML;
} else {
  document.getElementById("tab-fits").innerHTML = "No compatibility data available.";
}

// 3. FAQ TAB
if (Array.isArray(product.faq) && product.faq.length > 0) {
  document.getElementById("tab-faq").innerHTML = product.faq
    .map(f => `
      <div class="mb-4">
        <p class="font-semibold text-gray-800"><span class="text-blue-600">В:</span> ${f.q}</p>
        <p class="text-gray-700"><span class="text-green-600">О:</span> ${f.a}</p>
      </div>
    `)
    .join('');
} else {
  document.getElementById("tab-faq").innerHTML = "Няма често задавани въпроси за този продукт.";
}

document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('save-button');

    if (saveButton) {
        // Initialize the saved state (you might load this from local storage or an API)
        let isSaved = false; // Set to true if product is already saved

        // Function to update the button's state
        function updateSaveButtonState() {
            if (isSaved) {
                saveButton.setAttribute('data-saved', 'true');
            } else {
                saveButton.setAttribute('data-saved', 'false');
            }
        }

        // Initial state update
        updateSaveButtonState();

        saveButton.addEventListener('click', () => {
            isSaved = !isSaved; // Toggle the saved state
            updateSaveButtonState(); // Update button appearance
            // Here you would also call your backend API or local storage to save/unsave the product
            console.log(`Product is now ${isSaved ? 'saved' : 'unsaved'}`);
        });
    }
});


  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active from all buttons and contents
      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      // Activate the clicked tab and related content
      btn.classList.add("active");
      const tabId = btn.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });


function renderRelevantProducts(subcategory, subcategory2, excludeId) {
  const container = document.getElementById("product-grid2");
  if (!container) return;

  const relevant = products
    .filter(p => p.subcategory === subcategory && p.id !== excludeId)
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);

  if (relevant.length === 0) {
    container.innerHTML = "<p class='text-center text-gray-600'>Няма подходящи продукти.</p>";
    return;
  }

  container.innerHTML = relevant.map(product => {
    // Determine the image and price based on whether styles exist
    const displayImage = (product.styles && product.styles.length > 0) ? product.styles[0].images[0] : product.images[0];
    const displayPrice = (product.styles && product.styles.length > 0) ? product.styles[0].price : product.price;

    return `
      <div class="bg-white rounded-sm border border-gray-300 shadow-sm hover:shadow-md transition overflow-hidden">
        <div class="px-2 pt-2 pb-0 flex items-center space-x-2 text-xs font-semibold">
          <span class="text-sm text-gray-600 mb-2">${categoryNames[product.category] || product.category}</span>
          <span class="text-sm text-gray-600 text-blue-600 mb-2">&gt;</span>
          <span class="text-sm text-gray-600 mb-2">${subcategoryNames[product.subcategory] || product.subcategory}</span>
          <span class="text-sm text-gray-600 text-blue-600 mb-2"></span>
          <span class="text-sm text-gray-600 mb-2">${subcategory2Names[product.subcategory2] || product.subcategory2}</span>
        </div>
        <a href="product.html?id=${product.id}">
          <img src="${displayImage || 'placeholder.jpg'}" alt="${product.name}" class="w-full h-60 object-cover"/>
        </a>
        <div class="p-4">
          <h3 class="text-lg font-semibold">${product.name}</h3>
          <p class="text-gray-600 text-sm">${product.description}</p>
          <p class="text-gray-800 font-medium mt-1">BGN ${displayPrice.toFixed(2)}</p>
        </div>
      </div>
    `;
  }).join('');
}

// Function to render the "Recommended for you" products
function renderRecommendedProducts() {
    const grid = document.getElementById("recommended-products-grid");
    if (!grid) return;

    // Get 5 random products that are not the current product being viewed
    const recommendedProducts = products.filter(p => p.id !== product.id)
                                        .sort(() => 0.5 - Math.random())
                                        .slice(0, 5);

    grid.innerHTML = recommendedProducts.map(recommendedProduct => `
      <div class="product-card bg-white rounded-sm border border-gray-300 shadow-sm hover:shadow-md transition overflow-hidden" data-product-id="${recommendedProduct.id}">
        ${renderLabels(recommendedProduct)}
        <a href="product.html?id=${recommendedProduct.id}">
          <img src="${recommendedProduct.images[0] || 'placeholder.jpg'}" alt="${recommendedProduct.name}" class="product-image w-full h-60 object-cover"/>
        </a>
        ${recommendedProduct.images.length > 1 ? `
          <div class="image-dots-container">
            ${recommendedProduct.images.map((img, index) => `<span class="dot ${index === 0 ? 'active' : ''}"></span>`).join('')}
          </div>
        ` : ``}
        <div class="p-4">
          <h3 class="text-lg font-semibold">${recommendedProduct.name}</h3>
          <p class="text-gray-600 text-sm">${recommendedProduct.description}</p>
          <p class="text-gray-800 font-medium mt-1">BGN ${recommendedProduct.price.toFixed(2)}</p>
        </div>
      </div>
    `).join('');

    // Add the image scrub and dot effect
    const productCards = grid.querySelectorAll('.product-card');

    productCards.forEach(card => {
      const imgElement = card.querySelector('.product-image');
      const dotContainer = card.querySelector('.image-dots-container');
      const dots = dotContainer ? Array.from(dotContainer.querySelectorAll('.dot')) : [];
      const productId = card.dataset.productId;
      const recommendedProduct = products.find(p => p.id === parseInt(productId));

      // Skip if product data is missing, there's only one image, or no dots container
      if (!recommendedProduct || !imgElement || !recommendedProduct.images || recommendedProduct.images.length < 2) {
        return;
      }

      // Add a mousemove event listener to the card
      card.addEventListener('mousemove', (event) => {
        const rect = imgElement.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const percentage = (mouseX / rect.width);
        const imageIndex = Math.min(
          Math.floor(percentage * recommendedProduct.images.length),
          recommendedProduct.images.length - 1
        );
        imgElement.src = recommendedProduct.images[imageIndex];

        // Update the active dot
        if (dots.length > 0) {
          dots.forEach(dot => dot.classList.remove('active'));
          dots[imageIndex].classList.add('active');
        }
      });

      // Reset to the first image and dot when the mouse leaves
      card.addEventListener('mouseleave', () => {
        imgElement.src = recommendedProduct.images[0];
        if (dots.length > 0) {
          dots.forEach(dot => dot.classList.remove('active'));
          dots[0].classList.add('active');
        }
      });
    });
}

// Lightbox functions
function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = src;
  lightbox.classList.remove('hidden');
  setTimeout(() => {
    lightbox.classList.add('opacity-100');
    lightbox.classList.remove('opacity-0');
  }, 10);
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  lightbox.classList.remove('opacity-100');
  lightbox.classList.add('opacity-0');
  setTimeout(() => {
    lightbox.classList.add('hidden');
  }, 300);
}

document.getElementById("lightbox").addEventListener("click", (e) => {
  if (e.target.id === "lightbox") closeLightbox();
});

// Find the bookmark button and icons
const bookmarkBtn = document.getElementById("bookmark-btn");
const bookmarkIconEmpty = document.getElementById("bookmark-icon-empty");
const bookmarkIconFilled = document.getElementById("bookmark-icon-filled");
const bookmarkText = document.getElementById("bookmark-text");

// Function to get bookmarked product IDs from localStorage
function getBookmarkedProductIds() {
    const bookmarks = localStorage.getItem("bookmarks");
    return bookmarks ? JSON.parse(bookmarks) : [];
}

// Function to save bookmarked product IDs to localStorage
function saveBookmarkedProductIds(ids) {
    localStorage.setItem("bookmarks", JSON.stringify(ids));
}

// Function to check if the current product is bookmarked
function isProductBookmarked(productId) {
    const bookmarkedIds = getBookmarkedProductIds();
    return bookmarkedIds.includes(productId);
}

// Function to update the bookmark button's state
function updateBookmarkButtonState() {
    if (isProductBookmarked(product.id)) {
        bookmarkIconEmpty.classList.add("hidden");
        bookmarkIconFilled.classList.remove("hidden");
        bookmarkText.textContent = "";
    } else {
        bookmarkIconEmpty.classList.remove("hidden");
        bookmarkIconFilled.classList.add("hidden");
        bookmarkText.textContent = "";
    }
}

// Add event listener to the bookmark button
if (bookmarkBtn) {
    bookmarkBtn.addEventListener("click", () => {
        let bookmarkedIds = getBookmarkedProductIds();
        const productId = product.id; // Assuming 'product' is available in this scope

        if (isProductBookmarked(productId)) {
            // Remove from bookmarks
            bookmarkedIds = bookmarkedIds.filter(id => id !== productId);
        } else {
            // Add to bookmarks
            bookmarkedIds.push(productId);
        }
        saveBookmarkedProductIds(bookmarkedIds);
        updateBookmarkButtonState(); // Update button appearance immediately
    });
}



// Initial state update when product page loads
if (product) { // Ensure this runs only if a product is found
    // ... all your existing code
    updateBookmarkButtonState();
}

// Render the recommended products section
renderRecommendedProducts();
