import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoMahasoa from '../assets/logo.png';
import { lireUtilisateur } from '../utils/session';
import '../pages/MagasinierDashboard.css';

const LIENS = [
  { cle: 'dashboard', to: '/magasinier', icon: '📊', label: 'Tableau de Bord' },
  { cle: 'articles', to: '/magasinier/articles', icon: '📋', label: 'Articles & Stocks' },
  { cle: 'mouvements', to: '/magasinier/mouvements', icon: '🔄', label: 'Mouvements' },
  { cle: 'fournisseurs', to: '/magasinier/fournisseurs', icon: '🤝', label: 'Fournisseurs' },
];

function MagasinierLayout({ active, children }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const user = lireUtilisateur();
  const nom = user.nom || 'Espace Magasinier';

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const aller = (to) => {
    setMenuOpen(false);
    navigate(to);
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="magasinier-layout">
      {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />}

      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-top-content">
          <button type="button" className="sidebar-close" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu">✕</button>

          <div className="sidebar-brand">
            <img src={logoMahasoa} alt="MAHASOA VENTE Logo" className="sidebar-logo" />
            <div className="brand-text">
              <h2>MAHASOA VENTE</h2>
              <span className="role-badge">magasinier</span>
            </div>
          </div>

          <ul className="sidebar-menu">
            {LIENS.map((l) => (
              <li
                key={l.cle}
                className={`menu-item ${active === l.cle ? 'active' : ''}`}
                onClick={() => aller(l.to)}
              >
                <span className="menu-icon">{l.icon}</span>
                <span>{l.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-footer">
          <button className="btn-sidebar-logout" onClick={() => { setMenuOpen(false); setShowLogoutModal(true); }}>
            <span>🚪</span> Déconnexion
          </button>
        </div>
      </aside>

      <div className="main-content">
        <header className="navbar-top">
          <button type="button" className="btn-icon-menu" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu">☰</button>
          <div className="navbar-user-info">
            <div className="user-avatar">{nom.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <div className="user-name">{nom}</div>
              <div className="user-role">Gestionnaire de Stock</div>
            </div>
          </div>
        </header>

        <main className="dashboard-view">{children}</main>
      </div>

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-icon">🚪</div>
            <h3 className="modal-title">Déconnexion</h3>
            <p className="modal-message">Êtes-vous sûr de vouloir vous déconnecter de la session ?</p>
            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={() => setShowLogoutModal(false)}>Non</button>
              <button className="btn-modal-confirm" onClick={confirmLogout}>Oui</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MagasinierLayout;