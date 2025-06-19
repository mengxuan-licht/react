<?php
namespace Controllers;

use Vendor\Controller;
use Models\Order as OrderModel;
use Middlewares\AuthMiddleware;

class Order extends Controller
{
    private $om;

    public function __construct() {
        $this->om = new OrderModel();
    }

    public function getOrders() {
        if (!AuthMiddleware::canAccess('view_orders')) {
            return [
                "status" => 403,
                "message" => "❌ 權限不足"
            ];
        }

        $name = AuthMiddleware::getCurrentUserName();
        $role = AuthMiddleware::getCurrentUserRole();
        $isBlacklisted = AuthMiddleware::isBlacklisted();

        $start = $_POST['start_date'] ?? null;
        $end   = $_POST['end_date'] ?? null;

        if (isset($_GET['id'])) {
            return $this->om->getOrders($_GET['id']);
        }

        if ($role === 'admin') {
            $orders = $this->om->getOrders(null, $start, $end); // ← 改帶參數
        } else {
            $orders = $this->om->getOrdersByUsername($name, $start, $end); // ← 改帶參數
        }

        return array_merge($orders, [
            "status" => 200,
            "token" => AuthMiddleware::genToken($name),
            "role" => $role,
            "is_blacklisted" => $isBlacklisted ? 1 : 0
        ]);
    }




public function newOrder() {
    // ⛔ 直接阻擋黑名單使用者
    if (AuthMiddleware::isBlacklisted()) {
        return [
            "status" => 403,
            "message" => "⚠️ 您已被列入黑名單，無法送出新委託"
        ];
    }

    // ✅ 若有啟用 RBAC，這裡可以保留額外的權限控制
    if (!AuthMiddleware::canAccess('create_orders')) {
        return [
            "status" => 403,
            "message" => "⚠️ 您沒有建立委託的權限"
        ];
    }

    parse_str(file_get_contents("php://input"), $_POST);
    $username        = $_POST['username'] ?? '';
    $titles          = $_POST['titles'] ?? '';
    $contact         = $_POST['contact'] ?? '';
    $content         = $_POST['content'] ?? '';
    $style           = $_POST['style'] ?? '';
    $budget          = $_POST['budget'] ?? '';
    $deadline        = $_POST['deadline'] ?? '';
    $usages          = $_POST['usages'] ?? '';
    $payment_method  = $_POST['payment_method'] ?? '';
    $region          = $_POST['region'] ?? '';
    $note            = $_POST['note'] ?? '';

    $fettle     = '未讀';
    $pay_status = '未付款';

    $result = $this->om->newOrder($username, $titles, $contact, $content, $style, $budget, $deadline, $usages, $fettle, $pay_status, $payment_method, $region, $note);

    return [
        "status" => 200,
        "message" => "委託資料新增成功",
        "result" => $result,
        "token" => AuthMiddleware::genToken(AuthMiddleware::getCurrentUserName()),
        "role" => AuthMiddleware::getCurrentUserRole()
    ];
}


    public function removeOrder() {
    if (!AuthMiddleware::canAccess('delete_orders')) {
        return [
            "status" => 403,
            "message" => "沒有刪除權限"
        ];
    }
        parse_str(file_get_contents("php://input"), $_POST);
        $id = $_POST['id'] ?? '';
        $result = $this->om->removeOrder($id);

        $response = [
            "status" => 200,
            "message" => "刪除成功",
            "result" => $result
        ];

        $response['token'] = AuthMiddleware::genToken(AuthMiddleware::getCurrentUserName());
        $response['role'] = AuthMiddleware::getCurrentUserRole();
        return $response;
    }

    public function updateOrder() {
        parse_str(file_get_contents("php://input"), $_POST);
        $id = $_POST['id'] ?? '';
        $tokenName = \Middlewares\AuthMiddleware::getCurrentUserName();
        $role = \Middlewares\AuthMiddleware::getCurrentUserRole();

        $om = new OrderModel();
        $getResult = $om->getById($id);

        // 查無資料
        if ($getResult['status'] !== 200 || empty($getResult['result'])) {
            return [
                'status' => 404,
                'message' => '找不到資料'
            ];
        }

        $order = $getResult['result'][0];

        // 一般使用者限制：只能修改自己的「未讀」訂單
        if ($role !== 'admin') {
            if ($order['username'] !== $tokenName || $order['fettle'] !== '未讀') {
                return [
                    'status' => 403,
                    'message' => '權限不足，僅能修改自己的未讀訂單',
                    'debug' => [
                        'tokenName' => $tokenName,
                        'orderOwner' => $order['username'],
                        'fettle' => $order['fettle']
                    ]
                ];
            }

            // 僅允許使用者改 contact 與 note 欄位
            $titles = $_POST['titles']; 
            $contact = $_POST['contact'] ?? '';
            $content = $_POST['content'] ?? '';
            $style = $_POST['style'] ?? '';
            $budget = $_POST['budget'] ?? '';
            $deadline = $_POST['deadline'] ?? '';
            $note = $_POST['note'] ?? '';
            $usages = $_POST['usages'] ?? '';
            $payment_method = $_POST['payment_method'] ?? '';
            $region = $_POST['region'] ?? '';
            $result = $om->updateOrderAsUser($id, $titles,$contact, $content, $style, $budget, $deadline, $note, $usages, $payment_method, $region);

            return [
                'status' => $result['status'],
                'message' => $result['message'],
                'token' => \Middlewares\AuthMiddleware::genToken($tokenName),
                'role' => $role
            ];
        }

        // 管理員可修改所有欄位
        $result = $om->updateAll($_POST);

        if ($_POST['fettle'] === '棄單') {
            $targetUser = $order['username']; // 從原始訂單資料抓取用戶名
            $om->blacklistUser($targetUser);
        }
        error_log("✅ 傳入 updateAll 的資料：" . print_r($_POST, true));
        return [
            'status' => $result['status'],
            'message' => $result['message'],
            'token' => \Middlewares\AuthMiddleware::genToken($tokenName),
            'role' => $role
        ];
    }

    public function getProfile() {
        $name = AuthMiddleware::getCurrentUserName();
        $role = AuthMiddleware::getCurrentUserRole();
        $isBlacklisted = AuthMiddleware::isBlacklisted();

        if ($name) {
            return [
                'status' => 200,
                'message' => '已登入',
                'name' => $name,
                'role' => $role,
                'is_blacklisted' => $isBlacklisted ? 1 : 0
            ];
        } else {
            return [
                'status' => 401,
                'message' => '未登入或無效 token'
            ];
        }
    }

    public function canAccess() {
    if (!isset($_GET['action'])) {
        return [
            "status" => 400,
            "message" => "缺少 action 名稱"
        ];
    }

    $action = $_GET['action'];
    $result = AuthMiddleware::canAccess($action);

    return [
        "status" => 200,
        "canAccess" => $result
    ];
    }

    public function markAsRead() {
        parse_str(file_get_contents("php://input"), $_POST);
        $id = $_POST['id'] ?? '';
        $om = new OrderModel();

        $getResult = $om->getById($id);
        if ($getResult['status'] !== 200 || empty($getResult['result'])) {
            return ['status' => 404, 'message' => '找不到該筆訂單'];
        }

        $result = $om->markAsRead($id);
        return [
            'status' => $result['status'],
            'message' => $result['message']
        ];
    }

    public function updateStartDate() {
        parse_str(file_get_contents("php://input"), $_POST);
        $id = $_POST['id'] ?? null;
        $start_date = $_POST['start_date'] ?? null;

        error_log("📥 接收到 id={$id}, start_date={$start_date}");

        if (!$id || !$start_date) {
            error_log("⚠️ 缺少必要參數");
            return ['status' => 400, 'message' => '缺少必要參數'];
        }

        $model = new \Models\Order(); 
        $success = $model->setStartDate($id, $start_date);

        if ($success) {
            error_log("✅ 排程成功：訂單 {$id} 更新為 {$start_date}");
            return ['status' => 200, 'message' => '排程成功'];
        } else {
            error_log("❌ 資料庫更新失敗");
            return ['status' => 500, 'message' => '資料庫更新失敗'];
        }
    }

public function cancelOrder() {
    $id = $_POST['id'] ?? '';  // 直接用 $_POST 取得參數
    $username = AuthMiddleware::getCurrentUserName();

    if (!$id) {
        return ['status' => 400, 'message' => '❌ 缺少訂單 ID'];
    }

    $getResult = $this->om->getById($id);
    if ($getResult['status'] !== 200 || empty($getResult['result'])) {
        return ['status' => 404, 'message' => '找不到該筆訂單'];
    }

    $order = $getResult['result'][0];
    if ($order['fettle'] !== '未讀' || $order['username'] !== $username) {
        return ['status' => 403, 'message' => '僅能取消自己的未讀訂單'];
    }

    $result = $this->om->markAsCancelled($id, $username);
    return [
        'status' => $result['status'],
        'message' => $result['message']
    ];
}



}
