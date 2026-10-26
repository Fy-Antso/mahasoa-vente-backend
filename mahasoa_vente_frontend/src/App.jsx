import { Routes, Route, Navigate } from 'react-router-dom';

// Page d'authentification
import LoginPage from './pages/LoginPage';

// Importation des pages existantes (Admin)
import DashboardPage from './pages/DashboardPage';
import ArticlesPage from './pages/ArticlesPage';
import CategoriesPage from './pages/CategoriesPage';
import MouvementsPage from './pages/MouvementsPage';
import FournisseursPage from './pages/FournisseursPage';
import UtilisateursPage from './pages/UtilisateursPage';

// Importation des nouvelles pages dédiées au Magasinier
import MagasinierDashboardPage from './pages/MagasinierDashboardPage';
import MagasinierArticlesPage from './pages/MagasinierArticlesPage';
import MagasinierMouvementsPage from './pages/MagasinierMouvementsPage';
import MagasinierFournisseursPage from './pages/MagasinierFournisseursPage';

// Composant de protection de route
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
      {/* Route de connexion principale */}
      <Route path="/login" element={<LoginPage />} />

      {/* Routes protégées de l'application (sans l'ancienne Sidebar/Navbar englobante) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/articles"
        element={
          <ProtectedRoute>
            <ArticlesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <CategoriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mouvements"
        element={
          <ProtectedRoute>
            <MouvementsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fournisseurs"
        element={
          <ProtectedRoute>
            <FournisseursPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/utilisateurs"
        element={
          <ProtectedRoute>
            <UtilisateursPage />
          </ProtectedRoute>
        }
      />

      {/* Routes pour l'Espace Magasinier */}
      <Route
        path="/magasinier"
        element={
          <ProtectedRoute>
            <MagasinierDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/magasinier/articles"
        element={
          <ProtectedRoute>
            <MagasinierArticlesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/magasinier/mouvements"
        element={
          <ProtectedRoute>
            <MagasinierMouvementsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/magasinier/fournisseurs"
        element={
          <ProtectedRoute>
            <MagasinierFournisseursPage />
          </ProtectedRoute>
        }
      />

      {/* Redirection vers le tableau de bord par défaut si la route n'existe pas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;