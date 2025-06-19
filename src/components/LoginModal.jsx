import React, { useState, useEffect } from 'react';
import Request from '../shared/Request';
import qs from 'qs';
import '../style/login.css';

export default function LoginModal({ open, onClose, onLoginSuccess, onSwitchToRegister }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) setVisible(true);
  }, [open]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // 與 CSS 動畫時間一致
  };

  const handleLogin = () => {
    setLoading(true);
    Request().post('/index.php?action=doLogin', qs.stringify({ name, password }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then(resp => {
        const response = resp.data;
        setLoading(false);
        if (response.status === 200) {
          localStorage.setItem('jwtToken', response.token);
          const payload = JSON.parse(atob(response.token.split('.')[1]));
          localStorage.setItem('username', payload.data.name);
          localStorage.setItem('role', payload.data.role); 
          localStorage.setItem('is_blacklisted', response.is_blacklist);
          onLoginSuccess();
          handleClose(); // 淡出再關閉
        } else {
          alert(response.message || '帳號或密碼錯誤');
        }
      })
      .catch(err => {
        setLoading(false);
        alert('登入過程中發生錯誤，請稍後再試');
        console.error(err);
      });
  };

  if (!open && !visible) return null;

  return (
    <div className={`login-modal-overlay ${visible ? 'fade-in' : 'fade-out'}`}>
      <div className="login-modal-box">
        <h2>登入</h2>
        <input
          type="text"
          placeholder="使用者名稱"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="密碼"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} disabled={loading}>
          {loading ? '登入中...' : '登入'}
        </button>
        <button onClick={onSwitchToRegister}>註冊帳號</button>
        <button onClick={handleClose}>取消</button>
      </div>
    </div>
  );
}
