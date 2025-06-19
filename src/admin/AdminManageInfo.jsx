// src/admin/AdminManageInfo.jsx
import React, { useState, useEffect } from 'react';
import Request from '../shared/Request.js';
import loginPage from '../pages/HomePage.jsx';
import checkPermission from '../shared/checkPermission.js';
import doDelete from './doDelete.js';

export default function AdminManageInfo({ onAdd, onEdit }) {
    const [rows, setRows] = useState([]);
    const [canCreate, setCanCreate] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [reloadFlag, setReloadFlag] = useState(false); // 用來觸發資料重新載入

    useEffect(() => {
        Request().get("/index.php?action=getOrders")
            .then(res => {
                const response = res.data;

                if (response.token && window.localStorage) {
                    localStorage.setItem("jwtToken", response.token);
                }

                switch (response.status) {
                    case 200:
                        setRows(response.result);

                        Promise.all([
                            new Promise(resolve => checkPermission('create_orders', resolve)),
                            new Promise(resolve => checkPermission('edit_orders', resolve)),
                            new Promise(resolve => checkPermission('delete_orders', resolve)),
                        ]).then(([create, edit, del]) => {
                            setCanCreate(create);
                            setCanEdit(edit);
                            setCanDelete(del);
                        });

                        setErrorMsg('');
                        break;

                    case 401:
                        loginPage();
                        break;

                    case 403:
                        setErrorMsg('❌ 權限不足');
                        break;

                    default:
                        setErrorMsg(response.message || "資料載入失敗");
                        break;
                }
            })
            .catch(err => {
                setErrorMsg('發生錯誤：' + err);
            });
    }, [reloadFlag]); // reloadFlag 改變時重新載入資料

    if (errorMsg) {
        return <div className="alert-message alert-error">{errorMsg}</div>;
    }

    const handleDelete = (id) => {
        if (!window.confirm("⚠️ 確定要刪除這筆委託資料嗎？此操作無法復原。")) return;

        doDelete(id)
            .then(() => {
                alert('✅ 刪除成功');
                setReloadFlag(!reloadFlag); // 觸發重新載入
            })
            .catch(err => {
                alert('❌ 刪除失敗：' + err.message);
            });
    };

    return (
        <div>
            {canCreate && (
                <div style={{ textAlign: "right", marginBottom: "1rem" }}>
                    <button className="custom-btn" onClick={onAdd}>
                        ➕ 新增委託
                    </button>
                </div>
            )}

            <table className="custom-table">
                <thead>
                    <tr>
                        <th>編號</th>
                        <th>委託人姓名</th>
                        <th className="hide-on-tablet">標題</th>
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
                        <th style={{ textAlign: "center" }}>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((element, index) => (
                        <tr key={element.id}>
                            <td data-title="編號">{index + 1}</td>
                            <td data-title="委託人姓名">{element.username || ''}</td>
                            <td className="hide-on-tablet" data-title="標題">{element.titles || ''}</td>
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
                            <td className="action-column" data-title="操作" style={{ textAlign: "center" }}>
                                {canEdit && (
                                    <button
                                        className="custom-btn"
                                        onClick={() => onEdit(element.id)}
                                    >
                                        修改
                                    </button>
                                )}
                                
                                {canDelete && (
                                    <button
                                        className="custom-btn delete-btn"
                                        onClick={() => handleDelete(element.id)}
                                    >
                                        刪除
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
