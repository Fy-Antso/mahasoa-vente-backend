import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import './AdminLayout.css';

const LIENS = [
  { to: '/', icon: '📊', label: 'Tableau de Bord', end: true },
  { to: '/articles', icon: '📦', label: 'Articles / Produits' },
  { to: '/categories', icon: '🏷️', label: 'Catégories' },
  { to: '/mouvements', icon: '🔄', label: 'Mouvements Stock' },
  { to: '/fournisseurs', icon: '👥', label: 'Fournisseurs' },
  { to: '/utilisateurs', icon: '👤', label: 'Utilisateurs' },
];

function lireUtilisateur() {
  try {
    return JSON.parse(localStorage.getItem('user')) || {};
  } catch {
    return {};
  }
}

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = lireUtilisateur();
  const nom = user.nom || user.username || 'Administrateur';
  const role = (user.role || 'administrateur').toUpperCase();

  // Referme le tiroir à chaque changement de page
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Bloque le défilement de la page quand le tiroir est ouvert
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="admin-container">
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <img src={logo} alt="Mahasoa Vente" className="brand-logo" />
          <h2 className="brand-title">MAHASOA VENTE</h2>
          <span className="brand-role">{role}</span>
        </div>

        <nav className="sidebar-menu">
          {LIENS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              <span className="icon">{l.icon}</span> {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <span className="icon">🚪</span> Déconnexion
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <button className="menu-toggle" onClick={() => setIsSidebarOpen(true)} aria-label="Ouvrir le menu">
            ☰
          </button>
          <div className="header-actions">
            <span className="notification-icon">🔔</span>
            <div className="user-badge">
              <span className="avatar">{nom.charAt(0).toUpperCase()}</span>
              <span className="username">{nom}</span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;