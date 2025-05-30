const username = "JohnDoe"; // Simulated session

function loadHome() {
    document.getElementById("username").textContent = username;
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
            document.getElementById("latitude").textContent = pos.coords.latitude.toFixed(6);
            document.getElementById("longitude").textContent = pos.coords.longitude.toFixed(6);
        });
    } else {
        alert("Geolocation not supported.");
    }
}

function loadProfile() {
    document.getElementById("profile-username").textContent = username;
}

function loadCheckin() {
    document.getElementById("checkin-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const note = document.getElementById("note").value;

        navigator.geolocation.getCurrentPosition(async pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            const formData = new FormData();
            formData.append("username", username);
            formData.append("note", note);
            formData.append("latitude", lat);
            formData.append("longitude", lon);

            try {
                const response = await fetch("https://your-server/checkin.php", {
                    method: "POST",
                    body: formData
                });
                const result = await response.text();
                document.getElementById("status").textContent = result;
            } catch (err) {
                document.getElementById("status").textContent = "Error submitting check-in.";
            }
        });
    });
}
