import React, { useEffect, useState } from "react";
import Qs from "qs";
import Request from "../shared/Request.js";

export default function ShowUpdatePage({ id, onBack }) {
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    titles: "",
    contact: "",
    contentText: "",
    style: "厚塗插畫",
    budget: "",
    deadline: "",
    usages: "自用",
    fettle: "未讀",
    pay_status: "未付款",
    payment_method: "匯款",
    region: "台灣",
    date: "",
    note: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Request()
      .get(`/index.php?action=getOrders&id=${id}`)
      .then((res) => {
        const order = res.data.result?.[0];
        if (order) {
          setFormData({
            id: order.id || "",
            username: order.username || "",
            titles: order.titles || "",
            contact: order.contact || "",
            contentText: order.content || "",
            style: order.style || "厚塗插畫",
            budget: order.budget || "",
            deadline: order.deadline || "",
            usages: order.usages || "自用",
            fettle: order.fettle || "未讀",
            pay_status: order.pay_status || "未付款",
            payment_method: order.payment_method || "匯款",
            region: order.region || "台灣",
            date: order.date || "",
            note: order.note || "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    if (!formData.id || !formData.username || !formData.contact) {
      alert("請填寫必要欄位（編號、姓名、聯絡方式）");
      return;
    }

    // 組成後端期待的資料格式
    const postData = {
      ...formData,
      content: formData.contentText,
    };
    delete postData.contentText;

    Request()
      .post("/index.php?action=updateOrder", Qs.stringify(postData))
      .then((res) => {
        const response = res.data;
        if (response.token && window.localStorage) {
          localStorage.setItem("jwtToken", response.token);
        }

        switch (parseInt(response.status)) {
          case 200:
            alert("修改成功");
            if (onBack) onBack();
            break;
          case 401:
            alert("未授權，請重新登入");
            break;
          case 403:
            alert("權限不足");
            break;
          default:
            alert(response.message || "未知錯誤");
            break;
        }
      })
      .catch(() => alert("系統錯誤，請稍後再試"));
  };

  if (loading) return <p>讀取中...</p>;

  return (
    <div>
      <h2>修改委託表單</h2>
      <div className="form-wrapper">
        <FormField label="委託編號" id="id" value={formData.id} readOnly />
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
        <FormField label="建立日期" id="date" value={formData.date} readOnly />
        <FormTextarea label="備註" id="note" value={formData.note} onChange={handleChange} />
        <div className="form-actions">
          <button className="custom-btn" onClick={handleSubmit}>確認修改</button>
          <button className="custom-btn" onClick={onBack}>返回列表</button>
        </div>
      </div>
    </div>
  );
}

// 下方為共用的表單欄位元件，可跟 ShowInsertPage 共用
const styleOptions = ["厚塗插畫", "平塗插畫", "像素人物", "AE動畫", "其他"];
const usagesOptions = ["自用", "商用", "買斷"];
const fettleOptions = ["未讀", "已讀", "溝通中", "報價", "合約", "訂金（已收30%）", "草圖階段", "確認草圖中", "工作階段中", "確認進度（收50%）", "最後階段（80%進度）", "完稿交付", "棄單（聯絡不上）"];
const payStatusOptions = ["未付款", "已退款", "訂金（已收30%）", "進度款（已收80%）", "付款完成"];
const paymentMethodOptions = ["匯款", "ATM", "信用卡", "PayPal", "其他"];
const regionOptions = ["台灣", "海外"];

function FormField({ label, id, value, onChange, readOnly = false, type = "text" }) {
  return (
    <div className="form-group">
      <div className="label-col">{label}</div>
      <div className="input-col">
        <input id={id} type={type} value={value || ""} onChange={onChange} readOnly={readOnly} />
      </div>
    </div>
  );
}

function FormTextarea({ label, id, value, onChange, readOnly = false }) {
  return (
    <div className="form-group">
      <div className="label-col">{label}</div>
      <div className="input-col">
        <textarea id={id} value={value || ""} onChange={onChange} readOnly={readOnly} />
      </div>
    </div>
  );
}

function FormSelect({ label, id, options, value, onChange }) {
  return (
    <div className="form-group">
      <div className="label-col">{label}</div>
      <div className="input-col">
        <select id={id} value={value} onChange={onChange}>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
