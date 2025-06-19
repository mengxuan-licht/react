<?php
// CORS 設定：必須放在最上面！
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once __DIR__ . '/../vendor/autoload.php';
use bootstrap\Main;

Main::run();
