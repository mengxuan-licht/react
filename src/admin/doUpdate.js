import Request from '../shared/Request.js';
import Qs from 'qs';
import loginPage from '../pages/HomePage.jsx';

export default function doUpdate(data) {
    if (!data.id || !data.username || !data.contact) {
        return Promise.reject(new Error("請填寫必要欄位（編號、姓名、聯絡方式）"));
    }

    return Request()
        .post("/index.php?action=updateOrder", Qs.stringify(data))
        .then(res => {
            const response = res.data;
            if (response.token && window.localStorage) {
                localStorage.setItem("jwtToken", response.token);
            }

            switch (parseInt(response.status)) {
                case 200:
                    return response;
                case 401:
                    loginPage();
                    return Promise.reject(new Error("未授權"));
                case 403:
                    return Promise.reject(new Error("權限不足"));
                default:
                    return Promise.reject(new Error(response.message || "未知錯誤"));
            }
        });
}
