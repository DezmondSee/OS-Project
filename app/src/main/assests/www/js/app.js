// Navigation handled by <a href> links, except logout handled here
document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.getElementById('logout-link');
    if(logoutLink) {
        logoutLink.addEventListener('click', e => {
            e.preventDefault();
            // clear session or localStorage here
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

    // Display map with Leaflet.js
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

// Login form submit example
function loginUser(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if(username === '' || password === '') {
        alert('Please fill username and password');
        return;
    }

    // TODO: send login request to backend, for demo just redirect
    alert(`Logged in as ${username}`);
    window.location.href = 'homePage.html';
}

// Register form submit example
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

    // TODO: send register request to backend
    alert(`User ${username} registered!`);
    window.location.href = 'login.html';
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

    // TODO: validate question and answer from backend
    alert('Security question verified. Proceed to change password.');
    // Redirect to change password page with username passed (can be via query string or storage)
    window.location.href = `change_password.html?username=${encodeURIComponent(username)}`;
}

// Change password form submit
function changePassword(event) {
    event.preventDefault();
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

    // TODO: send password change request to backend

    alert('Password changed successfully!');
    window.location.href = 'login.html';
}
