import React, { useEffect, useState } from 'react';
import Request from '../shared/Request.js';

export default function ViewOrderDetail({ orderId, fromPage = 'info', onBack }) {
    const [order, setOrder] = useState(null);

    useEffect(() => {
        Request().get(`/index.php?action=getOrders&id=${orderId}`)
            .then(res => {
                if (res.data.result && res.data.result.length > 0) {
                    setOrder(res.data.result[0]);
                } else {
                    alert("❌ 查無資料");
                }
            });
    }, [orderId]);

    if (!order) return <div>讀取中...</div>;

    return (
        <div>
            <h2>查看委託資料</h2>
            <div className="form-wrapper">
                <FormField label="委託人姓名" value={order.username} />
                <FormField label="委託標題" value={order.titles} />
                <FormField label="聯絡方式" value={order.contact} />
                <FormTextarea label="委託內容" value={order.content} />
                <FormSelect label="風格" value={order.style} />
                <FormField label="預算" value={order.budget} />
                <FormField label="截止日期" value={order.deadline} type="date" />
                <FormSelect label="用途" value={order.usages} />
                <FormField label="狀態" value={order.fettle} />
                <FormField label="付款狀態" value={order.pay_status} />
                <FormSelect label="付款方式" value={order.payment_method} />
                <FormField label="地區" value={order.region} />
                <FormField label="日期" value={order.date} />
                <FormTextarea label="備註" value={order.note} />
                <FormField label="排程開始日" value={order.start_date || '尚未安排'} />

                <div className="form-actions">
                    <button className="back-btn" onClick={onBack || (() => window.history.back())}>返回列表</button>
                </div>
            </div>
        </div>
    );
}

function FormField({ label, value, type = 'text' }) {
    return (
        <div className="form-group">
            <div className="label-col">{label}</div>
            <div className="input-col">
                <input type={type} value={value || ''} disabled />
            </div>
        </div>
    );
}

function FormTextarea({ label, value }) {
    return (
        <div className="form-group">
            <div className="label-col">{label}</div>
            <div className="input-col">
                <textarea value={value || ''} disabled />
            </div>
        </div>
    );
}

function FormSelect({ label, value }) {
    return (
        <div className="form-group">
            <div className="label-col">{label}</div>
            <div className="input-col">
                <select disabled>
                    <option>{value || ''}</option>
                </select>
            </div>
        </div>
    );
}
