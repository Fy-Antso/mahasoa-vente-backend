import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import logo from '../assets/logo.png';
import './Dashboard.css';

function DashboardPage() {
  const [articles, setArticles] = useState([]);
  const [mouvements, setMouvements] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem('user')) || { username: 'Administrateur', role: 'ADMINISTRATEUR' };

  useEffect(() => {
    // Récupération des données réelles de la base via l'API
    Promise.all([
      api.get('articles/').catch(() => ({ data: [] })),
      api.get('mouvements/').catch(() => ({ data: [] })),
      api.get('fournisseurs/').catch(() => ({ data: [] }))
    ])
      .then(([resArticles, resMouvements, resFournisseurs]) => {
        setArticles(resArticles.data || []);
        setMouvements(resMouvements.data || []);
        setFournisseurs(resFournisseurs.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API Dashboard :", err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Calculs dynamiques basés sur les données réelles (0 si vide)
  const totalProduits = articles.length;
  
  // Calcul des stocks faibles (articles dont la quantité est inférieure ou égale au seuil minimum)
  const stocksFaibles = articles.filter(a => Number(a.quantite) <= Number(a.seuil_minimum)).length;
  
  const totalFournisseurs = fournisseurs.length;

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR VERTE À GAUCHE */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logo} alt="Logo" className="brand-logo" />
          <h2 className="brand-title">MAHASOA VENTE</h2>
          <span className="brand-role">{storedUser.role}</span>
        </div>

        <nav className="sidebar-menu">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
            <span>Tableau de Bord</span>
          </NavLink>

          <NavLink to="/articles" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            <span>Articles / Produits</span>
          </NavLink>

          <NavLink to="/categories" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            <span>Catégories</span>
          </NavLink>

          <NavLink to="/mouvements" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
            <span>Mouvements Stock</span>
          </NavLink>

          <NavLink to="/fournisseurs" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>Fournisseurs</span>
          </NavLink>

          <NavLink to="/utilisateurs" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>Utilisateurs</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ZONE PRINCIPALE À DROITE */}
      <div className="main-wrapper">
        <header className="top-navbar">
          <button className="btn-icon-menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#043327" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>

          <div className="top-navbar-right">
            <div className="notification-bell">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span className="bell-badge"></span>
            </div>

            <div className="user-profile">
              <div className="avatar-circle">A</div>
              <span className="user-name">{storedUser.username}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </header>

        <main className="content-area">
          {/* EN-TÊTE PAGE */}
          <div className="page-header">
            <div className="header-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#043327" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </div>
            <div>
              <h1>Tableau de bord</h1>
              <p>Bienvenue, <strong>{storedUser.username}</strong> ! Voici un aperçu de votre activité.</p>
            </div>
          </div>

          {/* 4 CARTES KPI DYNAMIQUES */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon-bg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#043327" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              </div>
              <div className="kpi-info">
                <span className="kpi-title">Total Produits</span>
                <div className="kpi-value">{totalProduits}</div>
                <span className="kpi-sub gray">Données réelles</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-bg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#043327" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </div>
              <div className="kpi-info">
                <span className="kpi-title">Ventes du Jour</span>
                <div className="kpi-value">0 Ar</div>
                <span className="kpi-sub gray">Aucune vente</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-bg warning">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div className="kpi-info">
                <span className="kpi-title">Stocks Faibles</span>
                <div className="kpi-value warning">{stocksFaibles}</div>
                <span className="kpi-sub gray">À jour</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-bg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#043327" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div className="kpi-info">
                <span className="kpi-title">Fournisseurs</span>
                <div className="kpi-value">{totalFournisseurs}</div>
                <span className="kpi-sub gray">Enregistrés</span>
              </div>
            </div>
          </div>

          {/* GRAPHIQUES */}
          <div className="charts-grid">
            <div className="card-box chart-box-large">
              <div className="card-header">
                <h2>Évolution des ventes</h2>
                <select className="select-filter">
                  <option>7 derniers jours</option>
                </select>
              </div>
              <div className="mock-area-chart">
                <span>{loading ? "Chargement..." : "Aucune donnée de vente enregistrée"}</span>
              </div>
            </div>

            <div className="card-box chart-box-small">
              <div className="card-header">
                <h2>Répartition des produits par catégorie</h2>
              </div>
              <div className="donut-container">
                <div className="donut-mock" style={{ background: '#E5E7EB' }}>
                  <div className="donut-center">
                    <strong>{totalProduits}</strong>
                    <span>Total</span>
                  </div>
                </div>
                <ul className="donut-legend">
                  <li><span className="dot gray"></span> Aucune catégorie enregistrée (0%)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* TABLEAUX BAS DE PAGE */}
          <div className="tables-grid">
            <div className="card-box">
              <div className="card-header">
                <div className="card-title-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#043327" strokeWidth="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                  <h2>Mouvements récents</h2>
                </div>
                <button className="btn-text">Voir tout</button>
              </div>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Produit</th>
                    <th>Quantité</th>
                    <th>Utilisateur</th>
                  </tr>
                </thead>
                <tbody>
                  {mouvements.length > 0 ? (
                    mouvements.slice(0, 3).map((m, index) => (
                      <tr key={index}>
                        <td>{m.date || '—'}</td>
                        <td><span className={`badge ${m.type === 'Entree' ? 'badge-in' : 'badge-out'}`}>{m.type || '—'}</span></td>
                        <td>{m.produit || '—'}</td>
                        <td className={m.type === 'Entree' ? 'text-green' : 'text-red'}>{m.quantite}</td>
                        <td>{m.utilisateur || '—'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: '#9CA3AF', padding: '1rem' }}>
                        Aucun mouvement récent
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="card-box">
              <div className="card-header">
                <div className="card-title-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <h2>Alertes de stock</h2>
                </div>
                <button className="btn-text">Voir tout</button>
              </div>
              <div className="alerts-list">
                {articles.filter(a => Number(a.quantite) <= Number(a.seuil_minimum)).length > 0 ? (
                  articles.filter(a => Number(a.quantite) <= Number(a.seuil_minimum)).slice(0, 3).map((a, index) => (
                    <div className="alert-item" key={index}>
                      <div className="alert-left">
                        <span className="alert-name">{a.designation}</span>
                      </div>
                      <span className="alert-stock">Stock actuel : {a.quantite}</span>
                      <button className="btn-outline-sm">Voir</button>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '1rem', fontSize: '0.75rem' }}>
                    Aucune alerte de stock
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <footer className="footer-copyright">
          © 2025 Mahasoa Vente. Tous droits réservés.
        </footer>
      </div>

      {/* MODALE DE CONFIRMATION DE DÉCONNEXION CENTRÉE */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Confirmation</h3>
            <p>Souhaitez-vous vraiment vous déconnecter ?</p>
            <div className="modal-actions">
              <button className="btn-yes" onClick={handleLogoutConfirm}>
                Oui
              </button>
              <button className="btn-no" onClick={() => setShowLogoutModal(false)}>
                Non
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;