import React, { useState, useEffect } from 'react';
import Request from '../shared/Request.js';
import checkPermission from '../shared/checkPermission.js';
import ViewOrderDetail from './ViewOrderDetail.jsx';
import ShowOrderForm from './ShowOrderForm.jsx';
import CancelPopup from './CancelPopup.jsx'; // 引入取消彈窗元件

export default function OrdersInfo() {
  const [orders, setOrders] = useState([]);
  const [viewOrderId, setViewOrderId] = useState(null);
  const [editOrderId, setEditOrderId] = useState(null);
  const [cancelId, setCancelId] = useState(null);
  const [canCreate, setCanCreate] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await Request().get(`/index.php?action=getOrders&_=${Date.now()}`);
      const response = res.data;

      if (response.token && window.localStorage) {
        localStorage.setItem("jwtToken", response.token);
        if (response.role) localStorage.setItem("role", response.role);
        if (response.username) localStorage.setItem("username", response.username);
      }

      if (response.status === 200) {
        setIsBlacklisted(response.is_blacklisted === 1);
        setOrders(response.result || []);

        const [createPerm, editPerm] = await Promise.all([
          new Promise(resolve => checkPermission('create_orders', resolve)),
          new Promise(resolve => checkPermission('edit_orders', resolve))
        ]);

        setCanCreate(createPerm);
        setCanEdit(editPerm);
      } else if (response.status === 401) {
        window.location.href = '/login';
      } else {
        alert(response.message || '無法取得訂單資料');
      }
    } catch (err) {
      alert("發生錯誤：" + err);
    }
  };

  const handleEdit = (id) => {
    setEditOrderId(id);
  };

  const handleCancelClick = (id) => {
    setCancelId(id);
  };

  const closeCancelPopup = () => {
    setCancelId(null);
  };

  const onCancelSuccess = () => {
    closeCancelPopup();
    fetchOrders();
  };

  const handleNewOrder = () => {
    if (isBlacklisted) {
      alert("⚠️ 您目前為黑名單用戶，無法新增委託。");
      return;
    }
    setIsAdding(true);
    setEditOrderId(null);
  };

  const handleBackToList = async () => {
    setViewOrderId(null);
    setEditOrderId(null);
    setIsAdding(false);
    await fetchOrders();
  };

  if (viewOrderId) {
    return <ViewOrderDetail orderId={viewOrderId} onBack={handleBackToList} />;
  }

  if (editOrderId !== null || isAdding) {
    return <ShowOrderForm orderId={editOrderId} onBack={handleBackToList} />;
  }

  if (isBlacklisted) {
    return <p>⚠️ 您目前為黑名單用戶，無法查看委託列表或填寫委託表單。</p>;
  }

  return (
    <div>
      <div className="top-action">
        {canCreate && !isBlacklisted && (
          <button id="newOrder" onClick={handleNewOrder}>委託申請</button>
        )}
      </div>

      <div className="orders-grid">
        {orders.map(order => {
          const fettleMap = {
            "未讀": 0,
            "已讀": 4,
            "確認中": 15,
            "排程中": 30,
            "繪製中": 60,
            "完成": 100
          };
          const progress = fettleMap[order.fettle] || 0;
          const imageIndex = (order.id % 9) + 1;
          const imagePath = `../img/art${imageIndex}.png`;

          return (
            <div className="order-card" key={order.id}>
              <img src={imagePath} alt="委託圖片" />
              <h4>{order.titles || '(無標題)'}</h4>
              <div className="date-status">
                <span>{order.date || ''}</span>
                <span>{order.fettle || ''}</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
              </div>
              {!isBlacklisted && canEdit && order.fettle === '未讀' ? (
                <>
                  <button className="btn-primary" onClick={() => handleEdit(order.id)}>修改訂單</button>
                  <button className="btn-secondary" onClick={() => handleCancelClick(order.id)}>取消訂單</button>
                </>
              ) : (
                <button className="btn-primary" onClick={() => setViewOrderId(order.id)}>查看訂單</button>
              )}
            </div>
          );
        })}
      </div>

      {cancelId !== null && (
        <CancelPopup
          orderId={cancelId}
          onClose={closeCancelPopup}
          onCancelSuccess={onCancelSuccess}
        />
      )}
    </div>
  );
}
