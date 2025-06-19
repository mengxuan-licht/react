import React, { useState, useEffect } from 'react';
import Request from '../shared/Request.js';
import loginPage from '../pages/HomePage.jsx'
const ViewOrderDetail = React.lazy(() => import('./ViewOrderDetail'));

export default function OrdersList() {
    const defaultStart = '2024-12-17';
    const defaultEnd = '2025-06-15';

    const [startDate, setStartDate] = useState(defaultStart);
    const [endDate, setEndDate] = useState(defaultEnd);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        loadOrders(defaultStart, defaultEnd);
    }, []);

    function loadOrders(start, end) {
        setLoading(true);
        setError(null);

        Request().get(`/index.php?action=getOrders&_=${Date.now()}`)
            .then(res => {
                const response = res.data;
                if (response.token && window.localStorage) {
                    localStorage.setItem("jwtToken", response.token);
                    if (response.role) localStorage.setItem("role", response.role);
                }
                if (response.status === 200) {
                    const filtered = response.result.filter(order => {
                        if (!order.date) return true;
                        const date = new Date(order.date).toISOString().split('T')[0];
                        const inRange = (!start || date >= start) && (!end || date <= end);
                        const hasSchedule = order.start_date && order.start_date.trim() !== '';
                        return inRange || hasSchedule;
                    });
                    setOrders(filtered);
                } else if (response.status === 401) {
                    setError('請重新登入');
                } else {
                    setError(response.message || '無法載入資料');
                }
            })
            .catch(err => setError('發生錯誤：' + err.message))
            .finally(() => setLoading(false));
    }

    if (selectedOrderId) {
        return (
            <React.Suspense fallback={<div>讀取中...</div>}>
                <ViewOrderDetail
                    orderId={selectedOrderId}
                    fromPage="list"
                    onBack={() => setSelectedOrderId(null)}
                />
            </React.Suspense>
        );
    }

    return (
        <div className="orders-list-wrapper">
            <div className="orders-filter-bar">
                <label>查詢區間：</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                <span> - </span>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                <button className="custom-btn" onClick={() => loadOrders(startDate, endDate)}>查詢</button>
            </div>

            {loading && <p>讀取中...</p>}
            {error && <div className="alert-message alert-error">{error}</div>}

            <div className="orders-card-container">
                {orders.map(order => {
                    const fettle = order.fettle?.trim() || '未讀';
                    const date = order.date ? new Date(order.date).toISOString().split('T')[0] : '';
                    return (
                        <div className="order-card" key={order.id}>
                            <div className="order-header">
                                <div className="order-date">{date}</div>
                                <div className={`order-fettle fettle-tag fettle-${fettle}`}>{fettle}</div>
                            </div>
                            <div className="order-title">{order.titles || '（未命名）'}</div>
                            <div className="order-divider"></div>
                            <div className="order-detail-btn" onClick={() => setSelectedOrderId(order.id)}>訂單詳細資訊</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
