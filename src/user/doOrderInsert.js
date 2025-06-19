import Qs from 'qs';
import Request from '../shared/Request.js';
import loginPage from '../pages/HomePage.jsx';

export default function _doOrderInsert(data, onSuccess) {
    const requiredFields = ['username', 'titles', 'contact', 'content', 'budget', 'deadline', 'style', 'usages', 'payment_method', 'region'];
    const missing = requiredFields.filter(field => !data[field]);

    if (missing.length > 0) {
        alert("請完整填寫所有欄位（備註可留空）");
        return;
    }

    Request().post("/index.php?action=newOrder", Qs.stringify(data))
        .then(res => {
            const response = res.data;
            if (response.token) localStorage.setItem("jwtToken", response.token);

            switch (response.status) {
                case 200:
                    alert(response.message);
                    console.log("新增成功，呼叫 onSuccess");
                    if (onSuccess) onSuccess(response);
                    break;
                case 401:
                    loginPage();
                    break;
                case 403:
                    alert("❌ 您已被列入黑名單，無法進行委託");
                    break;
                default:
                    alert("⚠️ " + (response.message || "未知錯誤"));
                    break;
            }
        })
        .catch(err => alert("發生錯誤：" + err));
}
