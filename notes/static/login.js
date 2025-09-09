document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;

        // Here you would typically send the data to your backend API
        // For this example, we'll just log it and show a message.
        console.log('Login Form Submitted!');
        console.log('Username:', username);
        console.log('Password:', password);

        messageDiv.textContent = 'Login form submitted! Check the console for details.';
        messageDiv.className = 'mt-4 text-center text-sm text-green-600';
    });
});