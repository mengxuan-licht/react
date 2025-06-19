import Request from './Request.js';
import loginPage from './loginPage.js';

export default function doSelect() {
    Request().get("/index.php?action=getUsers")
        .then(res => {
            const response = res.data;

            // 若有新 token，寫入 localStorage
            if (response.token && window.localStorage) {
                localStorage.setItem("jwtToken", response.token);
            }

            switch (response.status) {
                case 200:
                    const rows = response.result;
                    let str = '<table class="custom-table">';

                    // 表頭
                    str += '<thead><tr>';
                    str += '<th>委託編號</th>';
                    str += '<th>委託人姓名</th>';
                    str += '<th>委託標題</th>';
                    str += '<th>聯絡方式</th>';
                    str += '<th>委託內容</th>';
                    str += '<th>風格</th>';
                    str += '<th>預算</th>';
                    str += '<th>截止日期</th>';
                    str += '<th>用途</th>';
                    str += '<th>狀態</th>';
                    str += '<th>付款狀態</th>';
                    str += '<th>付款方式</th>';
                    str += '<th>地區</th>';
                    str += '<th>註記</th>';
                    str += '<th>日期</th>';
                    str += '</tr></thead><tbody>';

                    rows.forEach(element => {
                        str += "<tr>";
                        str += `<td>${element.id}</td>`;
                        str += `<td>${element.username || ''}</td>`;
                        str += `<td>${element.titles || ''}</td>`;
                        str += `<td>${element.contact || ''}</td>`;
                        str += `<td>${element.content || ''}</td>`;
                        str += `<td>${element.style || ''}</td>`;
                        str += `<td>${element.budget || ''}</td>`;
                        str += `<td>${element.deadline || ''}</td>`;
                        str += `<td>${element.usages || ''}</td>`;
                        str += `<td>${element.fettle || ''}</td>`;
                        str += `<td>${element.pay_status || ''}</td>`;
                        str += `<td>${element.payment_method || ''}</td>`;
                        str += `<td>${element.region || ''}</td>`;
                        str += `<td>${element.note || ''}</td>`;
                        str += `<td>${element.date || ''}</td>`;
                        str += "</tr>";
                    });

                    str += '</tbody></table>';
                    document.getElementById("content").innerHTML = str;
                    break;

                case 401:
                    loginPage();  // token 無效，自動跳登入頁
                    break;

                case 403:
                    alert("❌ 權限不足");
                    break;

                default:
                    document.getElementById("content").innerHTML =
                        `<div class="alert-message alert-error">${response.message}</div>`;
                    break;
            }
        })
        .catch(err => {
            document.getElementById("content").innerHTML =
                `<div class="alert-message alert-error">❌ 發生錯誤：${err}</div>`;
        });
}
