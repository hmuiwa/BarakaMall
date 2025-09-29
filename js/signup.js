document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Simple validation
    if (name && email && password && confirmPassword) {
        if (password === confirmPassword) {
            alert('Signup successful! (This is a demo)');
            // Redirect to login
            window.location.href = 'login.html';
        } else {
            alert('Passwords do not match.');
        }
    } else {
        alert('Please fill in all fields.');
    }
});
