document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Logic for user registration
    console.log('Register form submitted');
    // Example: Get form data
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('Username:', username, 'Email:', email, 'Password:', password);
    // Here you would typically send this data to a server
    alert('Registration logic would go here!');
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Logic for user login
    console.log('Login form submitted');
    // Example: Get form data
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log('Username:', username, 'Password:', password);
    // Here you would typically send this data to a server for authentication
    alert('Login logic would go here!');
    // On successful login, redirect to dashboard
    // window.location.href = 'dashboard.html'; 
});
