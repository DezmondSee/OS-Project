<?php
global $conn;
require 'db_connect.php';

$email = $_POST['email'];
$token = bin2hex(random_bytes(32));
$expires_at = date('Y-m-d H:i:s', strtotime('+1 hour'));

$stmt = $conn->prepare("INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $email, $token, $expires_at);

if ($stmt->execute()) {
    echo "Reset link generated: yoursite.com/reset_password.php?token=$token";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
