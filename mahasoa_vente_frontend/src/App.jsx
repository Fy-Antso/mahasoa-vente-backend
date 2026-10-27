import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import AdminLayout from './Layouts/AdminLayout';

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

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Espace administrateur : un seul layout responsive */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/mouvements" element={<MouvementsPage />} />
        <Route path="/fournisseurs" element={<FournisseursPage />} />
        <Route path="/utilisateurs" element={<UtilisateursPage />} />
      </Route>

      {/* Espace magasinier */}
      <Route path="/magasinier" element={<ProtectedRoute><MagasinierDashboardPage /></ProtectedRoute>} />
      <Route path="/magasinier/articles" element={<ProtectedRoute><MagasinierArticlesPage /></ProtectedRoute>} />
      <Route path="/magasinier/mouvements" element={<ProtectedRoute><MagasinierMouvementsPage /></ProtectedRoute>} />
      <Route path="/magasinier/fournisseurs" element={<ProtectedRoute><MagasinierFournisseursPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;