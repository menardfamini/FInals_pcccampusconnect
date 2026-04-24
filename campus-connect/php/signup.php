<?php
// ============================================================
//  php/signup.php — Register a new student account
// ============================================================
require_once __DIR__ . '/../db/config.php';
session_start_once();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['ok' => false, 'msg' => 'Invalid request method.']);
    exit;
}

$name   = trim($_POST['name']   ?? '');
$email  = trim($_POST['email']  ?? '');
$strand = trim($_POST['strand'] ?? '');
$pass   = $_POST['password']    ?? '';
$pass2  = $_POST['password2']   ?? '';

// ── Validation ───────────────────────────────────────────────
if (!$name || !$email || !$strand || !$pass || !$pass2) {
    echo json_encode(['ok' => false, 'msg' => 'All fields are required.']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['ok' => false, 'msg' => 'Invalid email address.']);
    exit;
}
if (strlen($pass) < 6) {
    echo json_encode(['ok' => false, 'msg' => 'Password must be at least 6 characters.']);
    exit;
}
if ($pass !== $pass2) {
    echo json_encode(['ok' => false, 'msg' => 'Passwords do not match.']);
    exit;
}

$conn = db_connect();

// Check duplicate email
$stmt = $conn->prepare('SELECT id FROM users WHERE email = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(['ok' => false, 'msg' => 'Email is already registered.']);
    $stmt->close(); $conn->close(); exit;
}
$stmt->close();

// Insert new student
$hash = password_hash($pass, PASSWORD_BCRYPT, ['cost' => 12]);
$role = 'student';
$stmt = $conn->prepare(
    'INSERT INTO users (name, email, password, strand, role) VALUES (?, ?, ?, ?, ?)'
);
$stmt->bind_param('sssss', $name, $email, $hash, $strand, $role);
if ($stmt->execute()) {
    echo json_encode(['ok' => true, 'msg' => 'Account created! You can now log in.']);
} else {
    echo json_encode(['ok' => false, 'msg' => 'Registration failed. Please try again.']);
}
$stmt->close();
$conn->close();
