import React from "react";

export default function Sidebar({ role, username, activePage, onNavClick, onLogout }) {
    if (!role) return null;

    const adminMenu = (
        <>
            <h2>您好，</h2>
            <div className="username">{username}</div>
            <button
                className={activePage === "confirmOrders" ? "active" : ""}
                onClick={() => onNavClick("confirmOrders")}
            >
                <span>確認客戶訂單</span><span>›</span>
            </button>
            <button
                className={activePage === "insert" ? "active" : ""}
                onClick={() => onNavClick("insert")}
            >
                <span>新增委託</span><span>›</span>
            </button>
            <button
                className={activePage === "users" ? "active" : ""}
                onClick={() => onNavClick("users")}
            >
                <span>所有委託管理</span><span>›</span>
            </button>
            <button
                className={activePage === "viewSchedule" ? "active" : ""}
                onClick={() => onNavClick("viewSchedule")}
            >
                <span>查看排程</span><span>›</span>
            </button>
            <button
                className={activePage === "blacklist" ? "active" : ""}
                onClick={() => onNavClick("blacklist")}
            >
                <span>黑名單列表</span><span>›</span>
            </button>
            <button onClick={onLogout}>
                <span>登出</span><span>›</span>
            </button>
        </>
    );

    const userMenu = (
        <>
            <h2>您好，</h2>
            <div className="username">{username}</div>
            <button
                className={activePage === "orders" ? "active" : ""}
                onClick={() => onNavClick("orders")}
            >
                <span>我的委託</span><span>›</span>
            </button>
            <button
                className={activePage === "userInsert" ? "active" : ""}
                onClick={() => onNavClick("userInsert")}
            >
                <span>新增委託</span><span>›</span>
            </button>
            <button
                className={activePage === "ordersList" ? "active" : ""}
                onClick={() => onNavClick("ordersList")}
            >
                <span>委託內容</span><span>›</span>
            </button>
            <button onClick={onLogout}>
                <span>登出</span><span>›</span>
            </button>
        </>
    );

    return (
        <aside className="sidebar">
            <div className="sidebar-content">
                {role === "admin" ? adminMenu : userMenu}
            </div>
        </aside>
    );
}
