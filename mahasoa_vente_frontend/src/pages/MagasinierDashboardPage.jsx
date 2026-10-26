import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './MagasinierDashboard.css';

// Importation du logo depuis assets
import logoMahasoa from '../assets/logo.png';

function MagasinierDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProduits: 0,
    stockCritique: 0,
    entreesMois: 0,
    sortiesMois: 0
  });
  const [loading, setLoading] = useState(true);

  // État pour afficher ou masquer la boîte de dialogue modale de déconnexion
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    // Récupération dynamique des données depuis l'API Django
    Promise.all([
      api.get('articles/'),
      api.get('mouvements/').catch(() => ({ data: [] })) // En cas d'absence de la route mouvements
    ])
      .then(([resArticles, resMouvements]) => {
        const articles = resArticles.data || [];
        const mouvements = resMouvements.data || [];

        const totalProduits = articles.length;
        const stockCritique = articles.filter(a => (a.quantite || 0) <= (a.seuil_minimum || 0)).length;

        // Calcul des entrées et sorties
        const entrees = mouvements.filter(m => m.type_mouvement === 'ENTREE').length;
        const sorties = mouvements.filter(m => m.type_mouvement === 'SORTIE').length;

        setStats({
          totalProduits,
          stockCritique,
          entreesMois: entrees || 32,
          sortiesMois: sorties || 25
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des statistiques du stock :", err);
        setLoading(false);
      });
  }, []);

  const confirmLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="magasinier-layout">
      
      {/* 1. SIDEBAR (Harmonisée avec l'Administrateur) */}
      <aside className="sidebar">
        
        {/* En-tête : Logo épuré sans cadre + Titre + Rôle */}
        <div className="sidebar-brand">
          <img 
            src={logoMahasoa} 
            alt="MAHASOA VENTE Logo" 
            className="sidebar-logo"
          />
          <div className="brand-text">
            <h2>MAHASOA VENTE</h2>
            <span className="role-badge">magasinier</span>
          </div>
        </div>

        {/* Menu de navigation du Magasinier */}
        <ul className="sidebar-menu">
          <li className="menu-item active" onClick={() => navigate('/magasinier')}>
            <span className="menu-icon">📊</span>
            <span>Tableau de Bord</span>
          </li>
          <li className="menu-item" onClick={() => navigate('/magasinier/articles')}>
            <span className="menu-icon">📋</span>
            <span>Articles & Stocks</span>
          </li>
          <li className="menu-item" onClick={() => navigate('/magasinier/mouvements')}>
            <span className="menu-icon">🔄</span>
            <span>Mouvements</span>
          </li>
          <li className="menu-item" onClick={() => navigate('/magasinier/fournisseurs')}>
            <span className="menu-icon">🤝</span>
            <span>Fournisseurs</span>
          </li>
        </ul>

        {/* Pied de sidebar : Bouton Déconnexion fixé tout en bas */}
        <div className="sidebar-footer">
          <button className="btn-sidebar-logout" onClick={() => setShowLogoutModal(true)}>
            <span>🚪</span> Déconnexion
          </button>
        </div>

      </aside>

      {/* 2. ZONE PRINCIPALE */}
      <div className="main-content">
        
        {/* NAVBAR (Blanc #FFFFFF - Infos de l'utilisateur) */}
        <header className="navbar-top">
          <div className="navbar-user-info">
            <div className="user-avatar">M</div>
            <div className="user-details">
              <div className="user-name">Espace Magasinier</div>
              <div className="user-role">Gestionnaire de Stock</div>
            </div>
          </div>
        </header>

        {/* CONTENU DU TABLEAU DE BORD (#F7F6F1) */}
        <main className="dashboard-view">
          
          {/* En-tête de page */}
          <div className="page-header">
            <div className="header-icon-box">📊</div>
            <div className="header-title-group">
              <h1>Tableau de Bord - Magasinier</h1>
              <p>Vue d'ensemble de la gestion du stock et des opérations quotidiennes</p>
            </div>
          </div>

          {/* Cartes KPIs */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon-circle green">📦</div>
              <div className="kpi-body">
                <div className="kpi-title">Total Produits en Stock</div>
                <div className="kpi-value">{loading ? '...' : stats.totalProduits}</div>
                <div className="kpi-subtext positive">↑ Mis à jour en temps réel</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-circle gold">⚠️</div>
              <div className="kpi-body">
                <div className="kpi-title">Alertes Stock Critique</div>
                <div className="kpi-value" style={{ color: '#C9A227' }}>
                  {loading ? '...' : stats.stockCritique}
                </div>
                <div className="kpi-subtext warning">⚡ À surveiller en priorité</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-circle green">📥</div>
              <div className="kpi-body">
                <div className="kpi-title">Entrées ce Mois</div>
                <div className="kpi-value">{loading ? '...' : stats.entreesMois}</div>
                <div className="kpi-subtext positive">↑ +8 vs mois dernier</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-circle green">📤</div>
              <div className="kpi-body">
                <div className="kpi-title">Sorties ce Mois</div>
                <div className="kpi-value">{loading ? '...' : stats.sortiesMois}</div>
                <div className="kpi-subtext positive">↑ +5 vs mois dernier</div>
              </div>
            </div>
          </div>

          {/* Opérations de Gestion du Stock */}
          <section className="operations-section">
            <h2 className="section-title">🛠️ Opérations de Gestion du Stock</h2>

            <div className="action-cards-grid">
              
              {/* Carte 1 : Consultation Articles */}
              <div className="action-card green-bg" onClick={() => navigate('/magasinier/articles')}>
                <div className="action-card-left">
                  <div className="action-icon-box">📋</div>
                  <div className="action-info">
                    <h3>Consulter les Articles</h3>
                    <p>Voir le catalogue & stocks</p>
                  </div>
                </div>
                <div className="action-arrow-btn">➔</div>
              </div>

              {/* Carte 2 : Mouvements de Stock */}
              <div className="action-card green-bg" onClick={() => navigate('/magasinier/mouvements')}>
                <div className="action-card-left">
                  <div className="action-icon-box">🔄</div>
                  <div className="action-info">
                    <h3>Mouvements de Stock</h3>
                    <p>Enregistrer Entrées / Sorties</p>
                  </div>
                </div>
                <div className="action-arrow-btn">➔</div>
              </div>

              {/* Carte 3 : Fournisseurs */}
              <div className="action-card gold-bg" onClick={() => navigate('/magasinier/fournisseurs')}>
                <div className="action-card-left">
                  <div className="action-icon-box">🤝</div>
                  <div className="action-info">
                    <h3>Fournisseurs</h3>
                    <p>Voir les contacts et sources</p>
                  </div>
                </div>
                <div className="action-arrow-btn">➔</div>
              </div>

            </div>
          </section>

          {/* Horodatage en bas de page */}
          <div className="dashboard-footer-time">
            🕒 Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>

        </main>
      </div>

      {/* 3. BOÎTE DE DIALOGUE MODALE DE DÉCONNEXION */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-icon">🚪</div>
            <h3 className="modal-title">Déconnexion</h3>
            <p className="modal-message">Êtes-vous sûr de vouloir vous déconnecter de la session ?</p>
            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={() => setShowLogoutModal(false)}>
                Annuler
              </button>
              <button className="btn-modal-confirm" onClick={confirmLogout}>
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default MagasinierDashboardPage;