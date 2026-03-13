import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';
import './Layout.css';

const SPRAVOCHNIK_PATHS = [ROUTES.CUSTOMERS, ROUTES.PRODUCTS, ROUTES.EMPLOYEES, ROUTES.INTEREST_RATES];
const KASSA_PATHS = [ROUTES.RECEIPTS, ROUTES.CONTRACTS, ROUTES.CONTRACT_NEW];

const sidebarLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `sidebar-link ${isActive ? 'active' : ''}`;

export default function Layout() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, token, loading } = useAuth();
  const location = useLocation();
  const [spravochnikOpen, setSpravochnikOpen] = useState(false);
  const [kassaOpen, setKassaOpen] = useState(false);

  const isSpravochnikActive = SPRAVOCHNIK_PATHS.some(
    (p) => location.pathname.startsWith(p) || location.pathname === p
  );
  const isKassaActive = KASSA_PATHS.some(
    (p) => location.pathname.startsWith(p) || location.pathname === p
  );

  useEffect(() => {
    if (isSpravochnikActive) setSpravochnikOpen(true);
  }, [isSpravochnikActive]);
  useEffect(() => {
    if (isKassaActive) setKassaOpen(true);
  }, [isKassaActive]);

  const closeMenus = () => {
    setSpravochnikOpen(false);
    setKassaOpen(false);
  };

  if (loading) {
    return (
      <div className="layout layout-loading">
        <p className="text-loading">Yuklanmoqda…</p>
      </div>
    );
  }
  if (!token) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return (
    <div className="layout" style={{ display:"flex",flexDirection:"row" }}>
      <aside className="sidebar">
        <NavLink to={ROUTES.HOME} className="sidebar-logo" end>
          <span className="sidebar-logo-icon">◇</span>
          <span className="sidebar-logo-text text-white">HR</span>
        </NavLink>
        <nav className="sidebar-nav">
          <div className={`sidebar-dropdown ${spravochnikOpen ? 'is-open' : ''} ${isSpravochnikActive ? 'has-active' : ''}`}>
            <button
              type="button"
              className="sidebar-dropdown-btn"
              onClick={() => { setSpravochnikOpen((o) => !o); setKassaOpen(false); }}
              // aria-expanded={spravochnikOpen}
            >
              <span className="sidebar-dropdown-icon">📁</span>
              Spravochnik
              {/*<span className="sidebar-dropdown-chevron" aria-hidden>▼</span>*/}
            </button>
            <div className="sidebar-dropdown-menu" aria-hidden={!spravochnikOpen}>
              <NavLink to={ROUTES.CUSTOMERS} className={sidebarLinkClassName} onClick={closeMenus}>
                <span className="sidebar-link-dot" aria-hidden>•</span>
                Klient
              </NavLink>
              {/*<br/>*/}
              <NavLink to={ROUTES.PRODUCTS} className={sidebarLinkClassName} onClick={closeMenus}>
                <span className="sidebar-link-dot" aria-hidden>•</span>
                Mahsulot
              </NavLink>
              <NavLink to={ROUTES.EMPLOYEES} className={sidebarLinkClassName} onClick={closeMenus}>
                <span className="sidebar-link-dot" aria-hidden>•</span>
                Hodim
              </NavLink>
              <NavLink to={ROUTES.INTEREST_RATES} className={sidebarLinkClassName} onClick={closeMenus}>
                <span className="sidebar-link-dot" aria-hidden>•</span>
                Ustanovka foiz
              </NavLink>
            </div>
          </div>
          <div className={`sidebar-dropdown ${kassaOpen ? 'is-open' : ''} ${isKassaActive ? 'has-active' : ''}`}>
            <button
              type="button"
              className="sidebar-dropdown-btn"
              onClick={() => { setKassaOpen((o) => !o); setSpravochnikOpen(false); }}
              aria-expanded={kassaOpen}
            >
              <span className="sidebar-dropdown-icon">💰</span>
              Kassa
              <span className="sidebar-dropdown-chevron" aria-hidden>▼</span>
            </button>
            <div className="sidebar-dropdown-menu" aria-hidden={!kassaOpen}>
              <NavLink to={ROUTES.RECEIPTS} className={sidebarLinkClassName} onClick={closeMenus}>
                <span className="sidebar-link-dot" aria-hidden>•</span>
                Kvitansiyalar
              </NavLink>
              <NavLink to={ROUTES.CONTRACT_NEW} className={sidebarLinkClassName} onClick={closeMenus}>
                <span className="sidebar-link-dot" aria-hidden>•</span>
                Shartnoma yaratish
              </NavLink>
              <NavLink to={ROUTES.CONTRACTS} className={sidebarLinkClassName} end onClick={closeMenus}>
                <span className="sidebar-link-dot" aria-hidden>•</span>
                To‘lov grafigi
              </NavLink>
            </div>
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="theme-toggle-wrap">
            <span className="theme-label">{theme === 'dark' ? 'Qorong‘u' : 'Yorug‘'}</span>
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Yorug‘ rejimga o‘tish' : 'Qorong‘u rejimga o‘tish'}
              aria-label="Tema"
            >
              <span className="theme-icon sun" aria-hidden>☀️</span>
              <span className="theme-icon moon" aria-hidden>🌙</span>
            </button>
          </div>
          <div className="sidebar-profile">
            <span className="sidebar-profile-label">Profil</span>
            <span className="sidebar-profile-name">
              {user ? `${user.firstName} ${user.lastName}`.trim() || user.login : '—'}
            </span>
            <button type="button" className="sidebar-logout" onClick={logout}>
              Chiqish
            </button>
          </div>
        </div>
      </aside>
      <main className="main-content">
        <Outlet key={location.pathname} />
      </main>
    </div>
  );
}
