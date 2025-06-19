<?php

namespace bootstrap;

use Middlewares\AuthMiddleware;
use Vendor\DB;
use Vendor\Router;

class Main {
    static function run() {
        $conf = parse_ini_file(__DIR__ . '/../vendor/.env');
        DB::$dbHost = $conf['dbHost'];
        DB::$dbName = $conf['dbName'];
        DB::$dbUser = $conf['dbUser'];
        DB::$dbPassword = $conf['dbPassword'];

        $action = $_GET['action'] ?? "no_action";

        // ✅ 白名單：不需要驗證 token 的動作
        $noAuthActions = ['doLogin', 'registerUser', 'newOrder', 'checkPermission'];

        if (in_array($action, $noAuthActions)) {
            switch ($action) {
                case 'doLogin':
                    $response = AuthMiddleware::doLogin();
                    break;
                case 'checkPermission':
                    $response = AuthMiddleware::checkPermission();
                    break;
                case 'registerUser':
                case 'newOrder':
                    $router = new Router();
                    require_once __DIR__ . '/../routes/web.php';
                    $response = $router->run($action);
                    break;
                default:
                    $response = ['status' => 400, 'message' => '未知動作'];
                    break;
            }
        } else {
            // ✅ 其他動作需驗證 Token
            $responseToken = AuthMiddleware::checkToken();

            if ($responseToken['status'] === 200) {
                $router = new Router();
                require_once __DIR__ . '/../routes/web.php';
                $response = $router->run($action);
                $response['token'] = $responseToken['token']; // 續簽 token
                $response['role'] = $responseToken['role'];   // 傳回 role
            } else {
                $response = $responseToken;
            }
        }

        echo json_encode($response);
    }
}
