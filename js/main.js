// js/main.js

import { products } from './data.js';
import * as Cart from './cart.js'; // Import all functions from cart.js

/**
 * Renders the categories on the page.
 * @param {Array<string>} categoriesArray - The array of category names to render.
 */
function renderCategories(categoriesArray) {
    const categoriesList = document.getElementById('categories-list');
    categoriesList.innerHTML = ''; // Clear existing categories

    // Add "All" category first
    const allCategoryItem = document.createElement('div');
    allCategoryItem.className = 'category-item active';
    allCategoryItem.textContent = 'All';
    allCategoryItem.addEventListener('click', () => {
        renderProducts(products);
        updateCategoryActiveState('All');
    });
    categoriesList.appendChild(allCategoryItem);

    categoriesArray.forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.textContent = category;
        categoryItem.addEventListener('click', () => {
            // Filter products by selected category and render
            const filteredProducts = products.filter(p => p.category === category);
            renderProducts(filteredProducts);
            updateCategoryActiveState(category);
        });
        categoriesList.appendChild(categoryItem);
    });
}

/**
 * Updates the active state of category items.
 * @param {string} activeCategory - The currently selected category.
 */
function updateCategoryActiveState(activeCategory) {
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        if (item.textContent === activeCategory) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * Renders a single product card as HTML string.
 * @param {Object} product - The product object to render.
 * @returns {string} The HTML string for the product card.
 */
function renderProductCard(product) {
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    const inStockText = product.inStock > 0 ? `In Stock (${product.inStock})` : 'Out of Stock';
    const inStockClass = product.inStock > 0 ? 'in-stock' : 'out-of-stock';
    const buttonDisabled = product.inStock === 0 ? 'disabled' : '';

    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-card-image">
            <h3 class="product-card-title">
                <a href="product.html?id=${product.id}">${product.name}</a>
            </h3>
            <p class="product-card-price">KSh ${product.price.toLocaleString()}</p>
            <p class="product-card-rating">${stars} (${product.rating})</p>
            <p class="product-stock ${inStockClass}">${inStockText}</p>
            <button class="add-to-cart-btn" data-product-id="${product.id}" ${buttonDisabled}>
                Add to Cart
            </button>
            ${product.inStock === 0 ? '<div class="out-of-stock-badge">Out of Stock</div>' : ''}
        </div>
    `;
}

/**
 * Renders the products on the page.
 * @param {Array<Object>} productsArray - The array of products to render.
 */
function renderProducts(productsArray) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = ''; // Clear existing products

    if (productsArray.length === 0) {
        productGrid.innerHTML = '<p class="empty-state">No products found. Try adjusting your filters.</p>';
        return;
    }

    productsArray.forEach(product => {
        const productCardHtml = renderProductCard(product);
        productGrid.insertAdjacentHTML('beforeend', productCardHtml);
    });
}

/**
 * Initializes all event listeners for the page.
 */
function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    const sortSelect = document.getElementById('sort-by-select');
    
    // Add a click listener to the entire product grid for "Add to Cart" buttons
    const productGrid = document.getElementById('product-grid');
    productGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const productId = event.target.dataset.productId;
            const productToAdd = products.find(p => p.id === productId);
            if (productToAdd) {
                Cart.addItem(productToAdd);
                updateCartIcon();
                alert(`${productToAdd.name} added to cart!`);
            }
        }
    });

    // Account icon dropdown toggle
    const accountIcon = document.getElementById('account-icon');
    const accountDropdownMenu = document.getElementById('account-dropdown-menu');
    const logoutBtn = document.getElementById('logout-btn');

    if (accountIcon && accountDropdownMenu) {
        accountIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = accountIcon.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                accountDropdownMenu.style.display = 'none';
                accountDropdownMenu.hidden = true;
                accountIcon.setAttribute('aria-expanded', 'false');
            } else {
                accountDropdownMenu.style.display = 'block';
                accountDropdownMenu.hidden = false;
                accountIcon.setAttribute('aria-expanded', 'true');
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (!accountDropdownMenu.hidden) {
                accountDropdownMenu.style.display = 'none';
                accountDropdownMenu.hidden = true;
                accountIcon.setAttribute('aria-expanded', 'false');
            }
        });

        // Prevent closing dropdown when clicking inside
        accountDropdownMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Logout button click handler (for demo, just alert)
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Logout clicked. Implement logout functionality here.');
            // Optionally close dropdown after logout
            accountDropdownMenu.hidden = true;
            accountIcon.setAttribute('aria-expanded', 'false');
        });
    }

    // Help icon click handler
    const helpIcon = document.getElementById('help-icon');
    const helpModal = document.getElementById('help-modal');
    const closeHelpModal = document.getElementById('close-help-modal');

    if (helpIcon && helpModal) {
        helpIcon.addEventListener('click', () => {
            helpModal.hidden = false;
        });

        // Close modal when clicking the close button
        if (closeHelpModal) {
            closeHelpModal.addEventListener('click', () => {
                helpModal.hidden = true;
            });
        }

        // Close modal when clicking outside
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                helpModal.hidden = true;
            }
        });
    }

    // Search input event listener for filtering products
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            if (query === '') {
                renderProducts(products);
            } else {
                const filteredProducts = products.filter(product =>
                    product.name.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query)
                );
                renderProducts(filteredProducts);
            }
        });
    }
}

/**
 * Updates the cart item count in the header.
 */
function updateCartIcon() {
    const cartItemCount = document.getElementById('cart-item-count');
    const cart = Cart.getCart(); // Get the current cart from the cart module
    const totalItems = cart.reduce((total, item) => total + item.qty, 0);
    cartItemCount.textContent = totalItems;
}

/**
 * Initializes the application on page load.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Get unique categories from products
    const categories = [...new Set(products.map(p => p.category))];
    renderCategories(categories);
    renderProducts(products); // Render all products initially
    setupEventListeners();
    updateCartIcon();
});
