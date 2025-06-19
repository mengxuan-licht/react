import React, { useState } from 'react';
import Qs from 'qs';

const styleOptions = ["厚塗插畫", "平塗插畫", "像素人物", "AE動畫", "其他"];
const usagesOptions = ["自用", "商用", "買斷"];
const fettleOptions = ["未讀", "已讀", "溝通中", "報價", "合約", "訂金（已收30%）", "草圖階段", "確認草圖中", "工作階段中", "確認進度（收50%）", "最後階段（80%進度）", "完稿交付", "棄單（聯絡不上）"];
const payStatusOptions = ["未付款", "已退款", "訂金（已收30%）", "進度款（已收80%）", "付款完成"];
const paymentMethodOptions = ["匯款", "ATM", "信用卡", "PayPal", "其他"];
const regionOptions = ["台灣", "海外"];

export default function ShowInsertPage({ onBack }) {
    const [formData, setFormData] = useState({
        username: '',
        titles: '',
        contact: '',
        contentText: '',
        style: styleOptions[0],
        budget: '',
        deadline: '',
        usages: usagesOptions[0],
        fettle: fettleOptions[0],
        pay_status: payStatusOptions[0],
        payment_method: paymentMethodOptions[0],
        region: regionOptions[0],
        note: '',
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const doInsert = () => {
        if (!formData.username || !formData.contact) {
            alert("請填寫必填欄位（姓名與聯絡方式）");
            return;
        }

        import('../shared/Request.js').then(({ default: Request }) => {
            // 轉換 contentText -> content
            const postData = {
                ...formData,
                content: formData.contentText,
            };
            delete postData.contentText;

            Request()
                .post("/index.php?action=newOrder", Qs.stringify(postData))
                .then(res => {
                    const response = res.data;
                    if (response.status === 200) {
                        alert("新增成功");
                        if (onBack) onBack();
                    } else {
                        alert(response.message || "新增失敗");
                    }
                })
                .catch(() => alert("系統錯誤，請稍後再試"));
        });
    };

    return (
        <div>
            <h2>新增委託資料</h2>
            <div className="form-wrapper">
                <FormField label="委託人姓名" id="username" value={formData.username} onChange={handleChange} />
                <FormField label="委託標題" id="titles" value={formData.titles} onChange={handleChange} />
                <FormField label="聯絡方式" id="contact" value={formData.contact} onChange={handleChange} />
                <FormTextarea label="委託內容" id="contentText" value={formData.contentText} onChange={handleChange} />
                <FormSelect label="風格" id="style" options={styleOptions} value={formData.style} onChange={handleChange} />
                <FormField label="預算" id="budget" value={formData.budget} onChange={handleChange} />
                <FormField label="截止日期" id="deadline" type="date" value={formData.deadline} onChange={handleChange} />
                <FormSelect label="用途" id="usages" options={usagesOptions} value={formData.usages} onChange={handleChange} />
                <FormSelect label="狀態" id="fettle" options={fettleOptions} value={formData.fettle} onChange={handleChange} />
                <FormSelect label="付款狀態" id="pay_status" options={payStatusOptions} value={formData.pay_status} onChange={handleChange} />
                <FormSelect label="付款方式" id="payment_method" options={paymentMethodOptions} value={formData.payment_method} onChange={handleChange} />
                <FormSelect label="地區" id="region" options={regionOptions} value={formData.region} onChange={handleChange} />
                <FormTextarea label="備註" id="note" value={formData.note} onChange={handleChange} />

                <div className="form-actions">
                    <button onClick={doInsert} className="custom-btn">新增</button>
                    <button onClick={onBack} className="custom-btn">返回列表</button>
                </div>
            </div>
        </div>
    );
}

function FormField({ label, id, type = "text", value, onChange }) {
    return (
        <div className="form-group">
            <div className="label-col">{label}</div>
            <div className="input-col"><input id={id} type={type} value={value} onChange={onChange} /></div>
        </div>
    );
}

function FormTextarea({ label, id, value, onChange }) {
    return (
        <div className="form-group">
            <div className="label-col">{label}</div>
            <div className="input-col"><textarea id={id} value={value} onChange={onChange} /></div>
        </div>
    );
}

function FormSelect({ label, id, options, value, onChange }) {
    return (
        <div className="form-group">
            <div className="label-col">{label}</div>
            <div className="input-col">
                <select id={id} value={value} onChange={onChange}>
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>
        </div>
    );
}
