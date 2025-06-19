import React, { useEffect, useState } from 'react';
import Request from '../shared/Request.js';
import loginPage from '../pages/HomePage.jsx';

export default function ViewSchedule() {
    const [scheduledRows, setScheduledRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        Request().get(`/index.php?action=getOrders&_=${Date.now()}`)
            .then(res => {
                const response = res.data;

                if (response.token && window.localStorage) {
                    localStorage.setItem("jwtToken", response.token);
                    if (response.role) {
                        localStorage.setItem("role", response.role);
                    }
                }

                switch (response.status) {
                    case 200:
                        const rows = response.result || [];
                        const filtered = rows
                            .filter(row => row.start_date)
                            .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
                        setScheduledRows(filtered);
                        setErrorMsg('');
                        break;

                    case 401:
                        loginPage();
                        break;

                    case 403:
                        setErrorMsg('❌ 權限不足');
                        break;

                    default:
                        setErrorMsg(response.message || '無法載入資料');
                        break;
                }
            })
            .catch(err => {
                setErrorMsg('發生錯誤：' + err.message || err);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>載入中...</p>;

    return (
        <div>
            <h3>客戶排程行事曆</h3>
            {errorMsg && <div className="alert-message alert-error">{errorMsg}</div>}
            {!errorMsg && scheduledRows.length === 0 && <p>⚠️ 目前尚無排程資料</p>}
            {!errorMsg && scheduledRows.length > 0 && (
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>委託人</th>
                            <th>聯絡方式</th>
                            <th>排程日期</th>
                            <th>狀態</th>
                            <th>備註</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scheduledRows.map(item => (
                            <tr key={item.id}>
                                <td>{item.username || ''}</td>
                                <td>{item.contact || ''}</td>
                                <td>{item.start_date}</td>
                                <td>{item.fettle}</td>
                                <td>{item.note || ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
