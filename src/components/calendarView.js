import Request from "../shared/Request.js";

export default function calendarView() {
  if (document.getElementById("calendar-popup")) return;

  const popup = document.createElement("div");
  popup.id = "calendar-popup";
  popup.innerHTML = `
    <div class="calendar-overlay"></div>
    <div class="calendar-popup-box styled-calendar animate-popup">
      <div class="calendar-left">
        <div class="calendar-header">
          <span class="arrow" id="prev-month">&larr;</span>
          <h2 id="calendar-title">0000 年 0 月</h2>
          <span class="arrow" id="next-month">&rarr;</span>
        </div>
        <div class="calendar-grid">
          <div>Sun</div><div>Mon</div><div>Tue</div>
          <div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        <div class="calendar-grid days" id="calendar-days"></div>
      </div>
      <div class="calendar-right">
        <h3 class="events-title">EVENTS</h3>

        <button id="calendar-close" class="confirm-btn">Confirm</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById("calendar-close").onclick = () => {
    popup.classList.remove("animate-popup");
    popup.classList.add("animate-close");
    setTimeout(() => popup.remove(), 200);
  };

  let year = new Date().getFullYear();
  let month = new Date().getMonth(); // 0-based

  document.getElementById("prev-month").onclick = () => {
    if (month === 0) { year--; month = 11; }
    else month--;
    renderCalendar(year, month);
  };

  document.getElementById("next-month").onclick = () => {
    if (month === 11) { year++; month = 0; }
    else month++;
    renderCalendar(year, month);
  };

  renderCalendar(year, month);

  function renderCalendar(y, m) {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    document.getElementById("calendar-title").textContent = `${y} 年 ${m + 1} 月`;

    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    Request().get(`/index.php?action=getOrders&_=${Date.now()}`).then(res => {
      const rows = res.data.result || [];
      const dateSet = new Set(rows.map(r => r.start_date));

      let html = "";
      for (let i = 0; i < firstDay; i++) html += `<div></div>`;

      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isToday = dateStr === todayStr;
        const isScheduled = dateSet.has(dateStr);
        html += `<div class="${isScheduled ? 'scheduled' : ''} ${isToday ? 'today' : ''}">${d}</div>`;
      }

      document.getElementById("calendar-days").innerHTML = html;
    });
  }
}
