<?php
global $conn;
require 'db_connect.php';

$token = $_POST['token'];
$new_password = password_hash($_POST['new_password'], PASSWORD_DEFAULT);

$stmt = $conn->prepare("SELECT email FROM password_resets WHERE token = ? AND expires_at > NOW()");
$stmt->bind_param("s", $token);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result($email);
    $stmt->fetch();

    // Update password
    $update = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
    $update->bind_param("ss", $new_password, $email);
    $update->execute();

    echo "Password updated successfully.";
    $update->close();
} else {
    echo "Invalid or expired token.";
}

$stmt->close();
$conn->close();
?>
