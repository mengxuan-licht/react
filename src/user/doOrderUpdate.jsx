import Qs from 'qs';
import Request from '../shared/Request.js';
import loginPage from '../pages/HomePage.jsx';

export default function doOrderUpdate(id, formData, onSuccess) {
    const data = {
        id,
        titles: formData.titles,
        contact: formData.contact,
        content: formData.content,  // 這裡要用 content，非 contentText
        style: formData.style,
        budget: formData.budget,
        deadline: formData.deadline,
        usages: formData.usages,
        fettle: "未讀",
        pay_status: "未付款",
        payment_method: formData.payment_method,
        region: formData.region,
        note: formData.note
    };

    const requiredFields = ['titles', 'contact', 'content', 'budget', 'deadline', 'style', 'usages', 'payment_method', 'region'];
    const missing = requiredFields.filter(field => !data[field]);

    if (missing.length > 0) {
        alert("請完整填寫所有欄位（備註可留空）");
        return;
    }

    Request().post("/index.php?action=updateOrder", Qs.stringify(data))
        .then(res => {
            const response = res.data;

            if (response.token && window.localStorage) {
                localStorage.setItem("jwtToken", response.token);
            }

            switch (response.status) {
                case 200:
                    alert("✅ 修改成功！");
                    if (onSuccess) {
                        onSuccess();
                    } else {
                        window.location.reload();
                    }
                    break;

                case 401:
                    loginPage();
                    break;

                case 403:
                    alert("❌ 權限不足\n" + (response.message || ""));
                    break;

                default:
                    alert("⚠️ 未知錯誤：\n" + (response.message || ""));
                    break;
            }
        })
        .catch(err => {
            console.error(err);
            alert("❌ 系統錯誤：" + err);
        });
}
