<?php
// ============================================================
//  php/profile.php — Return logged-in user's profile as JSON
// ============================================================
require_once __DIR__ . '/../db/config.php';
session_start_once();

header('Content-Type: application/json');

if (empty($_SESSION['user_id'])) {
    echo json_encode(['ok' => false, 'msg' => 'Not authenticated.']);
    exit;
}

$conn = db_connect();
$stmt = $conn->prepare('SELECT id, name, email, strand, role, created_at FROM users WHERE id = ?');
$stmt->bind_param('i', $_SESSION['user_id']);
$stmt->execute();
$result = $stmt->get_result();
$user   = $result->fetch_assoc();
$stmt->close();
$conn->close();

if (!$user) {
    echo json_encode(['ok' => false, 'msg' => 'User not found.']);
    exit;
}

echo json_encode(['ok' => true, 'user' => $user]);
