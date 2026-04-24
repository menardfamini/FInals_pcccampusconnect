<?php
// ============================================================
//  php/admin_users.php — Return user stats + recent users
//  Called by the admin dashboard (AJAX)
// ============================================================
require_once __DIR__ . '/../db/config.php';
session_start_once();

header('Content-Type: application/json');

// Only admins may call this
if (empty($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['ok' => false, 'msg' => 'Unauthorized.']);
    exit;
}

$conn = db_connect();

// ── Total registered users (students only) ───────────────────
$r = $conn->query("SELECT COUNT(*) AS total FROM users WHERE role = 'student'");
$total_users = (int) $r->fetch_assoc()['total'];

// ── Active users — logged in within the last 15 minutes ──────
$r = $conn->query("SELECT COUNT(*) AS active FROM users
                   WHERE last_seen >= DATE_SUB(NOW(), INTERVAL 15 MINUTE)
                   AND role = 'student'");
$active_users = (int) $r->fetch_assoc()['active'];

// ── Recent registrations — last 10 students ──────────────────
$r = $conn->query(
    "SELECT id, name, email, strand, role, created_at, last_seen
     FROM users
     WHERE role = 'student'
     ORDER BY created_at DESC
     LIMIT 10"
);
$recent_users = [];
while ($row = $r->fetch_assoc()) {
    $recent_users[] = $row;
}

// ── Recent activity log — last 15 entries ────────────────────
$r = $conn->query(
    "SELECT ul.action, ul.logged_at, u.name, u.email, u.role
     FROM user_logs ul
     JOIN users u ON ul.user_id = u.id
     ORDER BY ul.logged_at DESC
     LIMIT 15"
);
$activity_log = [];
while ($row = $r->fetch_assoc()) {
    $activity_log[] = $row;
}

$conn->close();

echo json_encode([
    'ok'           => true,
    'total_users'  => $total_users,
    'active_users' => $active_users,
    'recent_users' => $recent_users,
    'activity_log' => $activity_log,
]);
