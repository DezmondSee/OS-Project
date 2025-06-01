<?php
global $conn;
require 'db_connect.php';

$username = $_POST['username'];
$password = $_POST['password'];

$stmt = $conn->prepare("SELECT user_id, password FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result($user_id, $hashed_password);
    $stmt->fetch();

    if (password_verify($password, $hashed_password)) {
        echo "Login successful! User ID: $user_id";
    } else {
        echo "Invalid password!";
    }
} else {
    echo "User not found!";
}

$stmt->close();
$conn->close();
?>
