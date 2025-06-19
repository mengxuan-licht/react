import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import HomePage from "./HomePage";
import ConfirmOrdersInfo from "../admin/ConfirmOrdersInfo";
import OrdersInfo from "../user/OrdersInfo.jsx";
import ViewSchedule from '../admin/ViewSchedule.jsx';
import BlacklistView from '../admin/BlacklistView.jsx';
import OrdersList from '../user/OrdersList.jsx';
import AdminManageInfo from '../admin/AdminManageInfo.jsx';
import ShowInsertPage from '../admin/ShowInsertPage.jsx';
import ShowUpdatePage from '../admin/showUpdatePage.jsx';
import ShowOrderForm from '../user/ShowOrderForm.jsx';
import DoOrderUpdate from '../user/doOrderUpdate.jsx';
import ContractPopup from '../components/ContractPopup';
import NoticePopup from '../components/NoticePopup.jsx';
import GalleryEditor from '../components/GalleryEditor.jsx';

export default function MainPage() {
    const [role, setRole] = useState(null);
    const [username, setUsername] = useState(null);
    const [activePage, setActivePage] = useState(null);
    const [editId, setEditId] = useState(null);
    const [showContract, setShowContract] = useState(false);
    const [showNotice, setShowNotice] = useState(false);

    useEffect(() => {
        const jwt = localStorage.getItem("jwtToken");
        if (!jwt) {
            setRole(null);
            setUsername(null);
            setActivePage('home');
            return;
        }

        try {
            const payload = JSON.parse(atob(jwt.split(".")[1]));
            const roleFromToken = payload.data.role || "user";
            const usernameFromToken = payload.data.name || "用戶";

            console.log("⚙️ Init role:", roleFromToken);
            console.log("⚙️ Init username:", usernameFromToken);

            setRole(roleFromToken);
            setUsername(usernameFromToken);
            localStorage.setItem("role", roleFromToken);

            const storedPage = localStorage.getItem("activePage");
            if (storedPage) {
                console.log("📦 Restore activePage from localStorage:", storedPage);
                setActivePage(storedPage);
                localStorage.removeItem("activePage");
            } else {
                const defaultPage = roleFromToken === "admin" ? "insert" : "userInsert";
                console.log("➡️ Default activePage:", defaultPage);
                setActivePage(defaultPage);
            }
        } catch {
            localStorage.removeItem("jwtToken");
            setRole(null);
            setUsername(null);
            setActivePage('home');
        }
    }, []);

    const handleAdd = () => {
        setEditId(null);
        setActivePage(role === 'admin' ? 'insert' : 'userInsert');
    };

    const handleEdit = (id) => {
        setEditId(id);
        setActivePage('update');
    };

    const handleBack = () => {
        setActivePage(role === 'admin' ? 'users' : 'orders');
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    };

    const handleNavClick = (pageId) => {
        if (pageId === 'contract') {
            setShowContract(true);
            return;
        }
        if (pageId === 'notice') {
            setShowNotice(true);
            return;
        }
        setActivePage(pageId);
    };

    const renderContent = () => {
        console.log("🎯 Render activePage:", activePage);

        if (role === "admin") {
            switch (activePage) {
                case "confirmOrders": return <ConfirmOrdersInfo />;
                case "users": return <AdminManageInfo onAdd={handleAdd} onEdit={handleEdit} />;
                case "insert": return <ShowInsertPage onBack={handleBack} />;
                case "update": return <ShowUpdatePage id={editId} onBack={handleBack} />;
                case "viewSchedule": return <ViewSchedule />;
                case "blacklist": return <BlacklistView />;
                default: return <div>⚠️ 找不到頁面：{activePage}</div>;
            }
        } else {
            switch (activePage) {
                case "orders": return <OrdersInfo />;
                case "ordersList": return <OrdersList />;
                case "userInsert": return <ShowOrderForm onBack={handleBack} />;
                case "update": return <DoOrderUpdate id={editId} onBack={handleBack} />;
                default: return <div>⚠️ 找不到頁面：{activePage}</div>;
            }
        }
    };

    if (activePage === "home") return <HomePage />;

    return (
        <>
            <Navbar
                username={username}
                onNavClick={handleNavClick}
                onLogout={handleLogout}
                role={role}
            />
            <div className="container">
                <Sidebar
                    role={role}
                    username={username}
                    activePage={activePage}
                    onNavClick={handleNavClick}
                    onLogout={handleLogout}
                />
                <main className="main" id="content">
                    {renderContent()}
                </main>
            </div>

            {showContract && (
                <ContractPopup
                    visible={showContract}
                    onClose={() => setShowContract(false)}
                />
            )}
            {showNotice && (
                <NoticePopup
                    visible={showNotice}
                    onClose={() => setShowNotice(false)}
                />
            )}
        </>
    );
}
