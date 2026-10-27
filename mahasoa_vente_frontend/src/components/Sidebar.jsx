import { Link, useLocation, useNavigate } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Récupération des infos utilisateur et du rôle
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = (localStorage.getItem('role') || user.role || '').toLowerCase();

  const isMagasinier = role === 'magasinier';

  // Définition dynamique des menus selon le rôle
  const menuItems = isMagasinier
    ? [
        { path: '/magasinier', label: '📊 Tableau de Bord' },
        { path: '/magasinier/articles', label: '📦 Articles / Produits' },
        { path: '/magasinier/mouvements', label: '🔄 Mouvements Stock' },
        { path: '/magasinier/fournisseurs', label: '🚚 Fournisseurs' },
      ]
    : [
        { path: '/', label: '📊 Tableau de Bord' },
        { path: '/articles', label: '📦 Articles / Produits' },
        { path: '/categories', label: '🏷️ Catégories' },
        { path: '/mouvements', label: '🔄 Mouvements Stock' },
        { path: '/fournisseurs', label: '🚚 Fournisseurs' },
        { path: '/utilisateurs', label: '👥 Utilisateurs' },
        { path: '/admin/a-propos', label: 'ℹ️ À propos' },
      ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="bg-dark text-white p-3 min-vh-100 d-flex flex-column" style={{ width: '240px' }}>
      <h4 className="fw-bold text-center text-primary mb-2">MAHASOA VENTE</h4>
      
      {/* Badge affichant le rôle actif */}
      <div className="text-center mb-3">
        <span className={`badge ${isMagasinier ? 'bg-warning text-dark' : 'bg-info text-dark'} text-uppercase`}>
          {role || 'INVENTAIRE'}
        </span>
      </div>

      <hr className="bg-secondary" />

      {/* Navigation principale */}
      <ul className="nav nav-pills flex-column mb-auto">
        {menuItems.map((item) => (
          <li className="nav-item mb-2" key={item.path}>
            <Link
              to={item.path}
              className={`nav-link text-white ${location.pathname === item.path ? 'active bg-primary' : ''}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <hr className="bg-secondary" />

      {/* Bouton de Déconnexion */}
      <button onClick={handleLogout} className="btn btn-outline-danger w-100 mt-2">
        🚪 Déconnexion
      </button>
    </div>
  );
}

export default Sidebar;