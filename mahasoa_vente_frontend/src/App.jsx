import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';

import DashboardPage from './pages/DashboardPage';
import ArticlesPage from './pages/ArticlesPage';
import CategoriesPage from './pages/CategoriesPage';
import MouvementsPage from './pages/MouvementsPage';
import FournisseursPage from './pages/FournisseursPage';
import UtilisateursPage from './pages/UtilisateursPage';

import MagasinierDashboardPage from './pages/MagasinierDashboardPage';
import MagasinierArticlesPage from './pages/MagasinierArticlesPage';
import MagasinierMouvementsPage from './pages/MagasinierMouvementsPage';
import MagasinierFournisseursPage from './pages/MagasinierFournisseursPage';

import './Responsive.css'; 
function lireRole() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? String(user.role || '').toLowerCase() : null;
  } catch {
    return null;
  }
}

// Page réservée aux rôles autorisés ; sinon redirection vers l'espace adapté
const ProtectedRoute = ({ children, roles }) => {
  const role = lireRole();

  if (role === null) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to={role === 'magasinier' ? '/magasinier' : '/'} replace />;
  }

  return children;
};

const ADMIN = ['administrateur', 'admin'];
const MAGASINIER = ['magasinier'];

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Espace administrateur */}
      <Route path="/" element={<ProtectedRoute roles={ADMIN}><DashboardPage /></ProtectedRoute>} />
      <Route path="/articles" element={<ProtectedRoute roles={ADMIN}><ArticlesPage /></ProtectedRoute>} />
      <Route path="/categories" element={<ProtectedRoute roles={ADMIN}><CategoriesPage /></ProtectedRoute>} />
      <Route path="/mouvements" element={<ProtectedRoute roles={ADMIN}><MouvementsPage /></ProtectedRoute>} />
      <Route path="/fournisseurs" element={<ProtectedRoute roles={ADMIN}><FournisseursPage /></ProtectedRoute>} />
      <Route path="/utilisateurs" element={<ProtectedRoute roles={ADMIN}><UtilisateursPage /></ProtectedRoute>} />

      {/* Espace magasinier */}
      <Route path="/magasinier" element={<ProtectedRoute roles={MAGASINIER}><MagasinierDashboardPage /></ProtectedRoute>} />
      <Route path="/magasinier/articles" element={<ProtectedRoute roles={MAGASINIER}><MagasinierArticlesPage /></ProtectedRoute>} />
      <Route path="/magasinier/mouvements" element={<ProtectedRoute roles={MAGASINIER}><MagasinierMouvementsPage /></ProtectedRoute>} />
      <Route path="/magasinier/fournisseurs" element={<ProtectedRoute roles={MAGASINIER}><MagasinierFournisseursPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;