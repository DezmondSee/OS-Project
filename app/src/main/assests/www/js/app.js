document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.getElementById('logout-link');
    if(logoutLink) {
        logoutLink.addEventListener('click', e => {
            e.preventDefault();
            localStorage.clear(); // clear session or localStorage here
            alert('Logged out!');
            window.location.href = 'login.html';
        });
    }
});

// Geolocation for check-in and home page map
function getLocation() {
    const locationElem = document.getElementById("location");
    if (!locationElem) return;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        locationElem.innerText = "Geolocation not supported by your browser.";
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const locationElem = document.getElementById("location");
    locationElem.innerText = `Latitude: ${lat.toFixed(5)}, Longitude: ${lon.toFixed(5)}`;

    // Send to checkin.php
    const username = localStorage.getItem('username') || '';
    fetch('php/checkin.php', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `username=${encodeURIComponent(username)}&latitude=${lat}&longitude=${lon}`
    });

    // Show map using Leaflet.js
    if(window.L && document.getElementById('map')) {
        const map = L.map('map').setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        L.marker([lat, lon]).addTo(map).bindPopup("You are here.").openPopup();
    }
}

function showError(error) {
    const locationElem = document.getElementById("location");
    switch(error.code) {
        case error.PERMISSION_DENIED:
            locationElem.innerText = "Permission denied for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            locationElem.innerText = "Location information unavailable.";
            break;
        case error.TIMEOUT:
            locationElem.innerText = "Geolocation request timed out.";
            break;
        default:
            locationElem.innerText = "An unknown error occurred.";
    }
}

// Login form submit
function loginUser(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if(username === '' || password === '') {
        alert('Please fill username and password');
        return;
    }

    fetch('php/login.php', {
        method: 'POST',
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    })
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                localStorage.setItem("username", username);
                alert("Logged in successfully");
                window.location.href = 'homePage.html';
            } else {
                alert("Invalid username or password");
            }
        });
}

// Register form submit
function registerUser(event) {
    event.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const password2 = document.getElementById('reg-password2').value;
    const securityQuestion = document.getElementById('reg-security-question').value;
    const securityAnswer = document.getElementById('reg-security-answer').value.trim();
    const birthdate = document.getElementById('reg-birthdate').value;

    if (!username || !password || !password2 || !securityAnswer || !birthdate) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== password2) {
        alert('Passwords do not match');
        return;
    }

    fetch('php/register.php', {
        method: 'POST',
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&security_question=${encodeURIComponent(securityQuestion)}&security_answer=${encodeURIComponent(securityAnswer)}&birthdate=${encodeURIComponent(birthdate)}`
    })
        .then(res => res.text())
        .then(data => {
            if(data === 'success') {
                alert(`User ${username} registered!`);
                window.location.href = 'login.html';
            } else {
                alert("Registration failed. " + data);
            }
        });
}

// Forgot password form submit
function forgotPassword(event) {
    event.preventDefault();
    const username = document.getElementById('fp-username').value.trim();
    const question = document.getElementById('fp-security-question').value;
    const answer = document.getElementById('fp-security-answer').value.trim();

    if(!username || !answer) {
        alert('Please fill in all fields');
        return;
    }

    fetch('php/forgot_password.php', {
        method: 'POST',
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: `username=${encodeURIComponent(username)}&security_question=${encodeURIComponent(question)}&security_answer=${encodeURIComponent(answer)}`
    })
        .then(res => res.text())
        .then(response => {
            if(response === 'success') {
                alert('Security question verified. Proceed to change password.');
                window.location.href = `change_password.html?username=${encodeURIComponent(username)}`;
            } else {
                alert('Security answer is incorrect.');
            }
        });
}

// Change password form submit
function changePassword(event) {
    event.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');
    const password = document.getElementById('cp-password').value;
    const password2 = document.getElementById('cp-password2').value;

    if(!password || !password2) {
        alert('Please fill all fields');
        return;
    }
    if(password !== password2) {
        alert('Passwords do not match');
        return;
    }

    fetch('php/change_password.php', {
        method: 'POST',
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: `username=${encodeURIComponent(username)}&new_password=${encodeURIComponent(password)}`
    })
        .then(res => res.text())
        .then(response => {
            if(response === 'success') {
                alert('Password changed successfully!');
                window.location.href = 'login.html';
            } else {
                alert('Failed to change password.');
            }
        });
}
