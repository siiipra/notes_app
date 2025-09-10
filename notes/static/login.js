document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const messageDiv = document.getElementById('message');
    const loginButton = document.getElementById('login-button');

    // The API endpoint for obtaining tokens
    const tokenApiUrl = 'http://127.0.0.1:8000/api/token/';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Show loading state
        messageDiv.textContent = 'Logging in...';
        messageDiv.className = 'mt-4 text-center text-sm text-gray-500';
        loginButton.disabled = true;

        const username = usernameInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch(tokenApiUrl, {
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

            if (response.ok) { // Check for a successful response (e.g., 200 OK)
                // Save the tokens to localStorage
                localStorage.setItem('accessToken', data.access);
                localStorage.setItem('refreshToken', data.refresh);

                messageDiv.textContent = 'Login successful! Redirecting...';
                messageDiv.className = 'mt-4 text-center text-sm text-green-600';
                form.reset(); // Clear the form on success

                // Redirect the user to the notes page
                window.location.href = '/';

            } else { // Handle errors from the server
                let errorMessage = 'Invalid username or password.';
                if (data.detail) {
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
            loginButton.disabled = false;
        }
    });
});
