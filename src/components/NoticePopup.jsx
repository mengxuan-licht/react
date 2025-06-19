import React from 'react';

export default function NoticePopup({ visible, onClose }) {
  if (!visible) return null;

  return (
    <div id="notice-popup">
      <div className="notice-overlay" onClick={onClose}></div>
      <div className="notice-popup-box animate-popup">
        <div className="notice-content">
          <h2 className="popup-title">— 委託須知與條款 —</h2>

          <div className="popup-section">
            <h3>|| 不接受範圍：</h3>
            <ul>
              <li>✕ 夢向、R18、日系畫風</li>
            </ul>
          </div>

          <div className="popup-section">
            <h3>|| 一般條款</h3>
            <ul>
              <li>僅供個人使用，如需商業用途請參閱「使用權限」</li>
              <li>委託時請盡可能詳細描述你的需求</li>
              <li>禁止用於 NFT 或 AI 訓練</li>
              <li>有權拒絕任何委託，禁止自行修改作品，可請求調整</li>
            </ul>
          </div>

          <div className="popup-section">
            <h3>|| 使用權限</h3>
            <ul>
              <li><strong>個人用途：</strong>可作為社群頭貼、封面、分享展示。</li>
              <li>
                <strong>商業用途：</strong>如用於商品、宣傳、平台素材（YouTube、Twitch 等），
                將視為商業用途，需加收 100%～200%。
              </li>
            </ul>
          </div>

          <div className="popup-section">
            <h3>|| 付款資訊</h3>
            <ul>
              <li>接受 PayPal 與 ATM 匯款</li>
              <li>須於開始前完成付款</li>
              <li>可分期：50%（草圖）＋ 50%（完稿）</li>
              <li>恕不接受退款</li>
            </ul>
          </div>

          <div className="popup-section">
            <h3>|| 署名與浮水印</h3>
            <ul>
              <li>個人用途作品會加浮水印</li>
              <li>未特別說明者，將公開展示，客戶可自由分享成品</li>
            </ul>
          </div>

          <div className="popup-section">
            <h3>|| 重要聲明</h3>
            <ul>
              <li>委託即表示您已同意所有條款</li>
              <li>若違反用途（如商用、AI 訓練等），將保留法律追訴權</li>
            </ul>
          </div>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <button className="confirm-btn" onClick={onClose}>我了解了</button>
          </div>
        </div>
      </div>
    </div>

  );
}
