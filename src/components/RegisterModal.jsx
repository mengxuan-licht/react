import React, { useState, useEffect } from 'react';
import Request from '../shared/Request';
import qs from 'qs';
import '../style/login.css';

export default function RegisterModal({ open, onClose, onRegisterSuccess }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false); // 控制淡出動畫

    useEffect(() => {
        if (open) {
            setVisible(true);
        }
    }, [open]);

    const handleRegister = () => {
        if (!name || !email || !password) {
            alert('請完整填寫所有欄位！');
            return;
        }

        setLoading(true);
        const data = { name, password, email };
        Request().post('/index.php?action=registerUser', qs.stringify(data), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then(resp => {
                const response = resp.data;
                setLoading(false);
                if (response.status === 200) {
                    alert('註冊成功，請重新登入');
                    onRegisterSuccess();
                    handleClose(); // 淡出後關閉
                } else {
                    alert(response.message || '註冊失敗');
                }
            })
            .catch(err => {
                setLoading(false);
                console.error(err);
                alert('註冊時發生錯誤');
            });
    };

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => {
            onClose(); // 延遲移除元件
        }, 300); // 與 CSS 動畫時間同步
    };

    if (!open && !visible) return null;

    return (
        <div className={`register-modal-overlay ${visible ? 'fade-in' : 'fade-out'}`}>
            <div className="register-modal-box">
                <h2>註冊帳號</h2>
                <input
                    type="text"
                    placeholder="使用者名稱"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="電子郵件"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="密碼"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button onClick={handleRegister} disabled={loading}>
                    {loading ? '註冊中...' : '註冊'}
                </button>
                <button onClick={handleClose}>取消</button>
            </div>
        </div>
    );
}
