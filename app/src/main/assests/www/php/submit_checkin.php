<?php
// Database connection settings
$host = "localhost";
$username = "root";
$password = "";
$database = "gps_checkin";

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get POST data safely (basic sanitization)
$latitude = isset($_POST['latitude']) ? floatval($_POST['latitude']) : 0;
$longitude = isset($_POST['longitude']) ? floatval($_POST['longitude']) : 0;
$ip = isset($_POST['ip']) ? $_POST['ip'] : $_SERVER['REMOTE_ADDR']; // fallback to server IP
$time = isset($_POST['time']) ? $_POST['time'] : date('Y-m-d H:i:s'); // fallback to current time

// Prepare and bind
$stmt = $conn->prepare("INSERT INTO checkins (Latitude, Longitude, IP_Address, Checkin_Time) VALUES (?, ?, ?, ?)");
if (!$stmt) {
    die("Prepare failed: " . $conn->error);
}

$stmt->bind_param("ddss", $latitude, $longitude, $ip, $time);

// Execute statement
if ($stmt->execute()) {
    echo "Check-in successful!";
} else {
    echo "Error: " . $stmt->error;
}

// Close connections
$stmt->close();
$conn->close();
?>
