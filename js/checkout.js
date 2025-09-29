// js/checkout.js

import * as Cart from './cart.js';

const checkoutForm = document.getElementById('checkout-form');
const confirmationAlert = document.getElementById('confirmation-alert');
const errorAlert = document.getElementById('error-alert');
const cartItemCountElement = document.getElementById('cart-item-count');
const processingAlert = document.createElement('div');
processingAlert.className = 'alert alert-info';
processingAlert.innerHTML = '<p><strong>Processing M-Pesa Payment...</strong></p><p>Please check your phone for the STK push.</p>';
processingAlert.style.display = 'none';
checkoutForm.parentNode.insertBefore(processingAlert, confirmationAlert);

/**
 * Updates the item count in the header's cart icon.
 */
function updateCartIcon() {
    const cart = Cart.getCart();
    const totalItems = cart.reduce((total, item) => total + item.qty, 0);
    cartItemCountElement.textContent = totalItems;
}

/**
 * Validates the checkout form fields.
 * @returns {boolean} True if the form is valid, otherwise false.
 */
function validateForm() {
    const inputs = checkoutForm.querySelectorAll('input[required]');
    let allValid = true;
    inputs.forEach(input => {
        if (!input.checkValidity()) {
            allValid = false;
        }
    });
    return allValid;
}

/**
 * Hides all alert messages.
 */
function hideAlerts() {
    confirmationAlert.style.display = 'none';
    errorAlert.style.display = 'none';
    processingAlert.style.display = 'none';
}

// Add a submit event listener to the form
checkoutForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission

    hideAlerts();

    // Perform validation
    if (validateForm()) {
        // Show processing alert
        processingAlert.style.display = 'block';

        // Simulate M-Pesa processing delay
        setTimeout(() => {
            hideAlerts();

            // Mock a successful order:
            // 1. Clear the shopping cart
            Cart.clearCart();
            
            // 2. Hide the form and show a confirmation message
            checkoutForm.style.display = 'none';
            confirmationAlert.style.display = 'block';

            // 3. Update the header's cart count
            updateCartIcon();
        }, 3000); // 3 seconds delay

    } else {
        // Show an error message if validation fails
        errorAlert.style.display = 'block';
    }
});

// Initial update on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartIcon();
});