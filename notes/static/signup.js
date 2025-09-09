document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');
    const usernameInput = document.getElementById('signup-username');
    const passwordInput = document.getElementById('signup-password');
    const messageDiv = document.getElementById('message');
    const signupButton = document.getElementById('signup-button');

    // The API endpoint for user registration
    const registerApiUrl = 'http://127.0.0.1:8000/api/register/';

    form.addEventListener('submit', async (e) => {
    console.log("hello");
        e.preventDefault();

        // Show loading state
        messageDiv.textContent = 'Registering user...';
        messageDiv.className = 'mt-4 text-center text-sm text-gray-500';
        signupButton.disabled = true;

        const username = usernameInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch(registerApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) { // Check for a successful response (e.g., 201 Created)
                messageDiv.textContent = 'User registered successfully!';
                messageDiv.className = 'mt-4 text-center text-sm text-green-600';
                form.reset(); // Clear the form on success
            } else { // Handle errors from the server
                let errorMessage = 'An error occurred during registration.';
                if (data.username && data.username.length > 0) {
                    errorMessage = 'Username: ' + data.username.join(' ');
                } else if (data.password && data.password.length > 0) {
                    errorMessage = 'Password: ' + data.password.join(' ');
                } else if (data.detail) {
                    errorMessage = data.detail;
                }

                messageDiv.textContent = errorMessage;
                messageDiv.className = 'mt-4 text-center text-sm text-red-600';
            }
        } catch (error) {
            console.error('Network or other error:', error);
            messageDiv.textContent = 'Network error. Please try again.';
            messageDiv.className = 'mt-4 text-center text-sm text-red-600';
        } finally {
            signupButton.disabled = false;
        }
    });
});