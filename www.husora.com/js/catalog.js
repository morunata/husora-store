// js/catalog.js

document.addEventListener("DOMContentLoaded", () => {
  const productListings = document.getElementById("product-list");
  const noProductsMessage = document.getElementById("no-products-message");
  const categoryFilter = document.getElementById("category-filter");
  const subcategoryFilter = document.getElementById("subcategory-filter");
  const subcategory2Filter = document.getElementById("subcategory2-filter");
  const sortBy = document.getElementById("sort-by");
  const clearFiltersBtn = document.getElementById("clear-filters-btn");
  const catalogSearchInput = document.getElementById("desktop-search-input");
  const clearSearchButton = document.getElementById("clear-search");

  // New car filter dropdowns (native selects)
  const carMakeFilter = document.getElementById("car-make-filter");
  const carModelFilter = document.getElementById("car-model-filter");
  const carSubmodelFilter = document.getElementById("car-submodel-filter"); // User referred to this as 'Generation'
  const carFiltersContainer = document.getElementById("car-filters-container"); // New: Container for car filters

  // References for the new custom category dropdown
  const customCategoryButton = document.getElementById('custom-category-button');
  const customCategoryOptionsContainer = customCategoryButton ? document.getElementById('custom-category-options') : null;
  const customCategoryOptionsList = customCategoryOptionsContainer ? customCategoryOptionsContainer.querySelector('div') : null;
  const selectedCategoryValueSpan = document.getElementById('selected-category-value');

  const customSubcategoryButton = document.getElementById('custom-subcategory-button');
  const customSubcategoryOptionsContainer = customSubcategoryButton ? document.getElementById('custom-subcategory-options') : null;
  const customSubcategoryOptionsList = customSubcategoryOptionsContainer ? customSubcategoryOptionsContainer.querySelector('div') : null;
  const selectedSubcategoryValueSpan = document.getElementById('selected-subcategory-value');
  const subcategoryContainer = customSubcategoryButton ? customSubcategoryButton.closest('.mb-4') : null;


  const customSubcategory2Button = document.getElementById('custom-subcategory2-button');
  const customSubcategory2OptionsContainer = customSubcategory2Button ? document.getElementById('custom-subcategory2-options') : null;
  const customSubcategory2OptionsList = customSubcategory2OptionsContainer ? customSubcategory2OptionsContainer.querySelector('div') : null;
  const selectedSubcategory2ValueSpan = document.getElementById('selected-subcategory2-value');
  const subcategory2Container = customSubcategory2Button ? customSubcategory2Button.closest('.mb-4') : null;


  // References for the new custom car filter dropdowns
  const customCarMakeButton = document.getElementById('custom-car-make-button');
  const customCarMakeOptionsContainer = customCarMakeButton ? document.getElementById('custom-car-make-options') : null;
  const customCarMakeOptionsList = customCarMakeOptionsContainer ? customCarMakeOptionsContainer.querySelector('div') : null;
  const selectedCarMakeValueSpan = document.getElementById('selected-car-make-value');

  const customCarModelButton = document.getElementById('custom-car-model-button');
  const customCarModelOptionsContainer = customCarModelButton ? document.getElementById('custom-car-model-options') : null;
  const customCarModelOptionsList = customCarModelOptionsContainer ? customCarModelOptionsContainer.querySelector('div') : null;
  const selectedCarModelValueSpan = document.getElementById('selected-car-model-value');

  const customCarSubmodelButton = document.getElementById('custom-car-submodel-button');
  const customCarSubmodelOptionsContainer = customCarSubmodelButton ? document.getElementById('custom-car-submodel-options') : null;
  const customCarSubmodelOptionsList = customCarSubmodelOptionsContainer ? customCarSubmodelOptionsContainer.querySelector('div') : null;
  const selectedCarSubmodelValueSpan = document.getElementById('selected-car-submodel-value');

  const customSortByButton = document.getElementById('custom-select-button');
  const customSortByOptionsContainer = customSortByButton ? document.getElementById('custom-select-options') : null;
  const customSortByOptionsList = customSortByOptionsContainer ? customSortByOptionsContainer.querySelector('div') : null;
  const selectedSortByValueSpan = document.getElementById('selected-value');


  let currentProducts = [...products]; // Make a mutable copy of the products array

  // Helper to populate custom dropdowns based on native select
  function populateCustomDropdown(nativeSelect, customOptionsList, selectedValueSpan, customButton) {
    if (!nativeSelect || !customOptionsList || !selectedValueSpan || !customButton) {
        console.warn("Missing elements for populateCustomDropdown:", { nativeSelect, customOptionsList, selectedValueSpan, customButton });
        return;
    }

    customOptionsList.innerHTML = ''; // Clear existing options

    // Only add "Всички" (All) option if it's NOT the sort-by dropdown
    if (nativeSelect.id !== 'sort-by') {
        const allOptionLink = document.createElement('a');
        allOptionLink.href = '#';
        allOptionLink.classList.add('block', 'px-4', 'py-2', 'text-sm', 'text-gray-700', 'hover:bg-gray-100', 'dark:text-white', 'dark:hover:bg-gray-600');
        allOptionLink.setAttribute('role', 'menuitem');
        allOptionLink.dataset.value = ''; // Value for "Всички"
        allOptionLink.textContent = 'Всички';
        customOptionsList.appendChild(allOptionLink);

        // Add event listener for the "Всички" option
        allOptionLink.addEventListener('click', (event) => {
            event.preventDefault();
            selectedValueSpan.textContent = 'Всички'; // Update displayed value
            nativeSelect.value = ''; // Set native select value to empty for "Всички"

            // Trigger change event on the native select to activate filters in catalog.js
            nativeSelect.dispatchEvent(new Event('change'));

            customButton.nextElementSibling.classList.add('hidden'); // Close dropdown
            customButton.setAttribute('aria-expanded', 'false');
            if (customButton.querySelector('svg')) {
                customButton.querySelector('svg').classList.remove('svg-active');
            }
        });
    }


    Array.from(nativeSelect.options).forEach(option => {
        if (option.value === '') { // Skip the native "Всички" option, as we've handled it or don't need it
            return;
        }
        const link = document.createElement('a');
        link.href = '#';
        link.classList.add('block', 'px-4', 'py-2', 'text-sm', 'text-gray-700', 'hover:bg-gray-100', 'dark:text-white', 'dark:hover:bg-gray-600');
        link.setAttribute('role', 'menuitem');
        link.dataset.value = option.value;
        link.textContent = option.textContent;

        link.addEventListener('click', (event) => {
            event.preventDefault();
            const newValue = link.dataset.value;
            const newText = link.textContent;

            selectedValueSpan.textContent = newText; // Update displayed value
            nativeSelect.value = newValue; // Update hidden native select value

            // Trigger change event on the native select to activate filters in catalog.js
            nativeSelect.dispatchEvent(new Event('change'));

            customButton.nextElementSibling.classList.add('hidden'); // Close dropdown
            customButton.setAttribute('aria-expanded', 'false');
            if (customButton.querySelector('svg')) {
                customButton.querySelector('svg').classList.remove('svg-active');
            }
        });
        customOptionsList.appendChild(link);
    });

    // Set initial display value for custom button if not set by selection
    const initialSelectedOption = nativeSelect.options[nativeSelect.selectedIndex];
    selectedValueSpan.textContent = initialSelectedOption ? initialSelectedOption.textContent : 'Всички';

    // If it's the sort-by dropdown and its value is 'default', ensure the span shows 'Подразбиране'
    if (nativeSelect.id === 'sort-by' && nativeSelect.value === 'default') {
        selectedValueSpan.textContent = 'Подразбиране';
    }


    // Sync disabled state of the *button* (not the options within it)
    if (nativeSelect.disabled) {
        customButton.disabled = true;
        customButton.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        customButton.disabled = false;
        customButton.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  }

  // Helper to attach event listeners for custom dropdown toggling
  function setupCustomDropdownToggle(customButton) {
    if (!customButton) return; // Guard clause

    const customOptionsContainer = customButton.nextElementSibling; // The div containing options
    const svgArrow = customButton.querySelector('svg');

    if (!customOptionsContainer) {
        console.warn("Custom options container not found for button:", customButton.id);
        return;
    }

    function toggleDropdown(event) {
      if (customButton.disabled) { // Prevent dropdown from opening if button is disabled
          return;
      }
      // Close other open custom dropdowns
      document.querySelectorAll('.origin-top-left').forEach(container => {
          if (container !== customOptionsContainer && !container.classList.contains('hidden')) {
              container.classList.add('hidden');
              const prevButton = container.previousElementSibling;
              if (prevButton) {
                  prevButton.setAttribute('aria-expanded', 'false');
                  if (prevButton.querySelector('svg')) {
                      prevButton.querySelector('svg').classList.remove('svg-active');
                  }
              }
          }
      });

      const isHidden = customOptionsContainer.classList.contains('hidden');
      if (isHidden) {
        customOptionsContainer.classList.remove('hidden');
        customButton.setAttribute('aria-expanded', 'true');
        if (svgArrow) svgArrow.classList.add('svg-active');
      } else {
        customOptionsContainer.classList.add('hidden');
        customButton.setAttribute('aria-expanded', 'false');
        if (svgArrow) svgArrow.classList.remove('svg-active');
      }
    }

    customButton.addEventListener('click', toggleDropdown);

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!customButton.contains(event.target) && !customOptionsContainer.contains(event.target)) {
        customOptionsContainer.classList.add('hidden');
        customButton.setAttribute('aria-expanded', 'false');
        if (svgArrow) svgArrow.classList.remove('svg-active');
      }
    });
  }


  // Populate filter options
  function populateFilters() {
    // Category
    const categories = [...new Set(products.map(p => p.category))];
    categoryFilter.innerHTML = '<option value="">Всички</option>';
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = categoryNames[cat] || cat; // Use categoryNames for display
      categoryFilter.appendChild(option);
    });
    // Update custom category dropdown
    populateCustomDropdown(categoryFilter, customCategoryOptionsList, selectedCategoryValueSpan, customCategoryButton);

    // Initially hide subcategory and car filters
    if (subcategoryContainer) {
        subcategoryContainer.classList.add('hidden');
    }
    carFiltersContainer.classList.add('hidden');

    // Ensure all car filters are reset and their custom dropdowns are updated to reflect disabled state
    carMakeFilter.value = "";
    carModelFilter.value = "";
    carSubmodelFilter.value = "";
    populateCarMakes(); // This will also populate/update custom car make/model/submodel dropdowns
  }

  function updateSubcategoryFilters(selectedCategory = '') {
    subcategoryFilter.innerHTML = '<option value="">Всички</option>';
    subcategoryFilter.disabled = true;
    subcategory2Filter.innerHTML = '<option value="">Всички</option>';
    subcategory2Filter.disabled = true;

    // Show/hide subcategory container based on whether a category is selected
    if (subcategoryContainer) {
        if (selectedCategory) {
            subcategoryContainer.classList.remove('hidden');
        } else {
            subcategoryContainer.classList.add('hidden');
        }
    }

    // Hide subcategory2 container by default when subcategory is reset or category changes
    if (subcategory2Container) {
        subcategory2Container.classList.add('hidden');
    }

    if (selectedCategory) {
      const subcategories = [...new Set(products.filter(p => p.category === selectedCategory).map(p => p.subcategory))];
      subcategories.forEach(sub => {
        if (sub) { // Ensure subcategory exists
          const option = document.createElement("option");
          option.value = sub;
          option.textContent = subcategoryNames[sub] || sub; // Use subcategoryNames for display
          subcategoryFilter.appendChild(option);
        }
      });
      subcategoryFilter.disabled = false;
    }
    // Update custom subcategory dropdown after native select is updated
    populateCustomDropdown(subcategoryFilter, customSubcategoryOptionsList, selectedSubcategoryValueSpan, customSubcategoryButton);
    // Also update custom subcategory2 dropdown as it might be reset
    populateCustomDropdown(subcategory2Filter, customSubcategory2OptionsList, selectedSubcategory2ValueSpan, customSubcategory2Button);
  }

  function updateSubcategory2Filters(selectedCategory = '', selectedSubcategory = '') {
    subcategory2Filter.innerHTML = '<option value="">Всички</option>';
    subcategory2Filter.disabled = true;

    // Show/hide subcategory2 container based on whether a subcategory is selected
    if (subcategory2Container) {
        if (selectedCategory && selectedSubcategory) {
            subcategory2Container.classList.remove('hidden');
        } else {
            subcategory2Container.classList.add('hidden');
        }
    }

    if (selectedCategory && selectedSubcategory) {
      const subcategory2s = [...new Set(products.filter(p => p.category === selectedCategory && p.subcategory === selectedSubcategory).map(p => p.subcategory2))];
      subcategory2s.forEach(sub2 => {
        if (sub2) { // Ensure subcategory2 exists
          const option = document.createElement("option");
          option.value = sub2;
          option.textContent = subcategory2Names[sub2] || sub2; // Use subcategory2Names for display
          subcategory2Filter.appendChild(option);
        }
      });
      subcategory2Filter.disabled = false;
    }
    // Update custom subcategory2 dropdown after native select is updated
    populateCustomDropdown(subcategory2Filter, customSubcategory2OptionsList, selectedSubcategory2ValueSpan, customSubcategory2Button);
  }

  // --- New Car Filter Population Functions ---
  function populateCarMakes() {
    carMakeFilter.innerHTML = '<option value="">Всички</option>';
    const makes = new Set();
    products.forEach(p => {
      if (Array.isArray(p.fitsTheseCars)) {
        p.fitsTheseCars.forEach(car => {
          if (typeof car === 'object' && car.make) {
            makes.add(car.make);
          }
        });
      }
    });
    [...makes].sort().forEach(make => {
      const option = document.createElement("option");
      option.value = make;
      option.textContent = make;
      carMakeFilter.appendChild(option);
    });
    // Update custom dropdowns after native selects are populated and disabled states are set
    populateCustomDropdown(carMakeFilter, customCarMakeOptionsList, selectedCarMakeValueSpan, customCarMakeButton);
    carModelFilter.disabled = true; // Ensure native is disabled before updating custom
    populateCustomDropdown(carModelFilter, customCarModelOptionsList, selectedCarModelValueSpan, customCarModelButton);
    carSubmodelFilter.disabled = true; // Ensure native is disabled before updating custom
    populateCustomDropdown(carSubmodelFilter, customCarSubmodelOptionsList, selectedCarSubmodelValueSpan, customCarSubmodelButton);
  }

  function populateCarModels(selectedMake = '') {
    carModelFilter.innerHTML = '<option value="">Всички</option>';
    carModelFilter.disabled = true;
    populateCustomDropdown(carModelFilter, customCarModelOptionsList, selectedCarModelValueSpan, customCarModelButton);
    carSubmodelFilter.innerHTML = '<option value="">Всички</option>';
    carSubmodelFilter.disabled = true;
    populateCustomDropdown(carSubmodelFilter, customCarSubmodelOptionsList, selectedCarSubmodelValueSpan, customCarSubmodelButton);

    if (selectedMake) {
      const models = new Set();
      products.forEach(p => {
        if (Array.isArray(p.fitsTheseCars)) {
          p.fitsTheseCars.forEach(car => {
            if (typeof car === 'object' && car.make === selectedMake && car.model) {
              models.add(car.model);
            }
          });
        }
      });
      [...models].sort().forEach(model => {
        const option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        carModelFilter.appendChild(option);
      });
      carModelFilter.disabled = false;
      populateCustomDropdown(carModelFilter, customCarModelOptionsList, selectedCarModelValueSpan, customCarModelButton);
    }
  }

  function populateCarSubmodels(selectedMake = '', selectedModel = '') {
    carSubmodelFilter.innerHTML = '<option value="">Всички</option>';
    carSubmodelFilter.disabled = true;
    populateCustomDropdown(carSubmodelFilter, customCarSubmodelOptionsList, selectedCarSubmodelValueSpan, customCarSubmodelButton);

    if (selectedMake && selectedModel) {
      const submodels = new Set();
      products.forEach(p => {
        if (Array.isArray(p.fitsTheseCars)) {
          p.fitsTheseCars.forEach(car => {
            if (typeof car === 'object' && car.make === selectedMake && car.model === selectedModel && car.submodel) {
              submodels.add(car.submodel);
            }
          });
        }
      });
      [...submodels].sort().forEach(submodel => {
        const option = document.createElement("option");
        option.value = submodel;
        option.textContent = submodel;
        carSubmodelFilter.appendChild(option);
      });
      carSubmodelFilter.disabled = false;
      populateCustomDropdown(carSubmodelFilter, customCarSubmodelOptionsList, selectedCarSubmodelValueSpan, customCarSubmodelButton);
    }
  }
  // --- End of New Car Filter Population Functions ---


function renderProducts(productsToRender) {
  productListings.innerHTML = '';
  if (productsToRender.length === 0) {
    noProductsMessage.classList.remove('hidden');
    return;
  }
  noProductsMessage.classList.add('hidden');

  const productHTML = productsToRender.map(product => `
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

  productListings.innerHTML = productHTML;

  // ... rest of the function
  // After rendering, add the image scrub and dot effect
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
    const rect = imgElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const percentage = (mouseX / rect.width);
    const imageIndex = Math.min(
      Math.floor(percentage * product.images.length),
      product.images.length - 1
    );
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
}

  // Helper to build label row - Now references globally available name objects
  function renderLabels(product) {
    return `
      <div class="px-2 pt-2 pb-0 flex items-center space-x-2 text-xs font-semibold">
        <span class="text-sm text-gray-600 mb-2">${categoryNames[product.category] || product.category}</span>
        <span class="text-sm text-gray-600 text-blue-600 mb-2">&gt;</span>
        <span class="text-sm text-gray-600 mb-2">${subcategoryNames[product.subcategory] || product.subcategory}</span>
        ${product.subcategory2 ? `
        <span class="text-sm text-gray-600 text-blue-600 mb-2">&gt;</span>
        <span class="text-sm text-gray-600 mb-2">${subcategory2Names[product.subcategory2] || product.subcategory2}</span>` : ``}
      </div>
    `;
  }

  // Filtering and Sorting Logic
  function applyFiltersAndSort() {
    let filteredProducts = [...products];

    // 1. Apply Search Filter (from desktop-search-input)
    const searchQuery = catalogSearchInput.value.toLowerCase().trim();
    if (searchQuery) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery) ||
        product.id.toString().includes(searchQuery) ||
        (product.fitsTheseCars && (Array.isArray(product.fitsTheseCars) && product.fitsTheseCars.some(car =>
          (car.make && car.make.toLowerCase().includes(searchQuery)) ||
          (car.model && car.model.toLowerCase().includes(searchQuery)) ||
          (car.submodel && car.submodel.toLowerCase().includes(searchQuery))
        )))
      );
    }

    // 2. Apply Category Filter
    const selectedCategory = categoryFilter.value;
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }

    // 3. Apply Subcategory Filter
    const selectedSubcategory = subcategoryFilter.value;
    if (selectedSubcategory) {
      filteredProducts = filteredProducts.filter(product => product.subcategory === selectedSubcategory);
    }

    // 4. Apply Subcategory2 Filter
    const selectedSubcategory2 = subcategory2Filter.value;
    if (selectedSubcategory2) {
      filteredProducts = filteredProducts.filter(product => product.subcategory2 === selectedSubcategory2);
    }

    // 5. Apply Car Filters (Make, Model, Submodel)
    const selectedCarMake = carMakeFilter.value;
    const selectedCarModel = carModelFilter.value;
    const selectedCarSubmodel = carSubmodelFilter.value;

    if (selectedCarMake) {
      filteredProducts = filteredProducts.filter(product =>
        product.fitsTheseCars && Array.isArray(product.fitsTheseCars) &&
        product.fitsTheseCars.some(car => car.make === selectedCarMake)
      );
    }
    if (selectedCarModel) {
      filteredProducts = filteredProducts.filter(product =>
        product.fitsTheseCars && Array.isArray(product.fitsTheseCars) &&
        product.fitsTheseCars.some(car => car.make === selectedCarMake && car.model === selectedCarModel)
      );
    }
    if (selectedCarSubmodel) {
      filteredProducts = filteredProducts.filter(product =>
        product.fitsTheseCars && Array.isArray(product.fitsTheseCars) &&
        product.fitsTheseCars.some(car => car.make === selectedCarMake && car.model === selectedCarModel && car.submodel === selectedCarSubmodel)
      );
    }

    // 6. Apply Sorting
    const currentSortBy = sortBy.value;
    switch (currentSortBy) {
      case "price-asc":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "recent": // Changed from "newest" to "recent" to match the HTML option value
        // Sort by ID in descending order (biggest ID to lowest ID)
        filteredProducts.sort((a, b) => b.id - a.id);
        break;
      case "default":
      default:
        // No specific sort, maintain original order or sort by a default like ID
        filteredProducts.sort((a, b) => a.id - b.id);
        break;
    }

    renderProducts(filteredProducts);
  }

  // Event Listeners for filters
  categoryFilter.addEventListener("change", (event) => {
    const selectedCategory = event.target.value;
    updateSubcategoryFilters(selectedCategory); // This now internally updates custom subcategory/2 dropdowns
    updateSubcategory2Filters(selectedCategory, subcategoryFilter.value); // Pass category and current subcategory
    // Only category custom dropdown needs explicit update here
    populateCustomDropdown(categoryFilter, customCategoryOptionsList, selectedCategoryValueSpan, customCategoryButton);

    // Show/hide and enable/disable car filters based on category
    if (selectedCategory === 'auto') {
      carFiltersContainer.classList.remove('hidden');
      carMakeFilter.disabled = false; // Enable native select
      populateCarMakes(); // This will populate and update the custom car make dropdown
      carModelFilter.disabled = true; // Ensure native is disabled
      populateCarModels(); // This will update custom car model dropdown to disabled state
      carSubmodelFilter.disabled = true; // Ensure native is disabled
      populateCarSubmodels(); // This will update custom car submodel dropdown to disabled state
    } else {
      carFiltersContainer.classList.add('hidden');
      carMakeFilter.value = "";
      carModelFilter.value = "";
      carSubmodelFilter.value = "";
      carMakeFilter.disabled = true;
      carModelFilter.disabled = true;
      carSubmodelFilter.disabled = true;
      // Also update custom dropdowns to reflect their disabled state and default value
      populateCustomDropdown(carMakeFilter, customCarMakeOptionsList, selectedCarMakeValueSpan, customCarMakeButton);
      populateCustomDropdown(carModelFilter, customCarModelOptionsList, selectedCarModelValueSpan, customCarModelButton);
      populateCustomDropdown(carSubmodelFilter, customCarSubmodelOptionsList, selectedCarSubmodelValueSpan, customCarSubmodelButton);
    }
    applyFiltersAndSort();
  });

  subcategoryFilter.addEventListener("change", (event) => {
    updateSubcategory2Filters(categoryFilter.value, event.target.value); // This now internally updates custom subcategory2 dropdown
    populateCustomDropdown(subcategoryFilter, customSubcategoryOptionsList, selectedSubcategoryValueSpan, customSubcategoryButton);
    applyFiltersAndSort();
  });

  subcategory2Filter.addEventListener("change", () => {
    populateCustomDropdown(subcategory2Filter, customSubcategory2OptionsList, selectedSubcategory2ValueSpan, customSubcategory2Button);
    applyFiltersAndSort();
  });

  sortBy.addEventListener("change", () => {
    populateCustomDropdown(sortBy, customSortByOptionsList, selectedSortByValueSpan, customSortByButton);
    applyFiltersAndSort();
  });

  // New Car Filter Event Listeners
  carMakeFilter.addEventListener("change", (event) => {
    const selectedMake = event.target.value;
    populateCarModels(selectedMake); // This will internally update custom car model/submodel dropdowns
    populateCarSubmodels(); // Reset submodels
    populateCustomDropdown(carMakeFilter, customCarMakeOptionsList, selectedCarMakeValueSpan, customCarMakeButton);
    applyFiltersAndSort();
  });

  carModelFilter.addEventListener("change", (event) => {
    const selectedMake = carMakeFilter.value;
    const selectedModel = event.target.value;
    populateCarSubmodels(selectedMake, selectedModel); // This will internally update custom car submodel dropdown
    populateCustomDropdown(carModelFilter, customCarModelOptionsList, selectedCarModelValueSpan, customCarModelButton);
    applyFiltersAndSort();
  });

  carSubmodelFilter.addEventListener("change", (event) => {
    populateCustomDropdown(carSubmodelFilter, customCarSubmodelOptionsList, selectedCarSubmodelValueSpan, customCarSubmodelButton);
    applyFiltersAndSort();
  });


  // Event listener for the new catalog search input
  catalogSearchInput.addEventListener("input", applyFiltersAndSort);
  clearSearchButton.addEventListener("click", () => {
    catalogSearchInput.value = '';
    applyFiltersAndSort();
  });


  clearFiltersBtn.addEventListener("click", () => {
    categoryFilter.value = "";
    // Set the displayed text for the custom category dropdown to "Всички"
    if (selectedCategoryValueSpan) {
        selectedCategoryValueSpan.textContent = "Всички";
    }
    subcategoryFilter.value = "";
    subcategory2Filter.value = "";
    sortBy.value = "default";
    catalogSearchInput.value = ""; // Clear catalog search input as well

    updateSubcategoryFilters(); // Reset subcategory and subcategory2 filters, which will update custom subcategory dropdowns
    // Explicitly update sort by custom dropdown
    populateCustomDropdown(sortBy, customSortByOptionsList, selectedSortByValueSpan, customSortByButton);
    // Explicitly update category custom dropdown (this will also ensure "Всички" is an option)
    populateCustomDropdown(categoryFilter, customCategoryOptionsList, selectedCategoryValueSpan, customCategoryButton);
    // Clear and reset new car filters
    carMakeFilter.value = "";
    carModelFilter.value = "";
    carSubmodelFilter.value = "";
    populateCarMakes(); // Repopulate makes and disable subsequent filters, also updates custom car makes/models/submodels
    populateCarModels();
    populateCarSubmodels();
    carFiltersContainer.classList.add('hidden'); // Hide car filters on clear

    applyFiltersAndSort();
  });

  // Handle search query from homepage
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get('search');
  if (searchTerm) {
    catalogSearchInput.value = decodeURIComponent(searchTerm);
  }

  // Setup toggle for all custom dropdowns
  if (customCategoryButton) setupCustomDropdownToggle(customCategoryButton);
  if (customSubcategoryButton) setupCustomDropdownToggle(customSubcategoryButton);
  if (customSubcategory2Button) setupCustomDropdownToggle(customSubcategory2Button);
  if (customCarMakeButton) setupCustomDropdownToggle(customCarMakeButton);
  if (customCarModelButton) setupCustomDropdownToggle(customCarModelButton);
  if (customCarSubmodelButton) setupCustomDropdownToggle(customCarSubmodelButton);
  if (customSortByButton) setupCustomDropdownToggle(customSortByButton);

  // Initial render
  populateFilters();
  // Populate all custom dropdowns initially after their native counterparts are populated
  // These calls are redundant if populateFilters already calls them, but good for robustness
  if (sortBy) populateCustomDropdown(sortBy, customSortByOptionsList, selectedSortByValueSpan, customSortByButton);
  if (categoryFilter) populateCustomDropdown(categoryFilter, customCategoryOptionsList, selectedCategoryValueSpan, customCategoryButton);
  if (subcategoryFilter) populateCustomDropdown(subcategoryFilter, customSubcategoryOptionsList, selectedSubcategoryValueSpan, customSubcategoryButton);
  if (subcategory2Filter) populateCustomDropdown(subcategory2Filter, customSubcategory2OptionsList, selectedSubcategory2ValueSpan, customSubcategory2Button);
  if (carMakeFilter) populateCustomDropdown(carMakeFilter, customCarMakeOptionsList, selectedCarMakeValueSpan, customCarMakeButton);
  if (carModelFilter) populateCustomDropdown(carModelFilter, customCarModelOptionsList, selectedCarModelValueSpan, customCarModelButton);
  if (carSubmodelFilter) populateCustomDropdown(carSubmodelFilter, customCarSubmodelOptionsList, selectedCarSubmodelValueSpan, customCarSubmodelButton);
  applyFiltersAndSort();
});
