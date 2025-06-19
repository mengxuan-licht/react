// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import Request from '../shared/Request';
import calendarView from '../components/calendarView';
import showPricePopup from '../components/showPricePopup';
import NoticePopup from '../components/NoticePopup';
import ContractPopup from '../components/ContractPopup';
import MainPage from './MainPage';
import LoginModal from '../components/LoginModal';
import GalleryView from '../components/GalleryView';
import GalleryEditor from '../components/GalleryEditor';

export default function HomePage() {
  // --- 狀態宣告 ---
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const [role, setRole] = useState(null);
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  // Gallery 編輯用資料
  const [images, setImages] = useState([
    '/img/art1.png', '/img/art2.png', '/img/art3.png',
    '/img/art4.png', '/img/art5.png', '/img/art6.png',
    '/img/art7.png', '/img/art8.png', '/img/art9.png'
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // 讀取 localStorage 同步使用者狀態
  const refreshUserInfo = () => {
    const tk = localStorage.getItem('jwtToken');
    const user = localStorage.getItem('username');
    const blacklist = localStorage.getItem('is_blacklisted') === '1';
    const userRole = localStorage.getItem('role');
    setToken(tk);
    setUsername(user);
    setIsBlacklisted(blacklist);
    setRole(userRole);
  };
  useEffect(() => {
    const target = document.getElementById('main-apply-btn'); // 按鈕 ID

    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setShowFloatingBtn(!entry.isIntersecting); // 滾出畫面才顯示浮動按鈕
      },
      {
        root: null, // 預設是 viewport
        threshold: 0.1,
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, []);

  // 登出
  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUsername(null);
    setIsBlacklisted(false);
    setRole(null);
    setCurrentPage('home');
  };

  // 委託申請按鈕
  const checkBlacklistAndGo = () => {
    if (!token) { setShowModal(true); return; }
    if (isBlacklisted) {
      alert('⚠️ 您目前為黑名單用戶，無法申請委託。');
      return;
    }
    const next = role === 'admin' ? 'insert' : 'userInsert';
    localStorage.setItem('activePage', next);
    setCurrentPage('mainPage');
  };

  // 我的委託按鈕
  const handleShowOrders = () => {
    if (!token) { setShowModal(true); return; }
    const next = role === 'admin' ? 'confirmOrders' : 'orders';
    localStorage.setItem('activePage', next);
    setCurrentPage('mainPage');
  };

  // 平滑滾動輔助
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Gallery 上傳
  const onUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImages(prev => [...prev, url]);
  };

  // 結束編輯動畫
  const onCloseEditor = () => {
    setFadeOut(true);
    setTimeout(() => {
      setIsEditing(false);
      setFadeOut(false);
    }, 300);
  };

  // 切到 MainPage
  if (currentPage === 'mainPage') return <MainPage />;

  return (
    <div>
      {/* === Navbar === */}
      <header className="navbar">
        <nav className="nav-links">
          <ul>
            <li><a onClick={() => scrollToId('home')}>首頁</a></li>
            <li><a href="#" onClick={e => { e.preventDefault(); calendarView(); }}>排程</a></li>
            <li><a href="#" onClick={e => { e.preventDefault(); showPricePopup(); }}>價目表</a></li>
            <li><a href="#" onClick={e => { e.preventDefault(); setShowContract(true); }}>合約</a></li>
            <li><a href="#" onClick={e => { e.preventDefault(); setShowNotice(true); }}>注意事項</a></li>
            {role === 'admin' && (
              <li>
                <button
                  className="btn-outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? '結束編輯' : '畫廊編輯'}
                </button>
              </li>
            )}
          </ul>
        </nav>
        <div className="nav-right">
          <button className="btn-outline" onClick={checkBlacklistAndGo}>委託申請</button>
          {token && username ? (
            <>
              <button className="btn-outline" onClick={handleShowOrders}>我的委託</button>
              <div className="user-dropdown">
                <span>{username} ▾</span>
                <div className="dropdown-content">
                  <button onClick={handleLogout}>登出</button>
                </div>
              </div>
            </>
          ) : (
            <button className="btn-outline" onClick={() => setShowLoginModal(true)}>登入</button>
          )}
        </div>
      </header>

      {/* === Hero Section === */}
      <main id="home" className="hero-section">
        <div className="hero-img-wrapper">
          <img src="../img/banner-main.png" alt="主視覺" className="hero-img" />
          <div className="hero-gradient-bottom"></div>
          <div className="hero-text">
            <h1>SHENHAI's COMMISSION</h1>
            <p>Illustration Artist, shenhai</p>
            <div className="social-icons">
              <a href="https://www.instagram.com/shenhai_s_n" target="_blank" rel="noopener noreferrer">
                <img src="../img/ig.png" alt="Instagram" />
              </a>
              <a href="#"><img src="../img/x.png" alt="Twitter" /></a>
              <a href="mailto:shenhaihsn@gmail.com"><img src="../img/mail.png" alt="Email" /></a>
            </div>
          </div>
        </div>
      </main>

      {/* === Commission Info === */}
      <section className="commission-info">
        <div className="tags">
          <span className="tag">插畫</span>
          <span className="tag">商稿</span>
          <span className="tag">遊戲人物設計</span>
        </div>
        <p>NOW COMMISSION IS OPEN !</p>
        <button id="main-apply-btn" className="btn-filled" onClick={checkBlacklistAndGo}>委託申請</button>
        <div className="contact-info-container">
          <div className="contact-info">
            <h4>聯絡詳情資訊</h4>
            <p>Instagram: shenhai_s_n</p>
            <p>X: shenhai_s_n</p>
            <p>Email: shenhaisn@gmail.com</p>
          </div>
          <div className="divider"></div>
          <div className="contact-info">
            <h4>COMMISSION OPEN NOW</h4>
            <p>7/11/2025 ~</p>
            <div className="view-more" onClick={() => scrollToId('gallery')}>
              查看作品資訊 &gt;
            </div>
          </div>
        </div>
      </section>

      {/* === Section Tabs === */}
      <div className="section-tabs">
        <span onClick={() => scrollToId('gallery')}>簡介</span>
        <span onClick={() => scrollToId('artistinfo')}>繪師</span>
        <span>推薦作品</span>
      </div>

      {/* === Gallery or Editor === */}
      {isEditing ? (
        <GalleryEditor
          images={images}
          setImages={setImages}
          onUpload={onUpload}
          fadeOut={fadeOut}
          onClose={onCloseEditor}
        />
      ) : (
        <GalleryView
          images={images}
          isAdmin={role === 'admin'}
          onEdit={() => setIsEditing(true)}
        />
      )}

      {/* === Artist Info === */}
      <section id="artistinfo" className="artist-section">
        <div className="artist-banner">
          <div className="artist-overlay">
            <div className="artist-message">
              <h2>SHENHAI 想說的話</h2>
              <p>歡迎來到我的接稿平台！我是一名插畫家，專注於創作獨特的角色設計和商業插畫。</p>
              <p>如果你對我的作品感興趣，請隨時聯繫我！</p>
              <p>— SHENHAI</p>
            </div>
          </div>
        </div>
        <div className="artist-profile-container">
          <div className="artist-profile-pic">
            <img src="../img/profile.png" alt="SHENHAI 頭像" />
          </div>
          <div className="artist-info">
            <h3>插畫家 SHENHAI</h3>
            <p><strong>從業年份：</strong>2023 年起</p>
            <p><strong>專長領域：</strong>插畫、角色設計、商業稿件</p>
            <p><strong>目前所在地：</strong>台灣</p>
            <a href="https://www.instagram.com/shenhai_s_n" target="_blank" rel="noopener noreferrer" className="ig-button">
              Instagram
            </a>
          </div>
        </div>
      </section>

      {/* === Floating Order Button === */}
      <div id="floating-btn" className={`floating-order-container ${showFloatingBtn ? 'visible' : ''}`}>
        <div className="floating-order-box">
          <span className="floating-text">現在開始委託吧！</span>
          <button className="btn-filled" onClick={checkBlacklistAndGo}>委託申請</button>
        </div>
      </div>

      {/* === 未登入提示彈窗 === */}
      {showModal && (
        <div id="status-modal" className="popup-container">
          <div className="popup-box">
            <p>未登入，請先登入再進行委託申請。</p>
            <button onClick={() => setShowModal(false)}>確定</button>
          </div>
        </div>
      )}

      {/* === 合約 & 注意事項彈窗 === */}
      {showContract && <ContractPopup visible onClose={() => setShowContract(false)} />}
      {showNotice && <NoticePopup visible onClose={() => setShowNotice(false)} />}

      {/* === 登入 Modal === */}
      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={refreshUserInfo}
      />
    </div>
  );
}
