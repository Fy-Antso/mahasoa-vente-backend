import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import MagasinierLayout from '../Layouts/MagasinierLayout';
import { estEntree } from '../utils/session';
import './MagasinierDashboard.css';

function MagasinierDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalProduits: 0, stockCritique: 0, entreesMois: 0, sortiesMois: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('articles/'),
      api.get('mouvements/').catch(() => ({ data: [] })),
    ])
      .then(([resArticles, resMouvements]) => {
        const articles = Array.isArray(resArticles.data) ? resArticles.data : [];
        const mouvements = Array.isArray(resMouvements.data) ? resMouvements.data : [];

        const maintenant = new Date();
        const duMois = (m) => {
          const d = new Date(m.date);
          return !isNaN(d) && d.getMonth() === maintenant.getMonth() && d.getFullYear() === maintenant.getFullYear();
        };
        const mouvementsMois = mouvements.filter(duMois);

        setStats({
          totalProduits: articles.length,
          stockCritique: articles.filter((a) => Number(a.quantite || 0) <= Number(a.seuil_minimum || 0)).length,
          entreesMois: mouvementsMois.filter((m) => estEntree(m.type)).length,
          sortiesMois: mouvementsMois.filter((m) => !estEntree(m.type)).length,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des statistiques du stock :', err);
        setLoading(false);
      });
  }, []);

  return (
    <MagasinierLayout active="dashboard">
      <div className="page-header">
        <div className="header-icon-box">📊</div>
        <div className="header-title-group">
          <h1>Tableau de Bord - Magasinier</h1>
          <p>Vue d'ensemble de la gestion du stock et des opérations quotidiennes</p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-circle green">📦</div>
          <div className="kpi-body">
            <div className="kpi-title">Total Produits en Stock</div>
            <div className="kpi-value">{loading ? '...' : stats.totalProduits}</div>
            <div className="kpi-subtext positive">Mis à jour en temps réel</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-circle gold">⚠️</div>
          <div className="kpi-body">
            <div className="kpi-title">Alertes Stock Critique</div>
            <div className="kpi-value kpi-value-alerte">{loading ? '...' : stats.stockCritique}</div>
            <div className="kpi-subtext warning">À surveiller en priorité</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-circle green">📥</div>
          <div className="kpi-body">
            <div className="kpi-title">Entrées ce Mois</div>
            <div className="kpi-value">{loading ? '...' : stats.entreesMois}</div>
            <div className="kpi-subtext positive">Mouvements enregistrés</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-circle green">📤</div>
          <div className="kpi-body">
            <div className="kpi-title">Sorties ce Mois</div>
            <div className="kpi-value">{loading ? '...' : stats.sortiesMois}</div>
            <div className="kpi-subtext positive">Mouvements enregistrés</div>
          </div>
        </div>
      </div>

      <section className="operations-section">
        <h2 className="section-title">🛠️ Opérations de Gestion du Stock</h2>

        <div className="action-cards-grid">
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

      <div className="dashboard-footer-time">
        🕒 Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
      </div>
    </MagasinierLayout>
  );
}

export default MagasinierDashboardPage;