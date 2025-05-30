// js/script.js

// Register New User
function handleRegister() {
    const username = document.getElementById("reg-username").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    const confirmPassword = document.getElementById("reg-confirm-password").value.trim();
    const question = document.getElementById("reg-question").value;
    const answer = document.getElementById("reg-answer").value.trim();
    const birthdate = document.getElementById("reg-birthdate").value;

    if (!username || !password || !confirmPassword || !question || !answer || !birthdate) {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(u => u.username === username)) {
        alert("Username already exists.");
        return;
    }

    users.push({ username, password, securityQuestion: question, securityAnswer: answer, birthdate });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registered successfully!");
    window.location.href = "login.html";
}

// Handle Login
function handleLogin() {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        alert("Invalid credentials.");
        return;
    }

    sessionStorage.setItem("loggedInUser", JSON.stringify(user));
    alert("Login successful!");
    window.location.href = "home.html";
}

// Load Profile Data
function loadProfile() {
    const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (!user) {
        alert("No user session found.");
        return;
    }

    document.getElementById("profile-username").innerText = user.username;
    document.getElementById("profile-birthdate").innerText = user.birthdate;
    document.getElementById("profile-question").innerText = user.securityQuestion;
    document.getElementById("profile-answer").innerText = user.securityAnswer;
}

// Forgot Password - Validate Answer
function handleForgotPassword() {
    const username = document.getElementById("fp-username").value.trim();
    const question = document.getElementById("fp-question").value;
    const answer = document.getElementById("fp-answer").value.trim().toLowerCase();

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username);

    if (!user) {
        alert("Username not found.");
        return;
    }

    if (user.securityQuestion === question && user.securityAnswer.toLowerCase() === answer) {
        sessionStorage.setItem("resetUser", username);
        window.location.href = "change_password.html";
    } else {
        alert("Incorrect security question or answer.");
    }
}

// Change Password
function handleChangePassword() {
    const newPassword = document.getElementById("new-password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    const username = sessionStorage.getItem("resetUser");

    if (!newPassword || !confirmPassword) {
        alert("Please enter both password fields.");
        return;
    }
    if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const index = users.findIndex(u => u.username === username);

    if (index !== -1) {
        users[index].password = newPassword;
        localStorage.setItem("users", JSON.stringify(users));
        alert("Password changed successfully!");
        sessionStorage.removeItem("resetUser");
        window.location.href = "login.html";
    } else {
        alert("User not found.");
    }
}

// Get and Send Location
function handleCheckIn() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(function(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const timestamp = new Date().toISOString();
        const user = JSON.parse(sessionStorage.getItem("loggedInUser"));

        alert(`Checked in!\nUser: ${user.username}\nLat: ${latitude}, Lon: ${longitude}\nTime: ${timestamp}`);

        // Here you can use fetch/AJAX to send this to your server
        // fetch('https://your-linux-server.com/checkin', {...})
    }, function(error) {
        alert("Unable to retrieve location.");
    });
}

// Logout
function logout() {
    sessionStorage.clear();
    window.location.href = "login.html";
}
