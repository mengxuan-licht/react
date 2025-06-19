import React, { useState } from 'react';
import Request from '../shared/Request.js';
import Qs from 'qs';

export default function CancelPopup({ orderId, onClose, onCancelSuccess }) {
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        if (!agree) {
            alert("請先勾選同意取消條款");
            return;
        }
        console.log('取消訂單ID:', orderId); 
        setLoading(true);

        Request()
            .post(
                '/index.php?action=cancelOrder',
                Qs.stringify({ id: orderId }),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            )
            .then(res => {
                const data = res.data;
                if (data.status === 200) {
                    alert(data.message || "取消成功");
                    if (onCancelSuccess) {
                        onCancelSuccess();  // 通知父元件重新整理訂單列表
                    }
                    onClose();
                } else {
                    alert(data.message || "取消失敗");
                }
            })
            .catch(err => {
                console.error(err);
                alert("系統錯誤，請稍後再試");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal">
                <h3>在 <span style={{ color: '#d33' }}>取消委託</span> 前請先確認下列事項：</h3>
                <p>
                    此操作將取消該筆委託，並記錄取消次數，超過3次將納入黑名單。<br />
                    確定要取消這筆委託嗎？
                </p>
                <label>
                    <input
                        type="checkbox"
                        checked={agree}
                        onChange={e => setAgree(e.target.checked)}
                        disabled={loading}
                    />
                    我已閱讀並同意取消後資料將無法復原。
                </label>
                <div className="modal-actions">
                    <button
                        className="back-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        返回
                    </button>
                    <button
                        className="confirm-btn"
                        onClick={handleCancel}
                        disabled={!agree || loading}
                    >
                        {loading ? "取消中..." : "確認取消"}
                    </button>
                </div>
            </div>
        </div>
    );
}
