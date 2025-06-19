import React, { useEffect, useState } from 'react';
import Qs from 'qs';
import Request from '../shared/Request.js';
import ScheduleOrder from './ScheduleOrder.jsx'; // React 元件，非普通函式

export default function ViewOrderConfirm({ orderId, onBack }) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSchedule, setShowSchedule] = useState(false); // 新增狀態控制排程表單

    useEffect(() => {
        if (!orderId) return;

        Request().get(`/index.php?action=getOrders&id=${orderId}`)
            .then(res => {
                const data = res.data.result?.[0];
                if (!data) {
                    alert('❌ 查無資料');
                    return;
                }
                setOrder(data);
            })
            .catch(err => {
                alert('❌ 發生錯誤：' + err);
            })
            .finally(() => setLoading(false));
    }, [orderId]);

    const handleConfirmRead = () => {
        Request().post('/index.php?action=markAsRead', Qs.stringify({ id: order.id }))
            .then(res => {
                const r = res.data;
                if (r.token) localStorage.setItem('jwtToken', r.token);
                if (r.status === 200) {
                    alert('✅ 訂單已標記為已讀');
                    // 重新載入資料
                    setLoading(true);
                    Request().get(`/index.php?action=getOrders&id=${orderId}`).then(res => {
                        setOrder(res.data.result?.[0]);
                        setLoading(false);
                    });
                } else {
                    alert('❌ ' + (r.message || '標記失敗'));
                }
            })
            .catch(err => alert('❌ 系統錯誤：' + err));
    };

    const handleGoSchedule = () => {
        setShowSchedule(true);
    };

    const handleScheduleCancel = () => {
        setShowSchedule(false);
    };

    const handleScheduleConfirm = () => {
        alert('安排排程完成，建議這裡刷新訂單資料');
        setShowSchedule(false);
        onBack()
    };

    if (loading) return <p>讀取中...</p>;
    if (!order) return <p>查無資料</p>;

    const fettle = (order.fettle || '').trim();
    const start_date = order.start_date || '';

    // 如果正在排程，顯示 ScheduleOrder 組件
    if (showSchedule) {
        return (
            <ScheduleOrder
                orderId={order.id}
                onCancel={handleScheduleCancel}
                onConfirm={handleScheduleConfirm}
            />
        );
    }

    return (
        <div className="form-wrapper">
            {/* 這裡依然顯示訂單內容 */}
            <FormField label="委託編號" value={order.id} readOnly />
            <FormField label="委託人姓名" value={order.username} readOnly />
            <FormField label="委託標題" value={order.titles} readOnly />
            <FormField label="聯絡方式" value={order.contact} readOnly />
            <FormTextarea label="委託內容" value={order.content} readOnly />
            <FormField label="風格" value={order.style} readOnly />
            <FormField label="預算" value={order.budget} readOnly />
            <FormField label="截止日期" value={order.deadline} readOnly />
            <FormField label="用途" value={order.usages} readOnly />
            <FormField label="狀態" value={fettle} readOnly />
            <FormField label="付款狀態" value={order.pay_status} readOnly />
            <FormField label="付款方式" value={order.payment_method} readOnly />
            <FormField label="地區" value={order.region} readOnly />
            <FormField label="日期" value={order.date} readOnly />
            <FormTextarea label="備註" value={order.note} readOnly />
            {start_date && <FormField label="排程開始日" value={start_date} readOnly />}

            <div className="form-actions form-actions-row">
                {fettle === '未讀' && (
                    <button id="confirmRead" className="confirm-btn" onClick={handleConfirmRead}>
                        確認已讀
                    </button>
                )}
                {fettle === '已讀' && !start_date && (
                    <button id="goSchedule" className="confirm-btn" onClick={handleGoSchedule}>
                        安排排程
                    </button>
                )}
                <button id="backToList" className="back-btn" onClick={onBack}>
                    返回列表
                </button>
            </div>
        </div>
    );
}

function FormField({ label, value, readOnly }) {
    return (
        <div className="form-group">
            <div className="label-col">{label}</div>
            <div className="input-col">
                <input type="text" value={value || ''} readOnly={readOnly} />
            </div>
        </div>
    );
}

function FormTextarea({ label, value, readOnly }) {
    return (
        <div className="form-group">
            <div className="label-col">{label}</div>
            <div className="input-col">
                <textarea value={value || ''} readOnly={readOnly} />
            </div>
        </div>
    );
}
