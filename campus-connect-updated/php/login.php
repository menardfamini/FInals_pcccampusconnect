<?php
// ============================================================
//  php/login.php — Authenticate user and start session
// ============================================================
require_once __DIR__ . '/../db/config.php';
session_start_once();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['ok' => false, 'msg' => 'Invalid request method.']);
    exit;
}

$email = trim($_POST['email'] ?? '');
$pass  = $_POST['password']   ?? '';

if (!$email || !$pass) {
    echo json_encode(['ok' => false, 'msg' => 'Email and password are required.']);
    exit;
}

$conn = db_connect();
$stmt = $conn->prepare('SELECT id, name, email, password, strand, role FROM users WHERE email = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();
$user   = $result->fetch_assoc();
$stmt->close();

if (!$user) {
    echo json_encode(['ok' => false, 'msg' => 'Invalid email or password.']);
    $conn->close(); exit;
}

// Normalize $2b$ prefix (Python bcrypt) to $2y$ (PHP bcrypt)
$hash = str_replace('$2b$', '$2y$', $user['password']);

if (!password_verify($pass, $hash)) {
    echo json_encode(['ok' => false, 'msg' => 'Invalid email or password.']);
    $conn->close(); exit;
}

// Update last_seen + log login
$uid = $user['id'];
$conn->query("UPDATE users SET last_seen = NOW() WHERE id = $uid");
$conn->query("INSERT INTO user_logs (user_id, action) VALUES ($uid, 'login')");

$conn->close();

// Store in session
$_SESSION['user_id']   = $user['id'];
$_SESSION['user_name'] = $user['name'];
$_SESSION['user_role'] = $user['role'];

echo json_encode([
    'ok'     => true,
    'role'   => $user['role'],
    'name'   => $user['name'],
    'strand' => $user['strand'],
    'msg'    => 'Login successful.'
]);
