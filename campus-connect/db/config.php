<?php
// ============================================================
//  db/config.php — Database connection (XAMPP / MySQL)
//  Place the entire campus-connect folder inside:
//    C:\xampp\htdocs\campus-connect\
// ============================================================

define('DB_HOST', 'localhost');
define('DB_USER', 'root');        // default XAMPP user
define('DB_PASS', '');            // default XAMPP password (empty)
define('DB_NAME', 'campus_connect');

function db_connect(): mysqli {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        http_response_code(500);
        die(json_encode(['ok' => false, 'msg' => 'Database connection failed: ' . $conn->connect_error]));
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}

// Start session helper (call once per PHP file)
function session_start_once(): void {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}
