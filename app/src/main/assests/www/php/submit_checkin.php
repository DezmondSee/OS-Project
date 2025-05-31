<?php
$host = "localhost";
$username = "root";
$password = "";
$database = "gps_checkin";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$latitude = $_POST['latitude'];
$longitude = $_POST['longitude'];
$ip = $_POST['ip'];
$time = $_POST['time'];

// Using simple query (not recommended - better to use prepared statements to avoid SQL injection)
$sql = "INSERT INTO checkins (Latitude, Longitude, IP_Address, Checkin_Time)
        VALUES ('$latitude', '$longitude', '$ip', '$time')";

if ($conn->query($sql) === TRUE) {
    echo "Check-in successful!";
} else {
    echo "Error: " . $conn->error;
}

// Using prepared statement (recommended)
$stmt = $conn->prepare("INSERT INTO checkins (Latitude, Longitude, IP_Address, Checkin_Time) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ddss", $latitude, $longitude, $ip, $time);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo "Check-in successful!";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
