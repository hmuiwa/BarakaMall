// js/cart.js

const CART_STORAGE_KEY = 'e-commerce-cart';

/**
 * Loads the cart data from localStorage.
 * @returns {Array<Object>} The array of cart items.
 */
export function getCart() {
    try {
        const cartData = localStorage.getItem(CART_STORAGE_KEY);
        const cart = cartData ? JSON.parse(cartData) : [];
        // Filter out invalid items (missing required fields)
        return cart.filter(item =>
            item &&
            item.id &&
            item.name &&
            item.price !== undefined &&
            item.image &&
            item.qty !== undefined
        );
    } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
        return [];
    }
}

/**
 * Saves the cart data to localStorage.
 * @param {Array<Object>} cart - The array of cart items to save.
 */
function saveCart(cart) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
    }
}

/**
 * Adds a product to the cart or increments its quantity if it already exists.
 * @param {Object} product - The product object to add.
 * @param {number} [quantity=1] - The quantity to add.
 */
export function addItem(product, quantity = 1) {
    // Validate product object
    if (!product || !product.id || !product.name || product.price === undefined || !product.image) {
        console.error("Invalid product object provided to addItem:", product);
        return;
    }

    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.qty += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            qty: quantity
        });
    }

    saveCart(cart);
}

/**
 * Removes a product from the cart.
 * @param {string} productId - The ID of the product to remove.
 */
export function removeItem(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
}

/**
 * Updates the quantity of a product in the cart.
 * @param {string} productId - The ID of the product to update.
 * @param {number} newQuantity - The new quantity for the product.
 */
export function updateQty(productId, newQuantity) {
    const cart = getCart();
    const itemToUpdate = cart.find(item => item.id === productId);

    if (itemToUpdate) {
        if (newQuantity > 0) {
            itemToUpdate.qty = newQuantity;
        } else {
            // If quantity is 0 or less, remove the item
            removeItem(productId);
            return;
        }
    }
    saveCart(cart);
}

/**
 * Clears all items from the cart.
 */
export function clearCart() {
    saveCart([]);
}