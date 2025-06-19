import React, { useState } from 'react';
import Request from '../shared/Request.js';

export default function ScheduleOrder({ orderId, onCancel, onConfirm }) {
  const [startDate, setStartDate] = useState('');

  const handleConfirm = () => {
    if (!startDate) {
      alert("請選擇開始日期");
      return;
    }

    Request().post('/index.php?action=confirmOrderSchedule', new URLSearchParams({
      id: orderId,
      start_date: startDate,
    }).toString())
    .then(res => {
      const response = res.data;
      if (response.token && window.localStorage) {
        localStorage.setItem("jwtToken", response.token);
      }
      if (response.status === 200) {
        alert("✅ 排程成功！");
        if (onConfirm) onConfirm();
      } else {
        alert("❌ 排程失敗：" + (response.message || "未知錯誤"));
      }
    });
  };

  return (
    <div className="form-container">
      <h2>設定排程</h2>
      <label>開始日期：</label>
      <input
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
      />
      <div className="schedule-actions">
        <button className="custom-btn" onClick={handleConfirm}>確認安排</button>
        <button className="custom-btn" onClick={onCancel}>取消</button>
      </div>
    </div>
  );
}
