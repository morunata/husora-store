// delivery.js

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function renderOrderSummary() {
  const cart = getCart();
  const container = document.getElementById("order-summary-container");
  const totalEl = document.getElementById("order-summary-total");

  container.innerHTML = "";
  if (cart.length === 0) {
    container.innerHTML = `<p class="text-gray-500">Вашата количка е празна.</p>`;
    totalEl.textContent = "0.00";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "flex justify-between items-center border-b border-gray-200 py-2";
    div.innerHTML = `
      <div>
        <p class="font-medium">${item.name}</p>
        <p class="text-sm text-gray-500">Количество: ${item.quantity}</p>
      </div>
      <div class="text-right">
        <p class="font-medium">${itemTotal.toFixed(2)} лв.</p>
        <p class="text-sm text-gray-500">(${item.price.toFixed(2)} лв./бр.)</p>
      </div>
    `;
    container.appendChild(div);
  });

  totalEl.textContent = total.toFixed(2);
}

function setupForm() {
  const form = document.getElementById("delivery-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const deliveryDetails = Object.fromEntries(formData.entries());

    // Save in localStorage to use in pay.html
    localStorage.setItem("deliveryDetails", JSON.stringify(deliveryDetails));

    // Redirect to pay.html
    window.location.href = "pay.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderOrderSummary();
  setupForm();
});
