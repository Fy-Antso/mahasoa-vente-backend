import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './AdminLayout.css';

function AdminLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Récupération des infos utilisateur stockées lors du login
  const user = JSON.parse(localStorage.getItem('user')) || { username: 'Administrateur', role: 'ADMINISTRATEUR' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="admin-container">
      {/* Overlay sombre en arrière-plan sur mobile lorsque le menu est ouvert */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* SIDEBAR VERTE */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <img src={logo} alt="Mahasoa Vente" className="brand-logo" />
          <h2 className="brand-title">MAHASOA VENTE</h2>
          <span className="brand-role">{user.role}</span>
        </div>

        <nav className="sidebar-menu" onClick={closeSidebar}>
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span className="icon">📊</span> Tableau de Bord
          </NavLink>
          <NavLink to="/admin/articles" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span className="icon">📦</span> Articles / Produits
          </NavLink>
          <NavLink to="/admin/categories" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span className="icon">🏷️</span> Catégories
          </NavLink>
          <NavLink to="/admin/mouvements" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span className="icon">🔄</span> Mouvements Stock
          </NavLink>
          <NavLink to="/admin/fournisseurs" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span className="icon">👥</span> Fournisseurs
          </NavLink>
          <NavLink to="/admin/utilisateurs" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span className="icon">👤</span> Utilisateurs
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <span className="icon">🚪</span> Déconnexion
          </button>
        </div>
      </aside>

      {/* ZONE DROITE : NAVBAR SUPÉRIEURE + CONTENU DYNAMIQUE */}
      <div className="admin-main">
        <header className="admin-header">
          <button className="menu-toggle" onClick={toggleSidebar} aria-label="Menu">
            ☰
          </button>
          <div className="header-actions">
            <span className="notification-icon">🔔</span>
            <div className="user-badge">
              <span className="avatar">A</span>
              <span className="username">{user.username}</span>
            </div>
          </div>
        </header>

        {/* C'est ici que les pages vont s'afficher */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;