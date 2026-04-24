<?php
// ============================================================
//  php/logout.php — Destroy session, log activity, redirect
// ============================================================
require_once __DIR__ . '/../db/config.php';
session_start_once();

if (!empty($_SESSION['user_id'])) {
    $uid  = (int) $_SESSION['user_id'];
    $conn = db_connect();
    $conn->query("INSERT INTO user_logs (user_id, action) VALUES ($uid, 'logout')");
    $conn->close();
}

session_destroy();
header('Location: ../login.html');
exit;
