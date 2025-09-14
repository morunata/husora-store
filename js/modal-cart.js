document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.getElementById('cart-button');
    const cartModal = document.getElementById('cart-modal');
    const cartMenu = document.getElementById('cart-menu');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalButton = document.getElementById('close-modal-button');
    const modalCartItemsContainer = document.getElementById('modal-cart-items-container');
    const cartItemCountSpan = document.getElementById('cart-item-count');
    const cartTotalContainer = document.getElementById('cart-total-container');

    function getProductDetails(cartItem) {
        let itemPrice = 0;
        let itemName = cartItem.name;
        let itemImage = "placeholder.jpg";
        let itemDetails = "";
        let productId = "";

        const rawId = cartItem.id.replace('Код на продукта: ', '');

        const productData = products.find(p => {
            const baseId = p.id;
            if (typeof rawId === 'string' && rawId.includes('-')) {
                const pId = Number(rawId.split('-')[0]);
                return pId === baseId;
            } else {
                return p.id === Number(rawId);
            }
        });

        if (productData) {
            productId = productData.id;
            // Check for variations first
            if (productData.variations && productData.variations.length > 0 && typeof rawId === 'string' && rawId.includes('-')) {
                const parts = rawId.split('-');
                if (parts.length >= 3) {
                    const [pId, varId, optId, colorId] = parts;
                    const variation = productData.variations.find(v => v.id === Number(varId));
                    if (variation) {
                        const option = variation.options.find(o => o.id === Number(optId));
                        if (option) {
                            itemPrice = option.price;
                            itemName = productData.name;
                            const variationModel = variation.model;
                            const optionVariant = option.variant;
                            let colorName = "";
                            if (colorId && productData.variations[0].hasColors) {
                                const colorKeys = Object.keys(availableColors);
                                colorName = colorKeys[Number(colorId) - 1] || "";
                            }
                            itemDetails = `${variationModel} / ${optionVariant} / ${colorName}`;

                            itemImage = (option.images && option.images.length > 0) ? option.images[0] :
                                        variation.spotlightImage ? variation.spotlightImage :
                                        (productData.images && productData.images.length > 0) ? productData.images[0] :
                                        "placeholder.jpg";
                        }
                    }
                }
            } else {
                // This is for products without variations or with a simple ID
                itemPrice = productData.price || 0;
                itemName = productData.name;
                itemImage = (productData.images && productData.images.length > 0) ? productData.images[0] : "placeholder.jpg";
                itemDetails = "";
            }
        }
        return { price: itemPrice, name: itemName, image: itemImage, details: itemDetails, id: cartItem.id };
    }

    function removeItemFromCart(itemId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        showNotification("Продуктът беше премахнат от количката."); 
        renderModalCartItems();
        updateCartCount();
    }
    
    function changeQuantity(itemId, change) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(item => item.id === itemId);

        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;

            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            
            showNotification("Продуктът беше премахнат от количката."); 
            renderModalCartItems();
            updateCartCount();
        }
    }

   function renderModalCartItems() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            modalCartItemsContainer.innerHTML = `
                <div class="flex flex-col items-center justify-center p-48 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-24 h-24">
                        <path fill="currentColor" d="M20.164,13H5.419L4.478,5H14V3H4.242L4.2,2.648A3,3,0,0,0,1.222,0H0V2H1.222a1,1,0,0,1,.993.883L3.8,16.351A3,3,0,0,0,6.778,19H20V17H6.778a1,1,0,0,1-.993-.884L5.654,15H21.836l.9-5H20.705Z"/>
                        <circle fill="currentColor" cx="7" cy="22" r="2"/>
                        <circle fill="currentColor" cx="17" cy="22" r="2"/>
                        <polygon fill="currentColor" points="21 3 21 0 19 0 19 3 16 3 16 5 19 5 19 8 21 8 21 5 24 5 24 3 21 3"/>
                    </svg>
                    <p class="mt-4 text-xl">Количката е празна</p>
                </div>
            `;
            cartTotalContainer.innerHTML = ''; 
        } else {
            let total = 0;
            let itemsHtml = '';
            cart.forEach(item => {
                const details = getProductDetails(item);
                const itemTotalPrice = details.price * item.quantity;
                total += itemTotalPrice;

                const rawId = item.id.replace('Код на продукта: ', '');
                const baseProductId = rawId.includes('-') ? rawId.split('-')[0] : rawId;

                itemsHtml += `
                <a href="product.html?id=${baseProductId}" class="flex items-center gap-4 py-4 px-4 border-b last:border-b-0 pr-2 hover:bg-gray-100 transition-colors duration-200">
                    <img src="${details.image}" alt="${details.name}" class="w-16 h-16 object-cover rounded-sm border border-gray-300 shadow">
                    <div class="flex-1">
                        <h4 class="font text-md">${details.name}</h4>
                        <p class="text-xs text-gray-400 mt-1">Код на продукта: ${details.id}</p>
                        <p class="text-sm text-gray-500">${details.details}</p>
                        <div class="flex items-center mt-1 font-semibold">
                            <button class="quantity-btn text-gray-600 hover:text-red-500" data-item-id="${item.id}" data-change="-1" onclick="event.preventDefault(); event.stopPropagation();">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
                            </button>
                            <span class="mx-2 text-sm">${item.quantity}</span>
                            <button class="quantity-btn text-gray-600 hover:text-blue-600" data-item-id="${item.id}" data-change="1" onclick="event.preventDefault(); event.stopPropagation();">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                            </button>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 text-right">
                        <p class="font-semibold text-md">BGN ${itemTotalPrice.toFixed(2)}</p>
                        <button class="remove-item-btn text-gray-400 hover:text-red-500 transition-colors duration-200" data-item-id="${item.id}" onclick="event.preventDefault(); event.stopPropagation();">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </a>
                `;
            });
            modalCartItemsContainer.innerHTML = itemsHtml;

            const totalHtml = `
                <div class="px-4 py-3 border-t">
                    <div class="flex justify-between items-center font-semibold text-lg">
                        <span>Общо:</span>
                        <span class="font-bold">BGN ${total.toFixed(2)}</span>
                    </div>
                </div>
            `;
            cartTotalContainer.innerHTML = totalHtml;
        }

        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = e.currentTarget.dataset.itemId;
                removeItemFromCart(itemId);
            });
        });

        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = e.currentTarget.dataset.itemId;
                const change = parseInt(e.currentTarget.dataset.change);
                changeQuantity(itemId, change);
            });
        });
    }

    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const uniqueItemsCount = cart.length;
        if (uniqueItemsCount > 0) {
            cartItemCountSpan.textContent = uniqueItemsCount;
            cartItemCountSpan.classList.remove('hidden');
        } else {
            cartItemCountSpan.classList.add('hidden');
        }
    }
    
    function openCartModal() {
        renderModalCartItems();
        updateCartCount();
        cartModal.classList.remove('hidden');
        setTimeout(() => {
            modalOverlay.classList.remove('opacity-0');
            modalOverlay.classList.add('opacity-100');
            cartMenu.classList.remove('translate-x-full');
        }, 10);
    }

    function closeCartModal() {
        modalOverlay.classList.remove('opacity-100');
        modalOverlay.classList.add('opacity-0');
        cartMenu.classList.add('translate-x-full');
        setTimeout(() => {
            cartModal.classList.add('hidden');
        }, 300);
    }
    
    if (cartButton) {
        cartButton.addEventListener('click', (e) => {
            e.preventDefault();
            openCartModal();
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeCartModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeCartModal();
        }
    });

    window.renderModalCartItems = renderModalCartItems;
    window.updateCartCount = updateCartCount;
    window.openCartModal = openCartModal;
    
    updateCartCount();
});