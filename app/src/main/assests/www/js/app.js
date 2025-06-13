document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', e => {
            e.preventDefault();
            alert('Logged out!');
            window.location.href = 'login.html';
        });
    }

    const checkinBtn = document.getElementById('checkin-btn');
    if (checkinBtn) {
        checkinBtn.addEventListener('click', handleCheckIn);
    }

    getLocation();
});

// Geolocation + Leaflet map
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

    // Show map using Leaflet
    if (window.L && document.getElementById('map')) {
        const map = L.map('map').setView([lat, lon], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        L.marker([lat, lon]).addTo(map).bindPopup("You are here.").openPopup();
    }
}

function showError(error) {
    const locationElem = document.getElementById("location");
    switch (error.code) {
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

// ✅ Check-in handler — sends data to PHP
function handleCheckIn() {
    const resultElem = document.getElementById("checkin-result");

    if (!navigator.geolocation) {
        alert("Geolocation not supported.");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const time = new Date().toISOString();
        const ip = ""; // optional: backend can use $_SERVER['REMOTE_ADDR']

        const formData = new URLSearchParams();
        formData.append("latitude", lat);
        formData.append("longitude", lon);
        formData.append("ip", ip);
        formData.append("time", time);

        fetch("php/checkin.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData
        })
            .then(res => res.text())
            .then(data => {
                resultElem.innerHTML = `<p class="success">${data}</p>`;
            })
            .catch(err => {
                resultElem.innerHTML = `<p class="error">Check-in failed: ${err}</p>`;
            });
    }, () => {
        alert("Unable to get location for check-in.");
    });
}

// ✅ Login form
function loginUser(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username === '' || password === '') {
        alert('Please fill username and password');
        return;
    }

    // TODO: Replace with backend login
    alert(`Logged in as ${username}`);
    window.location.href = 'homePage.html';
}

// ✅ Register form
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

    // TODO: Replace with backend register logic
    alert(`User ${username} registered!`);
    window.location.href = 'login.html';
}

// ✅ Forgot password form
function forgotPassword(event) {
    event.preventDefault();
    const username = document.getElementById('fp-username').value.trim();
    const question = document.getElementById('fp-security-question').value;
    const answer = document.getElementById('fp-security-answer').value.trim();

    if (!username || !answer) {
        alert('Please fill in all fields');
        return;
    }

    // TODO: Replace with backend check
    alert('Security question verified. Proceed to change password.');
    window.location.href = `change_password.html?username=${encodeURIComponent(username)}`;
}

// ✅ Change password form
function changePassword(event) {
    event.preventDefault();
    const password = document.getElementById('cp-password').value;
    const password2 = document.getElementById('cp-password2').value;

    if (!password || !password2) {
        alert('Please fill all fields');
        return;
    }

    if (password !== password2) {
        alert('Passwords do not match');
        return;
    }

    // TODO: Replace with backend password update
    alert('Password changed successfully!');
    window.location.href = 'login.html';
}
