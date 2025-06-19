<?php
namespace Models;
use Vendor\DB;

class User {

    public function getUsers($id = null) {
        if ($id) {
            $sql = "SELECT * FROM `user` WHERE `id` = ? LIMIT 1";
            return DB::select($sql, [$id]);
        } else {
            $sql = "SELECT * FROM `user` ORDER BY `id` ASC";
            return DB::select($sql, null);
        }
    }

    // 🔹 根據使用者名稱查詢角色（從 user_role 表 JOIN role 表）
    public function getRoleByName($name) {
        $sql = "
            SELECT r.name as role
            FROM user u
            JOIN user_role ur ON u.id = ur.user_id
            JOIN role r ON ur.role_id = r.id
            WHERE u.name = ?
            LIMIT 1
        ";
        $result = DB::select($sql, [$name]);
        return $result['result'][0] ?? ['role' => 'user']; // 若查不到角色，預設給 user
    }

    // 🔹 檢查帳號密碼是否正確
    public function checkNamePw($name, $pw) {
        $sql = "SELECT * FROM `user` WHERE `name` = ?";
        $response = DB::select($sql, [$name]);
        $rows = $response['result'];

        if (count($rows) === 0) {
            file_put_contents("debug_login.txt", "帳號不存在: $name\n", FILE_APPEND);
            return [
                "status" => 404,
                "message" => "帳號不存在"
            ];
        }

        $user = $rows[0];
        $storedHash = $user['password'];
        $verify = password_verify($pw, $storedHash);

        // 寫入 debug log
        file_put_contents("debug_login.txt", "輸入密碼: $pw\n", FILE_APPEND);
        file_put_contents("debug_login.txt", "資料庫密碼: $storedHash\n", FILE_APPEND);
        file_put_contents("debug_login.txt", "驗證結果: " . ($verify ? "成功" : "失敗") . "\n", FILE_APPEND);

        if (!$verify) {
            return [
                "status" => 403,
                "message" => "密碼錯誤"
            ];
        }

        return [
            "status" => 200,
            "result" => [$user]
        ];
    }


    // 🔹 新增使用者，並同時在 user_role 表建立角色關聯
    public function newUser($name, $password, $email) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO `user` (`name`, `password`, `email`) VALUES (?, ?, ?)";
        $inserted = DB::insert($sql, [$name, $hashedPassword, $email]);

        if (!$inserted) return false;

        $user = DB::select("SELECT id FROM `user` WHERE name = ?", [$name]);
        $userId = $user['result'][0]['id'] ?? null;

        if (!$userId) return false;

        return DB::insert("INSERT INTO `user_role` (`user_id`, `role_id`) VALUES (?, ?)", [$userId, 2]);
    }

    public function getBlacklist() {
        $sql = "SELECT id, name, email, cancel_count FROM user WHERE is_blacklisted = 1 ORDER BY id ASC";
        return DB::select($sql, []);
    }
    
    public function unblockByName($name) {
        $sql = "UPDATE user SET is_blacklisted = 0, cancel_count = 0 WHERE name = ?";
        return DB::update($sql, [$name]);
    }

}
