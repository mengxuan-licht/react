<?php
// 允許來自 http://localhost:3000 的跨來源請求
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Auth");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");

// 處理預檢請求 (Preflight Request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204); // No Content
    exit;
}

// ✅ 正確：先載入 Composer 的 autoloader
require_once __DIR__ . '/../vendor/autoload.php';

// ✅ 引入命名空間的 Main 類別
use bootstrap\Main;

Main::run();
