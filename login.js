document.addEventListener("DOMContentLoaded", function () {
    const loadingMessage = document.getElementById("loading");

    // Array of valid usernames and passwords
    const validCredentials = [
        { username: "admin", password: "admin@123" },
        { username: "norah", password: "careers123" },
        { username: "careers001", password: "career.25" }
    ];

    // Handle login form submission
    document.getElementById("login-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Check if the entered credentials match any in the validCredentials array
        const isValidUser  = validCredentials.some(cred => 
            cred.username === username && cred.password === password
        );

        if (isValidUser ) {
            // Redirect to the main page
            window.location.href = "index.html"; // Change to your main page URL
        } else {
            // Show error message
            document.getElementById("error-message").textContent = "Invalid username or password.";
        }
    });
});