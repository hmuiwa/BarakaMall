// js/filters.js

/**
 * Renders the HTML string for a single product card.
 * This function is used to dynamically create product elements.
 * @param {Object} product - The product object to render.
 * @returns {string} The HTML string for the product card.
 */
export function renderProductCard(product) {
    const { id, name, price, rating, image, inStock } = product;
    const isOutOfStock = inStock === 0;

    return `
        <div class="product-card" data-product-id="${id}">
            <img src="${image}" alt="${name}" class="product-card-image" loading="lazy">
            <h3 class="product-card-title"><a href="product.html?id=${id}">${name}</a></h3>
            <p class="product-card-price">KSh ${Math.round(price).toLocaleString('en-US')}</p>
            <p class="product-card-rating">
                ${'⭐'.repeat(Math.floor(rating))} (${rating})
            </p>
            ${isOutOfStock ? `<span class="out-of-stock-badge">Out of Stock</span>` : ''}
            <button
                class="add-to-cart-btn"
                data-product-id="${id}"
                ${isOutOfStock ? 'disabled' : ''}
                aria-label="Add ${name} to cart">
                ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    `;
}

/**
 * Filters a list of products by a search query.
 * @param {Array<Object>} products - The array of products.
 * @param {string} query - The search query.
 * @returns {Array<Object>} The filtered array.
 */
export function filterBySearch(products, query) {
    const lowercasedQuery = query.toLowerCase().trim();
    if (!lowercasedQuery) {
        return products;
    }
    return products.filter(product =>
        product.name.toLowerCase().includes(lowercasedQuery) ||
        product.description.toLowerCase().includes(lowercasedQuery)
    );
}

/**
 * Filters products by selected categories.
 * @param {Array<Object>} products - The array of products.
 * @param {Array<string>} categories - The array of selected categories.
 * @returns {Array<Object>} The filtered array.
 */
export function filterByCategory(products, categories) {
    if (categories.length === 0) {
        return products;
    }
    return products.filter(product => categories.includes(product.category));
}

/**
 * Filters products by a price range.
 * @param {Array<Object>} products - The array of products.
 * @param {number} minPrice - The minimum price.
 * @param {number} maxPrice - The maximum price.
 * @returns {Array<Object>} The filtered array.
 */
export function filterByPrice(products, minPrice, maxPrice) {
    return products.filter(product => {
        const isMin = minPrice ? product.price >= minPrice : true;
        const isMax = maxPrice ? product.price <= maxPrice : true;
        return isMin && isMax;
    });
}

/**
 * Sorts products based on a given sorting option.
 * @param {Array<Object>} products - The array of products.
 * @param {string} sortBy - The sorting option ('price-asc', 'price-desc', 'rating', 'default').
 * @returns {Array<Object>} The sorted array.
 */
export function sortProducts(products, sortBy) {
    // Create a copy to avoid mutating the original array
    const sortedProducts = [...products]; 
    switch (sortBy) {
        case 'price-asc':
            return sortedProducts.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return sortedProducts.sort((a, b) => b.price - a.price);
        case 'rating':
            return sortedProducts.sort((a, b) => b.rating - a.rating);
        case 'default':
        default:
            return sortedProducts;
    }
}