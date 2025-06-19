// src/components/Navbar.jsx
import React from "react";
import calendarView from "../components/calendarView";
import showNoticePopup from "../components/NoticePopup";
import showPricePopup from "../components/showPricePopup";
import showContractPopup from "../components/ContractPopup";

export default function Navbar({ username, onNavClick, onLogout, role }) {
    return (
        <header className="navbar">
            <nav className="nav-links">
                <ul>
                    <li>
                        <a href="#home" onClick={() => onNavClick("home")}>
                            首頁
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                calendarView();
                            }}
                        >
                            排程
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                showPricePopup();
                            }}
                        >
                            價目表
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                showContractPopup();
                            }}
                        >
                            合約
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                showNoticePopup();
                            }}
                        >
                            服務條款
                        </a>
                    </li>
                </ul>
            </nav>
            <div className="nav-right">
                <a
                    className="btn-outline"
                    onClick={() => {
                        if (role === "admin") {
                            onNavClick("insert");
                        } else {
                            onNavClick("userInsert");
                        }
                    }}
                >
                    委託申請
                </a>

                {username ? (
                    <div className="user-dropdown">
                        <span>{username} ▾</span>
                        <div className="dropdown-content">
                            <a onClick={() => onNavClick("orders")}>我的委託</a>
                            <a onClick={onLogout}>登出</a>
                        </div>
                    </div>
                ) : (
                    // 如果要改成彈窗也可以把 href 換成 onClick={onLoginClick}
                    <a className="btn-outline" href="/login">
                        登入
                    </a>
                )}
            </div>
        </header>
    );
}
