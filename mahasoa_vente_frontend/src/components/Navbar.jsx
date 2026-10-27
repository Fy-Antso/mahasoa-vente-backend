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
      </div>
    </nav>
  );
}

export default Navbar;