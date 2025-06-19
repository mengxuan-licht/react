import React, { useEffect, useState } from 'react';
import Request from '../shared/Request.js';

export default function BlacklistView() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    const fetchBlacklist = () => {
        Request().get('/index.php?action=getBlacklist')
            .then(res => {
                const response = res.data;
                console.log("🔍 取得黑名單資料：", response);
                if (response.status !== 200) {
                    setError(response.message || "無法載入黑名單資料");
                    setUsers([]);
                    return;
                }
                setUsers(response.result || []);
                setError(null);
            })
            .catch(err => {
                setError(`錯誤：${err.message || err}`);
                setUsers([]);
            });
    };

    useEffect(() => {
        fetchBlacklist();
    }, []);

    const handleUnblock = (name) => {
        console.log(`🔍 解除封鎖使用者：${name}`);
        if (!name || name.trim() === '') {
            alert('❌ 缺少使用者名稱');
            return;
        }
        if (!window.confirm(`確定要解除「${name}」的黑名單狀態嗎？`)) return;

        Request()
            .post(
                '/index.php?action=unblockUser',
                { name },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then(res => {
                alert(res.data.message);
                if (res.data.status === 200) {
                    fetchBlacklist();
                }
            })
            .catch(err => {
                alert("❌ 無法解除封鎖，請稍後再試");
                console.error(err);
            });
    };

    if (error) {
        return <div className="alert-message alert-error">❌ {error}</div>;
    }

    if (users.length === 0) {
        return <p>目前沒有黑名單用戶。</p>;
    }

    return (
        <div>
            <h3>黑名單列表</h3>
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>使用者</th>
                        <th>Email</th>
                        <th>取消次數</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id || user.name}>
                            <td>{user.name || '無名稱'}</td>
                            <td>{user.email || '—'}</td>
                            <td>{user.cancel_count}</td>
                            <td>
                                <button
                                    className="unblock-btn"
                                    onClick={() => handleUnblock(user.name)}
                                >
                                    解除封鎖
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
