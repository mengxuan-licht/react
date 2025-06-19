export default function showPricePopup() {
  if (document.getElementById("price-popup")) return;
  console.log("💰 顯示價目表彈窗");

  const popup = document.createElement("div");
  popup.id = "price-popup";
  popup.innerHTML = `
    <div class="notice-overlay"></div>
    <div class="notice-popup-box animate-popup">
      <div class="notice-content">
        <h2 class="popup-title">— 價目表 —</h2>

        <h3 class="popup-section">|| 厚塗上色：</h3>
        <ul>
          <li>人頭像 - 塗鴉：起價 1800（不含背景）／2100（含背景）</li>
          <li>人頭像 - 精緻：起價 2200（不含背景）／2500（含背景）</li>
          <li>半身 - 塗鴉：起價 2500（不含背景）／3300（含背景）</li>
          <li>半身 - 精緻：起價 3300（不含背景）／3800（含背景）</li>
        </ul>
        <p style="font-size: 0.85rem; color: #bbb; margin-top: 5px;">*依討論內容與精緻度更改價錢。</p>

        <h3 class="popup-section">|| 平塗上色：</h3>
        <ul>
          <li>人頭像：750–950（不含背景）／1000–1200（含背景）</li>
          <li>半身：1200–1600（不含背景）／1800–2200（含背景）</li>
        </ul>

        <h3 class="popup-section">|| 加價項目：</h3>
        <ul>
          <li>可議價／指定風格 +$</li>
          <li>急件：平塗 +500 元／厚塗 +1000 元（依時限調整）</li>
          <li>依照元素項目追加費用</li>
        </ul>

        <div style="text-align: center; margin-top: 20px;">
          <button id="price-close" class="confirm-btn">我了解了</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  document.getElementById("price-close").onclick = () => {
    popup.classList.remove("animate-popup");
    popup.classList.add("animate-close");
    setTimeout(() => popup.remove(), 200);
  };
}
