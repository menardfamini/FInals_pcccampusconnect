<?php
// ============================================================
//  php/logout.php — Destroy session and redirect to login
// ============================================================
require_once __DIR__ . '/../db/config.php';
session_start_once();
session_destroy();
header('Location: ../login.html');
exit;
