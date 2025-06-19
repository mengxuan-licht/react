import React, { useState, useEffect } from 'react';
import Request from '../shared/Request.js';
import doOrderInsert from './doOrderInsert.js';
import doOrderUpdate from './doOrderUpdate.jsx';

const styleOptions = ["厚塗插畫", "平塗插畫", "像素人物", "AE動畫", "其他"];
const usagesOptions = ["自用", "商用", "買斷"];
const paymentMethodOptions = ["匯款", "ATM", "信用卡", "PayPal", "其他"];
const regionOptions = ["台灣", "海外"];

export default function ShowOrderForm({ orderId = null, onBack }) {
    const isEdit = orderId !== null;

    const [formData, setFormData] = useState({
        username: localStorage.getItem("username") || '',
        titles: '',
        contact: '',
        content: '', // 注意是 content，不是 contentText
        style: '厚塗插畫',
        budget: '',
        deadline: '',
        usages: '自用',
        payment_method: '匯款',
        region: '台灣',
        note: '',
    });

    const [isBlacklisted, setIsBlacklisted] = useState(false);
    const [disabledFields, setDisabledFields] = useState(false);

    useEffect(() => {
        setIsBlacklisted(localStorage.getItem("is_blacklisted") === "1");

        if (isEdit) {
            Request()
                .get(`/index.php?action=getOrders&id=${orderId}`)
                .then(res => {
                    const order = res.data.result?.[0];
                    if (!order) return;

                    setFormData({
                        titles: order.titles || '',
                        contact: order.contact || '',
                        content: order.content || '', // 正確取用 content 欄位
                        style: order.style || '厚塗插畫',
                        budget: order.budget || '',
                        deadline: order.deadline || '',
                        usages: order.usages || '自用',
                        payment_method: order.payment_method || '匯款',
                        region: order.region || '台灣',
                        note: order.note || '',
                    });

                    const isAdmin = localStorage.getItem("role") === "admin";
                    const fettle = (order.fettle || '').trim();

                    // 非 admin 且狀態非「未讀」禁止修改欄位
                    if (!isAdmin && fettle !== "未讀") {
                        setDisabledFields(true);
                    }
                });
        }
    }, [isEdit, orderId]);

    if (!isEdit && isBlacklisted) {
        return <p>⚠️ 您目前為黑名單用戶，無法填寫委託表單。</p>;
    }

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = () => {
        if (isEdit) {
            doOrderUpdate(orderId, formData, onBack);
        } else {
            doOrderInsert(formData, onBack);
        }
    };

    return (
        <div>
            <h2>{isEdit ? '修改' : '填寫'}委託表單</h2>
            <div className="form-wrapper">
                <FormField label="委託標題" id="titles" value={formData.titles} onChange={handleChange} disabled={disabledFields} />
                <FormField label="聯絡方式" id="contact" value={formData.contact} onChange={handleChange} disabled={disabledFields} />
                <FormTextarea label="委託內容" id="content" value={formData.content} onChange={handleChange} disabled={disabledFields} />
                <FormSelect label="風格" id="style" options={styleOptions} value={formData.style} onChange={handleChange} disabled={disabledFields} />
                <FormField label="預算" id="budget" value={formData.budget} onChange={handleChange} disabled={disabledFields} />
                <FormField label="截止日期" id="deadline" type="date" value={formData.deadline} onChange={handleChange} disabled={disabledFields} />
                <FormSelect label="用途" id="usages" options={usagesOptions} value={formData.usages} onChange={handleChange} disabled={disabledFields} />
                <FormSelect label="付款方式" id="payment_method" options={paymentMethodOptions} value={formData.payment_method} onChange={handleChange} disabled={disabledFields} />
                <FormSelect label="地區" id="region" options={regionOptions} value={formData.region} onChange={handleChange} disabled={disabledFields} />
                <FormTextarea label="備註" id="note" value={formData.note} onChange={handleChange} disabled={disabledFields} />

                <div className="form-actions">
                    <button className="custom-btn" onClick={handleSubmit} disabled={disabledFields}>
                        {isEdit ? '確認修改' : '送出委託'}
                    </button>
                    <button className="custom-btn" onClick={onBack}>返回列表</button>
                </div>
            </div>
        </div>
    );
}

function FormField({ label, id, value, onChange, disabled, type = 'text' }) {
    return (
        <div className="form-group">
            <div className="label-col">{label}</div>
            <div className="input-col">
                <input id={id} type={type} value={value} onChange={onChange} disabled={disabled} />
            </div>
        </div>
    );
}

function FormTextarea({ label, id, value, onChange, disabled }) {
    return (
        <div className="form-group">
            <div className="label-col">{label}</div>
            <div className="input-col">
                <textarea id={id} value={value} onChange={onChange} disabled={disabled} />
            </div>
        </div>
    );
}

function FormSelect({ label, id, options, value, onChange, disabled }) {
    return (
        <div className="form-group">
            <div className="label-col">{label}</div>
            <div className="input-col">
                <select id={id} value={value} onChange={onChange} disabled={disabled}>
                    {options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
