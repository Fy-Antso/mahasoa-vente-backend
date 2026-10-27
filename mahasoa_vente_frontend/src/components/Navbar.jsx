import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg px-4 shadow-sm" style={{ backgroundColor: '#063C2F' }}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Titre et Logo existants */}
        <div className="d-flex align-items-center gap-2">
          <span className="navbar-brand mb-0 h1 fw-bold text-white">
            🛒 MAHASOA VENTE
          </span>
          <span className="text-light small opacity-75 d-none d-md-inline">
            | Espace Gestion & Stock
          </span>
        </div>

        {/* Nouvel élément : Bouton À propos */}
        <div className="d-flex align-items-center">
          <Link
            to="/admin/a-propos"
            className="d-flex align-items-center gap-2 text-decoration-none px-3 py-2 rounded"
            style={{
              color: location.pathname === '/admin/a-propos' ? '#C9A227' : '#FFFFFF',
              backgroundColor: location.pathname === '/admin/a-propos' ? 'rgba(201, 162, 39, 0.15)' : 'transparent',
              fontWeight: '500',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <i className="fas fa-info-circle"></i>
            <span>À propos</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;