// js/bookmarks.js

document.addEventListener("DOMContentLoaded", () => {
    const bookmarkedProductsList = document.getElementById("bookmarked-products-list");
    const noBookmarksMessage = document.getElementById("no-bookmarks-message");

    // Ensure 'products' array is available. It's assumed to be loaded via productsList.js
    // For demonstration, a placeholder products array is included if productsList.js is not present.
    if (typeof products === 'undefined') {
        console.warn("products array not found. Using placeholder data. Ensure js/productsList.js is loaded.");
        window.products = [
            { id: 1, name: "Vintage Leather Chair", description: "A classic design chair with genuine leather upholstery.", price: 299.99, images: ["https://placehold.co/150x150/E0E0E0/333333?text=Chair"] },
            { id: 2, name: "Minimalist Desk Lamp", description: "Sleek and modern desk lamp with adjustable brightness.", price: 45.00, images: ["https://placehold.co/150x150/D0D0D0/333333?text=Lamp"] },
            { id: 3, name: "Ceramic Coffee Mug Set", description: "Set of 4 handcrafted ceramic mugs, perfect for daily use.", price: 25.50, images: ["https://placehold.co/150x150/C0C0C0/333333?text=Mugs"] },
            { id: 4, name: "Ergonomic Office Chair", description: "High-back office chair with lumbar support for long hours.", price: 180.00, images: ["https://placehold.co/150x150/B0B0B0/333333?text=Office+Chair"] },
            { id: 5, name: "Abstract Wall Art", description: "Large canvas print with vibrant abstract patterns.", price: 85.75, images: ["https://placehold.co/150x150/A0A0A0/333333?text=Art"] },
        ];
    }


    // Function to get bookmarked product IDs from localStorage
    function getBookmarkedProductIds() {
        const bookmarks = localStorage.getItem("bookmarks");
        try {
            return bookmarks ? JSON.parse(bookmarks) : [];
        } catch (e) {
            console.error("Error parsing bookmarks from localStorage:", e);
            return []; // Return empty array on error
        }
    }

    // Function to render bookmarked products
    function renderBookmarkedProducts() {
        const bookmarkedIds = getBookmarkedProductIds();
        bookmarkedProductsList.innerHTML = ''; // Clear previous listings

        if (bookmarkedIds.length === 0) {
            noBookmarksMessage.classList.remove("hidden");
            return;
        } else {
            noBookmarksMessage.classList.add("hidden");
        }

        // Filter products based on bookmarked IDs
        const bookmarkedProducts = products.filter(product => bookmarkedIds.includes(product.id));

        if (bookmarkedProducts.length === 0) {
            noBookmarksMessage.classList.remove("hidden");
            return;
        }

        // Render each bookmarked product as a row
        bookmarkedProducts.forEach((product, index) => {
            const displayImage = product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/150x150/E0E0E0/333333?text=No+Image';
            const displayPrice = product.price || 0; // Ensure price is a number
            const backgroundColorClass = index % 2 === 0 ? 'bg-white-alt' : 'bg-gray-100-alt'; // Alternating backgrounds

            const productRow = document.createElement("div");
            productRow.className = `product-row ${backgroundColorClass}`; // Apply base class and background class
            productRow.innerHTML = `
                <div class="product-row-content">
                    <a href="product.html?id=${product.id}" class="product-image-container">
                        <img src="${displayImage}" alt="${product.name}" onerror="this.onerror=null;this.src='https://placehold.co/150x150/E0E0E0/333333?text=Image+Error';">
                    </a>
                    <div class="product-details">
                        <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
                        <p>${product.description}</p>
                        <p class="price">$${displayPrice.toFixed(2)}</p>
                    </div>
                    <button class="remove-bookmark-btn" data-product-id="${product.id}">
                        Remove from Bookmarks
                    </button>
                </div>
            `;
            bookmarkedProductsList.appendChild(productRow);
        });

        // Add event listeners to remove buttons
        document.querySelectorAll(".remove-bookmark-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                const productIdToRemove = parseInt(event.target.dataset.productId);
                removeBookmark(productIdToRemove);
            });
        });
    }

    // Function to remove a bookmark
    function removeBookmark(productId) {
        let bookmarkedIds = getBookmarkedProductIds();
        bookmarkedIds = bookmarkedIds.filter(id => id !== productId);
        localStorage.setItem("bookmarks", JSON.stringify(bookmarkedIds));
        renderBookmarkedProducts(); // Re-render the list after removal
    }

    // Initial render when the page loads
    renderBookmarkedProducts();
});