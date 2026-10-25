document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateBadge();
});

function getCart() {
  return JSON.parse(localStorage.getItem("angaworld_cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("angaworld_cart", JSON.stringify(cart));
  updateBadge();
}

function updateBadge() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll(".cartCountDisplay").forEach(el => el.innerText = total);
}

function renderCart() {
  const container = document.getElementById("cartItemsContainer");
  const cart = getCart();

  if (!cart.length) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <div style="font-size: 48px; margin-bottom: 12px;">🛒</div>
        <h2>Your AngaWorld Cart is empty</h2>
        <p style="color: #666; margin: 8px 0 20px;">Explore authentic Bhagalpuri Tussar silks, Madhubani art, and handcrafted terracotta.</p>
        <a href="index.html" class="btn-checkout-proceed" style="display: inline-block; width: auto; padding: 10px 24px; text-decoration: none;">Continue Shopping</a>
      </div>`;
    updateTotals(0, 0);
    return;
  }

  let totalItems = 0;
  let totalPrice = 0;

  container.innerHTML = cart.map((item, idx) => {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;

    return `
      <div class="cart-item-row">
        <img class="cart-item-img" src="${item.image}" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'" />
        
        <div>
          <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">
            <a href="index.html" style="color: inherit;">${item.title}</a>
          </h3>
          <div style="color: var(--success); font-size: 12px; font-weight: 600; margin-bottom: 6px;">In Stock</div>
          <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">
            Eligible for <strong>FREE AngaExpress Shipping</strong>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <label style="font-size: 13px;">Qty:
              <select class="cart-qty-select" onchange="updateItemQty(${idx}, this.value)">
                ${[1,2,3,4,5,6,7,8,9,10].map(q => `<option value="${q}" ${q === item.quantity ? 'selected' : ''}>${q}</option>`).join('')}
              </select>
            </label>
            <span style="color: #DDD;">|</span>
            <a href="javascript:void(0)" onclick="removeItem(${idx})" style="font-size: 12px; color: var(--link-blue);">Delete</a>
            <span style="color: #DDD;">|</span>
            <a href="javascript:void(0)" onclick="saveForLater(${idx})" style="font-size: 12px; color: var(--link-blue);">Save for later</a>
          </div>
        </div>

        <div style="text-align: right;">
          <strong style="font-size: 18px; color: var(--text-primary);">₹${(item.price * item.quantity).toLocaleString("en-IN")}</strong>
          <div style="font-size: 12px; color: var(--text-secondary);">₹${item.price.toLocaleString("en-IN")} each</div>
        </div>
      </div>

    `;
  }).join('');

  updateTotals(totalItems, totalPrice);
}

function updateItemQty(index, qty) {
  const cart = getCart();
  cart[index].quantity = parseInt(qty, 10);
  saveCart(cart);
  renderCart();
}

function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function saveForLater(index) {
  removeItem(index);
  alert("Item moved to your Saved for Later list.");
}

function updateTotals(items, total) {
  document.getElementById("bottomItemCount").innerText = items;
  document.getElementById("bottomSubtotalPrice").innerText = "₹" + total.toLocaleString("en-IN");
  document.getElementById("sideItemCount").innerText = items;
  document.getElementById("sideSubtotalPrice").innerText = "₹" + total.toLocaleString("en-IN");
}

function proceedToCheckout() {
  const cart = getCart();
  if (!cart.length) {
    alert("Your shopping cart is empty.");
    return;
  }
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const orderNum = "AW-ORD-" + Math.floor(100000 + Math.random() * 900000);
  alert(`🎉 Thank you for placing your order with AngaWorld!\\n\\nOrder ID: ${orderNum}\\nTotal Amount: ₹${total.toLocaleString('en-IN')}\\n\\nYour handloom and handicraft items will be dispatched via AngaExpress directly from master craft clusters.`);
  localStorage.removeItem("angaworld_cart");
  renderCart();
}