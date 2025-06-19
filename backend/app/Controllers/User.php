<?php
namespace Controllers;

use Vendor\Controller;
use Models\User as UserModel;
use Middlewares\AuthMiddleware;

class User extends Controller
{
    private $um;

    public function __construct() {
        $this->um = new UserModel();
    }

    // 🔹 查詢使用者：單一 or 所有
    public function getUsers() {
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            return $this->um->getUsers($id);
        } else {
            return $this->um->getUsers();
        }
    }

    // 🔹 僅限 admin：新增使用者（含配對角色）
    public function newUser() {
        $role = AuthMiddleware::getCurrentUserRole();
        if ($role !== 'admin') {
            return ['status' => 403, 'message' => '權限不足，只有管理員可以新增使用者'];
        }

        parse_str(file_get_contents("php://input"), $_POST);
        $name     = $_POST['name'] ?? '';
        $password = $_POST['password'] ?? '';
        $email    = $_POST['email'] ?? '';

        if (!$name || !$password || !$email) {
            return ['status' => 400, 'message' => '請填寫完整欄位'];
        }

        $inserted = $this->um->newUser($name, $password, $email);

        return $inserted ? ['status' => 200, 'message' => '新增成功'] :
                           ['status' => 500, 'message' => '新增失敗'];
    }

    // 🔹 前台註冊（權限一律為 user）
    public function publicRegister() {
        parse_str(file_get_contents("php://input"), $_POST);
        $name     = $_POST['name'] ?? '';
        $password = $_POST['password'] ?? '';
        $email    = $_POST['email'] ?? '';

        if (!$name || !$password || !$email) {
            return ['status' => 400, 'message' => '請填寫完整欄位'];
        }

        $inserted = $this->um->newUser($name, $password, $email);

        return $inserted ? ['status' => 200, 'message' => '註冊成功'] :
                        ['status' => 500, 'message' => '註冊失敗'];
    }

    // 🔹 刪除使用者（需權限驗證）
    public function removeUser() {
        parse_str(file_get_contents("php://input"), $_POST);
        $id = $_POST['id'] ?? '';
        return $this->um->removeUser($id);
    }

    // 🔹 修改使用者（需權限驗證）
    public function updateUser() {
        parse_str(file_get_contents("php://input"), $_POST);
        $id       = $_POST['id'] ?? '';
        $name     = $_POST['name'] ?? '';
        $password = $_POST['password'] ?? '';
        $email    = $_POST['email'] ?? '';

        return $this->um->updateUser($id, $name, $password, $email);
    }

    // 🔹 回傳目前登入者資訊
    public function getProfile() {
        $name = AuthMiddleware::getCurrentUserName();
        $role = AuthMiddleware::getCurrentUserRole();

        return [
            'status' => 200,
            'name' => $name,
            'role' => $role,
            'message' => '已登入'
        ];
    }

    public function getBlacklist() {
        if (AuthMiddleware::getCurrentUserRole() !== 'admin') {
            return ['status' => 403, 'message' => '權限不足'];
        }

        $result = $this->um->getBlacklist();
        return [
            'status' => 200,
            'result' => $result['result'] ?? []
        ];
    }


    public function unblockUser() {
        if (AuthMiddleware::getCurrentUserRole() !== 'admin') {
            return ['status' => 403, 'message' => '權限不足'];
        }

        $input = json_decode(file_get_contents("php://input"), true);
        $name = $input['name'] ?? '';  // ← 修正重點

        if (!$name) {
            return ['status' => 400, 'message' => '❌ 缺少使用者名稱'];
        }

        $updated = $this->um->unblockByName($name);
        return $updated
            ? ['status' => 200, 'message' => '✅ 已解除封鎖']
            : ['status' => 500, 'message' => '❌ 解除失敗'];
    }

}
