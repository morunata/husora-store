// Search

  function handleSearch(query) {
  if (query) {
    window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
  }
}

// Function to handle search icon visibility and styling
function handleSearchIconToggle(inputId, defaultIconId, activeIconId) {
  const input = document.getElementById(inputId);
  const defaultIcon = document.getElementById(defaultIconId);
  const activeIcon = document.getElementById(activeIconId);
  const clearSearchButton = document.getElementById('clear-search');

  // Get the clear button
  function update() {
    // Ensure input element exists before proceeding
    if (!input) return;
    const isActive = document.activeElement === input || input.value.trim() !== '';

    // Toggle icon visibility
    if (defaultIcon) defaultIcon.style.opacity = isActive ? '0' : '1';
    if (activeIcon) activeIcon.style.opacity = isActive ? '1' : '0';

    // Toggle text color
    if (isActive) {
      if (defaultIcon) defaultIcon.classList.add('text-blue-500');
      if (activeIcon) activeIcon.classList.add('text-blue-500');
      // Show clear button if active and has value
      if (clearSearchButton) clearSearchButton.classList.remove('hidden');
    } else {
      if (defaultIcon) defaultIcon.classList.remove('text-blue-500');
      if (activeIcon) activeIcon.classList.remove('text-blue-500');
      // Hide clear button
      if (clearSearchButton) clearSearchButton.classList.add('hidden');
    }
  }

  if (input) {
    // Only add listeners if input exists
    input.addEventListener('focus', update);
    input.addEventListener('blur', update);
    input.addEventListener('input', update);
    // Initial update on page load
    update();
  }

  // Add event listener for clear search button
  if (clearSearchButton) {
    clearSearchButton.addEventListener('click', () => {
      if (input) input.value = '';
      update(); // Update icons/button visibility after clearing
      handleSearch(''); // Trigger a search with an empty query to reset catalog
    });
  }
}

// Initialize search icon toggles for both mobile and desktop
handleSearchIconToggle('mobile-search-input', 'mobile-search-icon-default', 'mobile-search-icon-active');
handleSearchIconToggle('desktop-search-input', 'desktop-search-icon-default', 'desktop-search-icon-active');

// Mobile menu toggle
const toggleBtn = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

toggleBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('-translate-x-full');
});

// Desktop header scroll hide/show
let lastScrollY = window.scrollY;
const nav = document.getElementById("nav-buttons-desktop");

window.addEventListener("scroll", () => {
  if (window.scrollY > lastScrollY) {
    // Scrolling down – hide nav with slide up
    nav.classList.add("-translate-y-full");
  } else {
    // Scrolling up – show nav with slide down
    nav.classList.remove("-translate-y-full");
  }
  lastScrollY = window.scrollY;
});