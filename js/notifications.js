// Function to display the notification

// Function to display the notification
function showNotification(message) {
  const notificationBar = document.getElementById('notification-bar');
  const notificationMessage = document.getElementById('notification-message');
  
  if (notificationBar && notificationMessage) {
    notificationMessage.textContent = message;
    // This removes the 'notification-hidden' class
    notificationBar.classList.remove('notification-hidden');
    // And adds the 'notification-visible' class
    notificationBar.classList.add('notification-visible');

    setTimeout(() => {
      // After a few seconds, it removes the 'notification-visible' class
      notificationBar.classList.remove('notification-visible');
      // And adds the 'notification-hidden' class again
      notificationBar.classList.add('notification-hidden');
    }, 3000); 
  }
}

// Attach event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Listen for the "Add to Cart" button on the product page
    const buyButton = document.getElementById('buy-button');
    if (buyButton) {
        buyButton.addEventListener('click', () => {
            showNotification('Продуктът е добавен в количката.');
        });
    }

    // Listen for the "Bookmark" button on the product page
    const bookmarkBtn = document.getElementById('bookmark-btn');
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', () => {
            const isBookmarked = bookmarkBtn.getAttribute('data-bookmarked') === 'true';
            if (isBookmarked) {
                showNotification("Продуктът е премахнат от любими.");
                bookmarkBtn.setAttribute('data-bookmarked', 'false');
            } else {
                showNotification("Продуктът е добавен към любими.");
                bookmarkBtn.setAttribute('data-bookmarked', 'true');
            }
        });
    }

    // Listen for the "Remove" buttons in the cart on the cart page
    const cartItemsContainer = document.getElementById('cart-items-container');
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-item-btn')) {
                // You may need to fetch the product name from the DOM here
                // For a simple message, you can use:
                showNotification("Продуктът е премахнат от количката.");
            }
        });
    }

    // Listen for the "Remove" buttons on the bookmarks page
    const bookmarksList = document.getElementById('bookmarked-products-list');
    if (bookmarksList) {
        bookmarksList.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-bookmark-btn')) {
                showNotification("Продуктът е премахнат от любими.");
            }
        });
    }

    // Listen for the "Remove" buttons in the modal cart
    const modalCartContainer = document.getElementById('modal-cart-items-container');
    if (modalCartContainer) {
        modalCartContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-item-btn')) {
                showNotification("Продуктът е премахнат от количката.");
            }
        });
    }

});