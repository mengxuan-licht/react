import React, { useState, useEffect } from 'react';
import Request from '../shared/Request.js';
import loginPage from '../pages/HomePage.jsx';
import ViewOrderConfirm from './ViewOrderConfirm.jsx';

export default function ConfirmOrdersInfo() {
    const [orders, setOrders] = useState([]);
    const [viewingOrderId, setViewingOrderId] = useState(null);
    const [filterYM, setFilterYM] = useState('');
    const [ymList, setYmList] = useState([]);

    useEffect(() => {
        Request().get(`/index.php?action=getOrders&_=${Date.now()}`)
            .then(res => {
                const response = res.data;
                if (response.token && window.localStorage) {
                    localStorage.setItem("jwtToken", response.token);
                    if (response.role) localStorage.setItem("role", response.role);
                }

                if (response.status === 401) {
                    loginPage();
                    return;
                }
                if (response.status === 403) {
                    setOrders(null);
                    return;
                }
                if (response.status !== 200) {
                    setOrders(null);
                    return;
                }

                const allRows = response.result || [];
                // 產生年月選單
                const dateSet = new Set();
                allRows.forEach(row => {
                    if (row.date) {
                        dateSet.add(row.date.slice(0, 7));
                    }
                });
                const ymArray = Array.from(dateSet).sort().reverse();
                setYmList(ymArray);

                // 預設選擇當月或第一筆
                const todayYM = new Date().toISOString().slice(0, 7);
                setFilterYM(ymArray.includes(todayYM) ? todayYM : ymArray[0] || '');

                setOrders(allRows);
            })
            .catch(err => {
                console.error('發生錯誤：', err);
                setOrders(null);
            });
    }, []);

    // 如果目前有選中的訂單 ID，顯示詳細頁
    if (viewingOrderId !== null) {
        return (
            <ViewOrderConfirm
                orderId={viewingOrderId}
                onBack={() => setViewingOrderId(null)}
            />
        );
    }

    if (orders === null) {
        return <div className="alert-message alert-error">無法載入資料或權限不足</div>;
    }

    if (!orders.length) {
        return <div>載入中或無訂單資料...</div>;
    }

    const filteredOrders = orders.filter(r => r.date?.startsWith(filterYM));

    return (
        <div>
            <label htmlFor="ymFilter"><h2>年月篩選：</h2></label>
            <select
                id="ymFilter"
                value={filterYM}
                onChange={(e) => setFilterYM(e.target.value)}
            >
                {ymList.map(ym => (
                    <option key={ym} value={ym}>{ym}</option>
                ))}
            </select>

            <br /><br />

            <table className="custom-table">
                <thead>
                    <tr>
                        <th>編號</th>
                        <th>委託人姓名</th>
                        <th className="hide-on-tablet">委託標題</th>
                        <th>聯絡方式</th>
                        <th className="hide-on-tablet">委託內容</th>
                        <th className="hide-on-tablet">風格</th>
                        <th className="hide-on-tablet">預算</th>
                        <th className="hide-on-tablet">截止日期</th>
                        <th className="hide-on-tablet">用途</th>
                        <th className="hide-on-tablet">狀態</th>
                        <th className="hide-on-tablet">付款狀態</th>
                        <th className="hide-on-tablet">付款方式</th>
                        <th className="hide-on-tablet">地區</th>
                        <th className="hide-on-tablet">註記</th>
                        <th className="hide-on-tablet">日期</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((element, index) => {
                        const isUnread = element.fettle === '未讀';
                        return (
                            <tr key={element.id} className={isUnread ? "unread-row" : ""}>
                                <td data-title="編號">{index + 1}</td>
                                <td data-title="委託人姓名">{element.username || ''}</td>
                                <td data-title="委託標題">{element.titles || ''}</td>
                                <td data-title="聯絡方式">{element.contact || ''}</td>
                                <td className="hide-on-tablet" data-title="委託內容">{element.content || ''}</td>
                                <td className="hide-on-tablet" data-title="風格">{element.style || ''}</td>
                                <td className="hide-on-tablet" data-title="預算">{element.budget || ''}</td>
                                <td className="hide-on-tablet" data-title="截止日期">{element.deadline || ''}</td>
                                <td className="hide-on-tablet" data-title="用途">{element.usages || ''}</td>
                                <td className="hide-on-tablet" data-title="狀態">{element.fettle || ''}</td>
                                <td className="hide-on-tablet" data-title="付款狀態">{element.pay_status || ''}</td>
                                <td className="hide-on-tablet" data-title="付款方式">{element.payment_method || ''}</td>
                                <td className="hide-on-tablet" data-title="地區">{element.region || ''}</td>
                                <td className="hide-on-tablet" data-title="註記">{element.note || ''}</td>
                                <td className="hide-on-tablet" data-title="日期">{element.date || ''}</td>
                                <td>
                                    <button
                                        className="confirm-btn"
                                        onClick={() => setViewingOrderId(element.id)}
                                    >
                                        查看
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
