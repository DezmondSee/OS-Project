<?php
global $conn;
require 'db_connect.php';

$user_id = $_GET['user_id'];

$stmt = $conn->prepare("SELECT username, email, full_name, created_at FROM users WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo "User not found.";
}

$stmt->close();
$conn->close();
?>
