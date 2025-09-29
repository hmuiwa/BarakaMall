// js/cartPage.js

import * as Cart from './cart.js';

const cartItemsContainer = document.getElementById('cart-items-container');
const cartSummaryElement = document.getElementById('cart-summary');
const cartItemCountElement = document.getElementById('cart-item-count');

/**
 * Renders the shopping cart items on the page.
 */
function renderCartItems() {
    const cart = Cart.getCart();
    cartItemsContainer.innerHTML = ''; // Clear existing items

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-state">Your cart is empty.</p>';
        cartSummaryElement.style.display = 'none'; // Hide summary if cart is empty
        return;
    }

    cartSummaryElement.style.display = 'block';

    cart.forEach(item => {
        const price = item.price || 0; // Default to 0 if undefined
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <img src="${item.image || ''}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.name}</h3>
                <p class="cart-item-price">KSh ${Math.round(price).toLocaleString('en-US')}</p>
                <div class="cart-item-controls">
                    <label for="qty-${item.id}">Quantity:</label>
                    <input type="number" id="qty-${item.id}" value="${item.qty}" min="1" class="item-qty-input" data-product-id="${item.id}">
                    <button class="remove-item-btn" data-product-id="${item.id}" aria-label="Remove ${item.name} from cart">Remove</button>
                </div>
            </div>
            <p class="cart-item-total">KSh ${Math.round(price * item.qty).toLocaleString('en-US')}</p>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    renderCartSummary(cart);
}

/**
 * Renders the cart summary with subtotal and a checkout button.
 * @param {Array<Object>} cart - The current cart array.
 */
function renderCartSummary(cart) {
    const subtotal = cart.reduce((total, item) => total + ((item.price || 0) * item.qty), 0);
    const taxes = subtotal * 0.08; // Example: 8% tax
    const total = subtotal + taxes;

    cartSummaryElement.innerHTML = `
        <h3>Order Summary</h3>
        <p>Subtotal: <span>KSh ${Math.round(subtotal).toLocaleString('en-US')}</span></p>
        <p>Taxes (8%): <span>KSh ${Math.round(taxes).toLocaleString('en-US')}</span></p>
        <div class="cart-total-line">
            <p><strong>Total:</strong></p>
            <p><strong>KSh ${Math.round(total).toLocaleString('en-US')}</strong></p>
        </div>
        <a href="checkout.html" class="btn btn-primary checkout-btn">Proceed to Checkout</a>
    `;
}

/**
 * Updates the item count in the header's cart icon.
 */
function updateCartIcon() {
    const cart = Cart.getCart();
    const totalItems = cart.reduce((total, item) => total + item.qty, 0);
    cartItemCountElement.textContent = totalItems;
}

/**
 * Sets up all event listeners for the cart page.
 */
function setupEventListeners() {
    cartItemsContainer.addEventListener('change', (event) => {
        if (event.target.classList.contains('item-qty-input')) {
            const productId = event.target.dataset.productId;
            const newQty = parseInt(event.target.value, 10);
            if (newQty > 0) {
                Cart.updateQty(productId, newQty);
            }
            renderCartItems(); // Re-render to update totals
            updateCartIcon();
        }
    });

    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item-btn')) {
            const productId = event.target.dataset.productId;
            Cart.removeItem(productId);
            renderCartItems(); // Re-render after removing
            updateCartIcon();
        }
    });
}

// Initial rendering and setup on page load
document.addEventListener('DOMContentLoaded', () => {
    renderCartItems();
    updateCartIcon();
    setupEventListeners();
});