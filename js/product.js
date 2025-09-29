// js/product.js

import { products } from './data.js';
import * as Cart from './cart.js';

const productDetailElement = document.getElementById('product-detail');
const cartItemCountElement = document.getElementById('cart-item-count');

/**
 * Updates the cart item count in the header.
 */
function updateCartIcon() {
    const cart = Cart.getCart();
    const totalItems = cart.reduce((total, item) => total + item.qty, 0);
    cartItemCountElement.textContent = totalItems;
}

/**
 * Renders a star rating using Unicode stars.
 * @param {number} rating - The rating value (e.g., 4.5)
 * @returns {string} HTML string for stars
 */
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    let stars = '★'.repeat(fullStars);
    if (hasHalf) stars += '☆'; // Half star approximation with empty
    stars += '☆'.repeat(5 - fullStars - (hasHalf ? 1 : 0));
    return stars;
}

/**
 * Renders the product details page.
 * @param {Object} product - The product object
 */
function renderProductDetails(product) {
    if (!product) {
        productDetailElement.innerHTML = '<p>Product not found.</p>';
        return;
    }

    const priceFormatted = `KSh ${Math.round(product.price).toLocaleString('en-US')}`;
    const stockStatus = product.inStock > 0 ? `In Stock: ${product.inStock}` : 'Out of Stock';
    const addToCartBtn = product.inStock > 0 
        ? `<button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>`
        : '<button class="btn btn-secondary" disabled>Out of Stock</button>';

    let reviewsHtml = '';
    if (product.reviews && product.reviews.length > 0) {
        reviewsHtml = `
            <section class="reviews-section">
                <h3>Reviews</h3>
                ${product.reviews.map(review => `
                    <div class="review">
                        <div class="review-header">
                            <strong>${review.user}</strong>
                            <span class="review-stars">${renderStars(review.rating)}</span>
                        </div>
                        <p class="review-comment">${review.comment}</p>
                    </div>
                `).join('')}
            </section>
        `;
    } else {
        reviewsHtml = '<p>No reviews yet.</p>';
    }

    productDetailElement.innerHTML = `
        <div class="product-detail-grid">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" class="detail-image">
            </div>
            <div class="product-info">
                <h1 class="product-name">${product.name}</h1>
                <p class="product-price">${priceFormatted}</p>
                <p class="product-stock">${stockStatus}</p>
                <p class="product-rating">${renderStars(product.rating)} (${product.rating}/5)</p>
                <div class="product-description">
                    <h3>Description</h3>
                    <p>${product.description}</p>
                </div>
                <div class="product-actions">
                    ${addToCartBtn}
                </div>
                ${reviewsHtml}
            </div>
        </div>
    `;

    // Add event listener for Add to Cart button
    const addBtn = document.querySelector('.add-to-cart-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            Cart.addItem(product, 1);
            updateCartIcon();
            addBtn.textContent = 'Added to Cart!';
            addBtn.disabled = true;
            setTimeout(() => {
                addBtn.textContent = 'Add to Cart';
                addBtn.disabled = false;
            }, 2000);
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = products.find(p => p.id === productId);
    renderProductDetails(product);
    updateCartIcon();
});
