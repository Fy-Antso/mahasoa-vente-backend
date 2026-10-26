import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './MagasinierMouvements.css';

// Importation du logo officiel de MAHASOA VENTE
import logoMahasoa from '../assets/logo.png';

function MagasinierMouvementsPage() {
  const navigate = useNavigate();

  // États des données
  const [mouvements, setMouvements] = useState([]);
  const [articles, setArticles] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Champs du formulaire Mouvement
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('ENTREE');
  const [quantite, setQuantite] = useState('');
  const [motif, setMotif] = useState('');
  const [idArticle, setIdArticle] = useState('');
  const [idUtilisateur, setIdUtilisateur] = useState('');

  // Barre de recherche dans l'historique
  const [searchTerm, setSearchTerm] = useState('');

  // État pour la boîte de dialogue modale de déconnexion
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get('mouvements/').catch(() => ({ data: [] })),
      api.get('articles/').catch(() => ({ data: [] })),
      api.get('utilisateurs/').catch(() => ({ data: [] }))
    ])
      .then(([resMouvements, resArticles, resUtilisateurs]) => {
        const dataMouv = Array.isArray(resMouvements.data) ? resMouvements.data : (resMouvements.data?.results || []);
        const dataArt = Array.isArray(resArticles.data) ? resArticles.data : (resArticles.data?.results || []);
        const dataUtil = Array.isArray(resUtilisateurs.data) ? resUtilisateurs.data : (resUtilisateurs.data?.results || []);

        setMouvements(dataMouv);
        setArticles(dataArt);
        setUtilisateurs(dataUtil);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des données :", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Validation et enregistrement du mouvement avec contrôles logiques
  const handleAdd = (e) => {
    e.preventDefault();

    const qtyNum = parseInt(quantite, 10);

    if (!idArticle) {
      alert("Veuillez sélectionner un article.");
      return;
    }
    if (!idUtilisateur) {
      alert("Veuillez sélectionner l'utilisateur (magasinier).");
      return;
    }
    if (isNaN(qtyNum) || qtyNum <= 0) {
      alert("La quantité doit être supérieure à 0.");
      return;
    }

    // Vérification du stock disponible si c'est une SORTIE
    const selectedArticle = articles.find(a => String(a.id_article || a.id) === String(idArticle));
    if (type === 'SORTIE' && selectedArticle) {
      const stockActuel = selectedArticle.quantite || 0;
      if (qtyNum > stockActuel) {
        alert(`Stock insuffisant ! Le stock actuel pour "${selectedArticle.designation}" est de ${stockActuel} unité(s).`);
        return;
      }
    }

    const payload = {
      date,
      type,
      quantite: qtyNum,
      motif: motif.trim(),
      id_article: idArticle,
      article: idArticle,
      id_utilisateur: idUtilisateur,
      utilisateur: idUtilisateur
    };

    api.post('mouvements/', payload)
      .then((res) => {
        setMouvements(prev => [res.data, ...prev]);

        // Mise à jour locale du stock de l'article concerné
        if (selectedArticle) {
          const delta = type === 'ENTREE' ? qtyNum : -qtyNum;
          setArticles(prevArts => prevArts.map(art => {
            if (String(art.id_article || art.id) === String(idArticle)) {
              return { ...art, quantite: (art.quantite || 0) + delta };
            }
            return art;
          }));
        }

        // Réinitialisation du formulaire
        setQuantite('');
        setMotif('');
        setIdArticle('');
        setIdUtilisateur('');
        alert("Mouvement enregistré avec succès !");
      })
      .catch((err) => {
        console.error("Erreur lors de l'enregistrement :", err.response?.data || err);
        alert("Erreur lors de l'enregistrement du mouvement.");
      });
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Filtrage dynamique des mouvements
  const filteredMouvements = (mouvements || []).filter((m) => {
    const artObj = articles.find(a => String(a.id_article || a.id) === String(m.id_article || m.article));
    const artDesignation = artObj ? artObj.designation : (m.nom_article || '');
    const motifTxt = m.motif || '';
    const typeTxt = m.type || m.type_mouvement || '';

    const term = searchTerm.toLowerCase();
    return artDesignation.toLowerCase().includes(term) ||
           motifTxt.toLowerCase().includes(term) ||
           typeTxt.toLowerCase().includes(term);
  });

  const getArticleName = (m) => {
    if (m.nom_article) return m.nom_article;
    const art = articles.find(a => String(a.id_article || a.id) === String(m.id_article || m.article));
    return art ? art.designation : 'Article inconnu';
  };

  const getUserName = (m) => {
    if (m.nom_utilisateur) return m.nom_utilisateur;
    const u = utilisateurs.find(usr => String(usr.id_utilisateur || usr.id) === String(m.id_utilisateur || m.utilisateur));
    return u ? `${u.prenom || ''} ${u.nom || ''}`.trim() || u.username : 'Magasinier';
  };

  return (
    <div className="magasinier-layout">

      {/* 1. SIDEBAR FIXÉE À GAUCHE (Harmonisée avec l'Administrateur) */}
      <aside className="sidebar">
        <div className="sidebar-top-content">
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

          <ul className="sidebar-menu">
            <li className="menu-item" onClick={() => navigate('/magasinier')}>
              <span className="menu-icon">📊</span>
              <span>Tableau de Bord</span>
            </li>
            <li className="menu-item" onClick={() => navigate('/magasinier/articles')}>
              <span className="menu-icon">📋</span>
              <span>Articles & Stocks</span>
            </li>
            <li className="menu-item active" onClick={() => navigate('/magasinier/mouvements')}>
              <span className="menu-icon">🔄</span>
              <span>Mouvements</span>
            </li>
            <li className="menu-item" onClick={() => navigate('/magasinier/fournisseurs')}>
              <span className="menu-icon">🤝</span>
              <span>Fournisseurs</span>
            </li>
          </ul>
        </div>

        {/* Bouton Déconnexion ancré en bas */}
        <div className="sidebar-footer">
          <button className="btn-sidebar-logout" onClick={() => setShowLogoutModal(true)}>
            <span>🚪</span> Déconnexion
          </button>
        </div>
      </aside>

      {/* 2. ZONE PRINCIPALE */}
      <div className="main-content">

        {/* NAVBAR SUPÉRIEURE */}
        <header className="navbar-top">
          <div className="navbar-user-info">
            <div className="user-avatar">M</div>
            <div className="user-details">
              <div className="user-name">Espace Magasinier</div>
              <div className="user-role">Gestionnaire de Stock</div>
            </div>
          </div>
        </header>

        {/* CONTENU PRINCIPAL */}
        <main className="dashboard-view">

          <div className="page-header">
            <div className="header-icon-box">🔄</div>
            <div className="header-title-group">
              <h1>Enregistrer un Mouvement (Entrée / Sortie)</h1>
              <p>Enregistrez les entrées ou sorties de stock.</p>
            </div>
          </div>

          {/* FORMULAIRE NOUVEAU MOUVEMENT */}
          <div className="custom-card-form" style={{ marginBottom: '2rem' }}>
            <div className="form-card-header">
              <span>🔄</span> Nouveau Mouvement de Stock
            </div>

            <form onSubmit={handleAdd}>
              <div className="form-grid-3" style={{ padding: '1.5rem' }}>

                <div className="form-group-custom">
                  <label className="form-label">Date</label>
                  <input 
                    type="date" 
                    className="form-control-custom" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group-custom">
                  <label className="form-label">Type de Mouvement</label>
                  <select 
                    className="form-control-custom" 
                    value={type} 
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="ENTREE">ENTREE (+)</option>
                    <option value="SORTIE">SORTIE (-)</option>
                  </select>
                </div>

                <div className="form-group-custom">
                  <label className="form-label">Quantité</label>
                  <input 
                    type="number" 
                    min="1"
                    className="form-control-custom" 
                    value={quantite} 
                    onChange={(e) => setQuantite(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group-custom">
                  <label className="form-label">Motif</label>
                  <input 
                    type="text" 
                    className="form-control-custom" 
                    value={motif} 
                    onChange={(e) => setMotif(e.target.value)} 
                    placeholder="Ex: Réception fournisseur / Vente" 
                  />
                </div>

                <div className="form-group-custom">
                  <label className="form-label">Article</label>
                  <select 
                    className="form-control-custom" 
                    value={idArticle} 
                    onChange={(e) => setIdArticle(e.target.value)} 
                    required
                  >
                    <option value="">-- Sélectionner un article --</option>
                    {articles.map((a) => (
                      <option key={a.id_article || a.id} value={a.id_article || a.id}>
                        {a.reference} - {a.designation} (Stock: {a.quantite || 0})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group-custom">
                  <label className="form-label">Utilisateur (Magasinier)</label>
                  <select 
                    className="form-control-custom" 
                    value={idUtilisateur} 
                    onChange={(e) => setIdUtilisateur(e.target.value)} 
                    required
                  >
                    <option value="">-- Sélectionner l'utilisateur --</option>
                    {utilisateurs.map((u) => (
                      <option key={u.id_utilisateur || u.id} value={u.id_utilisateur || u.id}>
                        {u.nom || u.username}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 1.5rem 1.5rem 0' }}>
                <button type="submit" className="btn-save-mouvement">
                  ✔ Valider le mouvement
                </button>
              </div>
            </form>
          </div>

          {/* HISTORIQUE DES MOUVEMENTS */}
          <div className="custom-card-table">
            <div className="table-header-bar">
              <h2 className="table-title">Historique des Mouvements</h2>

              <div className="table-filter-group">
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input 
                    type="text" 
                    placeholder="Rechercher un mouvement..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Article</th>
                    <th>Quantité</th>
                    <th>Motif</th>
                    <th>Utilisateur</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="empty-row">Chargement des données...</td>
                    </tr>
                  ) : filteredMouvements.length > 0 ? (
                    filteredMouvements.map((m) => {
                      const mId = m.id_mouvement || m.id;
                      const mouvementType = m.type || m.type_mouvement;
                      const isEntree = mouvementType === 'ENTREE';

                      return (
                        <tr key={mId}>
                          <td style={{ fontWeight: '600' }}>#{mId}</td>
                          <td>{m.date || m.date_mouvement}</td>
                          <td>
                            <span className={`type-badge ${isEntree ? 'badge-entree' : 'badge-sortie'}`}>
                              {isEntree ? 'ENTREES (+)' : 'SORTIE (-)'}
                            </span>
                          </td>
                          <td style={{ fontWeight: '500' }}>{getArticleName(m)}</td>
                          <td style={{ fontWeight: '700', color: isEntree ? '#0B5D4A' : '#d9534f' }}>
                            {isEntree ? `+${m.quantite}` : `-${m.quantite}`}
                          </td>
                          <td>{m.motif || '-'}</td>
                          <td>{getUserName(m)}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="empty-row">Aucun mouvement enregistré.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer-info">
              Affichage de {filteredMouvements.length} sur {mouvements.length} mouvement(s)
            </div>
          </div>

        </main>
      </div>

      {/* 3. MODAL DE DÉCONNEXION */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-icon">🚪</div>
            <h3 className="modal-title">Déconnexion</h3>
            <p className="modal-message">Êtes-vous sûr de vouloir vous déconnecter de la session ?</p>
            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={() => setShowLogoutModal(false)}>
                Non
              </button>
              <button className="btn-modal-confirm" onClick={confirmLogout}>
                Oui
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default MagasinierMouvementsPage;