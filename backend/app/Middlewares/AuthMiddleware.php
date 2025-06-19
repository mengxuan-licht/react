<?php
namespace Middlewares;

use \Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Vendor\Controller;
use Models\User as UserModel;

class AuthMiddleware extends Controller {
    private static $name;
    private static $role;

    // ✅ 驗證並更新 token
    public static function checkToken() {
        $headers = getallheaders();
        $jwt = $headers['Authorization'] ?? null;
        $secret_key = "YOUR_SECRET_KEY";
        file_put_contents("debug_token.txt", print_r(getallheaders(), true));
        try {
            if (!$jwt) throw new Exception("Token 不存在");

            $payload = JWT::decode($jwt, new Key($secret_key, 'HS256'));
            self::$name = $payload->data->name;

            // 查詢當前使用者角色
            $um = new UserModel();
            $response = $um->getRoleByName(self::$name);
            self::$role = $response['role'] ?? 'user';

            // 更新 Token
            $newJwt = self::genToken(self::$name);

            return [
                "status" => 200,
                "message" => "Access granted",
                "token" => $newJwt,
                "role" => self::$role
            ];
        } catch (Exception $e) {
            return [
                "status" => 401,
                "message" => $e->getMessage()
            ];
        }
    }

    // ✅ 登入並發 token
    public static function doLogin() {
        parse_str(file_get_contents("php://input"), $_POST);

        $name = $_POST['name'] ?? '';
        $password = $_POST['password'] ?? '';

        $um = new UserModel();
        $response = $um->checkNamePw($name, $password);

        if (!isset($response['status']) || $response['status'] != 200) {
            return $response; // 原樣返回錯誤訊息
        }

        $user = $um->getRoleByName($name);
        $role = $user['role'] ?? 'user';

        // ✅ 取得黑名單狀態
        $blacklistRow = \Vendor\DB::select("SELECT is_blacklisted FROM user WHERE name = ?", [$name]);
        $is_blacklist = $blacklistRow['result'][0]['is_blacklisted'] ?? 0;

        $jwt = self::genToken($name);

        return [
            "status" => 200,
            "message" => "Access granted",
            "token" => $jwt,
            "role" => $role,
            "is_blacklist" => $is_blacklist,
            "user" => [
                "name" => $name,
                "role" => $role,
                "is_blacklisted" => $is_blacklist,
                "full_name" => $name // 這行是為了讓前端 LoginModal 裡的 greeting 顯示歡迎詞（可客製化）
            ]
        ];

    }


    // ✅ 公開：產生 JWT token
    public static function genToken($name) {
        $secret_key = "YOUR_SECRET_KEY";
        $issuer_claim = "http://localhost";
        $audience_claim = "http://localhost";
        $issuedat_claim = time();
        $expire_claim = $issuedat_claim + 3600;

        $um = new UserModel();
        $user = $um->getRoleByName($name);
        $role = $user['role'] ?? 'user';

        $payload = [
            "iss" => $issuer_claim,
            "aud" => $audience_claim,
            "iat" => $issuedat_claim,
            "exp" => $expire_claim,
            "data" => [
                "name" => $name,
                "role" => $role
            ]
        ];

        return JWT::encode($payload, $secret_key, 'HS256');
    }

    // ✅ 補上：取得當前帳號名稱
    public static function getCurrentUserName() {
        $headers = getallheaders();
        $jwt = $headers['Authorization'] ?? null;
        $secret_key = "YOUR_SECRET_KEY";

        if (!$jwt) return null;

        try {
            $payload = JWT::decode($jwt, new Key($secret_key, 'HS256'));
            return $payload->data->name ?? null;
        } catch (\Exception $e) {
            return null;
        }
    }

    // ✅ 補上：取得當前使用者角色
    public static function getCurrentUserRole() {
        $headers = getallheaders();
        $jwt = $headers['Authorization'] ?? null;
        $secret_key = "YOUR_SECRET_KEY";

        if (!$jwt) return 'user';

        try {
            $payload = JWT::decode($jwt, new Key($secret_key, 'HS256'));
            return $payload->data->role ?? 'user';
        } catch (\Exception $e) {
            return 'user';
        }
    }
    public static function canAccess($actionName) {
        
        $headers = getallheaders();
        $jwt = $headers['Authorization'] ?? null;
        $secret_key = "YOUR_SECRET_KEY";

        if (!$jwt) return false;

        try {
            $payload = JWT::decode($jwt, new Key($secret_key, 'HS256'));
            $name = $payload->data->name ?? null;

            // 查詢該 name 擁有哪些權限
            $sql = "
                SELECT a.name
                FROM user u
                JOIN user_role ur ON u.id = ur.user_id
                JOIN role r ON ur.role_id = r.id
                JOIN role_action ra ON r.id = ra.role_id
                JOIN action a ON ra.action_id = a.id
                WHERE u.name = ?
            ";
            $result = \Vendor\DB::select($sql, [$name]);
            $actions = array_column($result['result'], 'name');

            file_put_contents("debug_access.txt", "user=$name\nactions=" . print_r($actions, true));

            return in_array($actionName, $actions);
        } catch (\Exception $e) {
            return false;
        }
    }

    public static function checkPermission() {
        parse_str(file_get_contents("php://input"), $_POST);
        $action = $_POST['action'] ?? '';
        $result = self::canAccess($action);

        return [
            "status" => 200,
            "result" => $result
        ];
    }

    public static function isBlacklisted() {
        $name = self::getCurrentUserName();
        if (!$name) return false;

        $sql = "SELECT is_blacklisted FROM user WHERE name = ?";
        $result = \Vendor\DB::select($sql, [$name]);

        return isset($result['result'][0]['is_blacklisted']) && $result['result'][0]['is_blacklisted'] == 1;
    }

}
