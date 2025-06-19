<?php
namespace Models;
use Vendor\DB;

class Order {

    public function getOrders($id = null, $start = null, $end = null) {
        if ($id) {
            $sql = "SELECT * FROM `orders` WHERE `id` = ? LIMIT 1";
            return DB::select($sql, [$id]);
        } else {
            $sql = "SELECT * FROM `orders` WHERE 1";
            $params = [];

            if ($start && $end) {
                $sql .= " AND DATE(`date`) BETWEEN ? AND ?";
                $params[] = $start;
                $params[] = $end;
            }

            $sql .= " ORDER BY `id` ASC";
            return DB::select($sql, $params);
        }
    }

    public function newOrder($username, $titles, $contact, $content, $style, $budget, $deadline, $usages, $fettle, $pay_status, $payment_method, $region, $note) {
        $sql = "INSERT INTO `orders` 
                (`username`, `titles`,`contact`, `content`, `style`, `budget`, `deadline`, `usages`,  `fettle`, `pay_status`, `payment_method`, `region`, `note`) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $inserted = DB::insert($sql, [$username, $titles, $contact, $content, $style, $budget, $deadline, $usages, $fettle, $pay_status, $payment_method, $region, $note]);

        if ($inserted && isset($inserted['lastInsertId'])) {
            return [
                "status" => 200,
                "message" => "新增成功",
                "insertId" => $inserted['lastInsertId']
            ];
        } else {
            return [
                "status" => 500,
                "message" => "新增失敗，請稍後再試"
            ];
        }
    }

    public function removeOrder($id) {
        $sql = "DELETE FROM `orders` WHERE `id` = ?";
        return DB::delete($sql, [$id]);
    }

    public function updateOrder($id, $username, $titles,$contact, $content, $style, $budget, $deadline, $usages, $fettle, $pay_status, $payment_method, $region, $note) {
        $sql = "UPDATE `orders` SET
                    `username` = ?, `titles` = ?, `contact` = ?, `content` = ?, `style` = ?, `budget` = ?, `deadline` =?, `usages` = ?, `fettle` = ?,
                    `pay_status` = ?, `payment_method` = ?, `region` = ?, `note` = ?
                WHERE `id` = ?";
        return DB::update($sql, [$username, $titles, $contact, $content, $style, $budget, $deadline, $usages, $fettle, $pay_status, $payment_method, $region, $note, $id]);
    }

    public function getOrdersByUsername($username, $start = null, $end = null) {
        $sql = "SELECT * FROM `orders` WHERE `username` = ?";
        $params = [$username];

        if ($start && $end) {
            $sql .= " AND DATE(`date`) BETWEEN ? AND ?";
            $params[] = $start;
            $params[] = $end;
        }

        $sql .= " ORDER BY `id` ASC";
        return DB::select($sql, $params);
    }

    public function updateOrderAsUser($id, $titles, $contact, $content, $style, $budget, $deadline, $note, $usages, $payment_method, $region) {
            $sql = "UPDATE orders SET 
                titles = ?,
                contact = ?, 
                content = ?, 
                style =?,
                budget = ?,
                deadline = ?,
                note = ?, 
                usages = ?, 
                payment_method = ?, 
                region = ? 
            WHERE id = ?";
        return DB::update($sql, [$titles, $contact, $content, $style, $budget, $deadline, $note, $usages, $payment_method, $region, $id]);
    }

    public function updateAll($data) {
        $sql = "UPDATE orders SET
            titles = ?,
            contact = ?, content = ?, style = ?, budget = ?, deadline =?, usages = ?, fettle = ?, pay_status = ?,
            payment_method = ?, region = ?, note = ?
            WHERE id = ?";
        return DB::update($sql, [
            $data['titles'], $data['contact'], $data['content'], $data['style'], $data['budget'], $data['deadline'], $data['usages'], $data['fettle'],
            $data['pay_status'], $data['payment_method'], $data['region'],
            $data['note'], $data['id']
        ]);
    }

    public function getById($id) {
        $sql = "SELECT * FROM orders WHERE id = ? LIMIT 1";
        return DB::select($sql, [$id]);
    }

    public function markAsRead($id) {
        $sql = "UPDATE orders SET fettle = '已讀' WHERE id = ?";
        return DB::update($sql, [$id]);
    }

    public function setStartDate($id, $start_date) {
        $sql = "UPDATE `orders` SET `start_date` = ? WHERE `id` = ?";
        return DB::update($sql, [$start_date, $id]);
    }
    
    public function markAsCancelled($id, $username) {
        // 標記訂單為已取消
        DB::update("UPDATE orders SET fettle = '已取消' WHERE id = ?", [$id]);

        // 增加取消次數
        DB::update("UPDATE user SET cancel_count = cancel_count + 1 WHERE name = ?", [$username]);

        // 取得目前取消次數
        $check = DB::select("SELECT cancel_count FROM user WHERE name = ?", [$username]);
        $count = $check['result'][0]['cancel_count'] ?? 0;

        // 若超過三次則列入黑名單
        if ($count >= 3) {
            DB::update("UPDATE user SET is_blacklisted = 1 WHERE name = ?", [$username]);
        }

        return ['status' => 200, 'message' => '已成功取消委託'];
    }

    public function blacklistUser($username) {
        // 設定為黑名單
        DB::update("UPDATE user SET is_blacklisted = 1 WHERE name = ?", [$username]);

        // 可選：移除使用者 create_orders 權限（若有 user_role 表）
        DB::delete("DELETE FROM user_role 
                    WHERE user_id = (SELECT id FROM user WHERE name = ?) 
                    AND role_id = (SELECT id FROM role WHERE name = 'create_orders')", [$username]);

        return true;
    }
}