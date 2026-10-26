import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './MagasinierArticles.css';

// Importation du logo
import logoMahasoa from '../assets/logo.png';

function MagasinierArticlesPage() {
  const navigate = useNavigate();

  // États des données
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Champs du formulaire (vides par défaut)
  const [reference, setReference] = useState('');
  const [designation, setDesignation] = useState('');
  const [prixAchat, setPrixAchat] = useState('');
  const [prixVente, setPrixVente] = useState('');
  const [quantite, setQuantite] = useState('');
  const [seuilMinimum, setSeuilMinimum] = useState('');
  const [idCategorie, setIdCategorie] = useState('');
  const [idFournisseur, setIdFournisseur] = useState('');

  // État de recherche
  const [searchTerm, setSearchTerm] = useState('');

  // Modale de déconnexion
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get('articles/'),
      api.get('categories/').catch(() => ({ data: [] })),
      api.get('fournisseurs/').catch(() => ({ data: [] }))
    ])
      .then(([resArticles, resCategories, resFournisseurs]) => {
        const dataArt = Array.isArray(resArticles.data) ? resArticles.data : (resArticles.data?.results || []);
        const dataCat = Array.isArray(resCategories.data) ? resCategories.data : (resCategories.data?.results || []);
        const dataFour = Array.isArray(resFournisseurs.data) ? resFournisseurs.data : (resFournisseurs.data?.results || []);

        setArticles(dataArt);
        setCategories(dataCat);
        setFournisseurs(dataFour);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement données :", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddArticle = (e) => {
    e.preventDefault();

    if (!reference.trim() || !designation.trim()) {
      alert("La référence et la désignation sont obligatoires.");
      return;
    }

    const pAchat = parseFloat(prixAchat);
    const pVente = parseFloat(prixVente);
    const qty = parseInt(quantite, 10);
    const seuil = parseInt(seuilMinimum, 10);

    if (isNaN(pAchat) || pAchat < 0) {
      alert("Prix d'achat invalide.");
      return;
    }
    if (isNaN(pVente) || pVente < 0) {
      alert("Prix de vente invalide.");
      return;
    }
    if (isNaN(qty) || qty < 0) {
      alert("Quantité initiale invalide.");
      return;
    }
    if (isNaN(seuil) || seuil < 0) {
      alert("Seuil minimum invalide.");
      return;
    }
    if (!idCategorie) {
      alert("Veuillez choisir une catégorie.");
      return;
    }
    if (!idFournisseur) {
      alert("Veuillez choisir un fournisseur.");
      return;
    }

    const payload = {
      reference: reference.trim(),
      designation: designation.trim(),
      prix_achat: pAchat,
      prix_vente: pVente,
      quantite: qty,
      seuil_minimum: seuil,
      id_categorie: idCategorie,
      categorie: idCategorie,
      id_fournisseur: idFournisseur,
      fournisseur: idFournisseur
    };

    api.post('articles/', payload)
      .then((res) => {
        setArticles(prev => [...prev, res.data]);
        setReference('');
        setDesignation('');
        setPrixAchat('');
        setPrixVente('');
        setQuantite('');
        setSeuilMinimum('');
        setIdCategorie('');
        setIdFournisseur('');
        alert("Article enregistré avec succès !");
      })
      .catch((err) => {
        console.error("Erreur enregistrement :", err.response?.data || err);
        if (err.response?.data?.reference) {
          alert(`⚠️ La référence "${reference}" existe déjà. Veuillez utiliser une autre référence.`);
        } else {
          alert("Erreur lors de l'enregistrement de l'article.");
        }
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet article ?")) {
      api.delete(`articles/${id}/`)
        .then(() => {
          setArticles(prev => prev.filter(a => (a.id_article || a.id) !== id));
        })
        .catch((err) => {
          console.error("Erreur suppression :", err);
          alert("Erreur lors de la suppression.");
        });
    }
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const filteredArticles = (articles || []).filter((art) => {
    const ref = art.reference || '';
    const des = art.designation || '';
    return ref.toLowerCase().includes(searchTerm.toLowerCase()) || 
           des.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getCategoryName = (art) => {
    if (art.nom_categorie) return art.nom_categorie;
    const cId = art.id_categorie || art.categorie;
    const cat = categories.find(c => (c.id_categorie || c.id) === cId);
    return cat ? (cat.nom_categorie || cat.nom) : 'Général';
  };

  return (
    <div className="magasinier-layout">
      
      {/* SIDEBAR */}
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
            <li className="menu-item active" onClick={() => navigate('/magasinier/articles')}>
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
        </div>

        <div className="sidebar-footer">
          <button className="btn-sidebar-logout" onClick={() => setShowLogoutModal(true)}>
            <span>🚪</span> Déconnexion
          </button>
        </div>
      </aside>

      {/* ZONE PRINCIPALE */}
      <div className="main-content">
        
        <header className="navbar-top">
          <div className="navbar-user-info">
            <div className="user-avatar">M</div>
            <div className="user-details">
              <div className="user-name">Espace Magasinier</div>
              <div className="user-role">Gestionnaire de Stock</div>
            </div>
          </div>
        </header>

        <main className="dashboard-view">

          <div className="page-header">
            <div className="header-icon-box">📦</div>
            <div className="header-title-group">
              <h1>Gestion des Articles</h1>
              <p>Ajoutez, modifiez et gérez vos articles en stock.</p>
            </div>
          </div>

          {/* FORMULAIRE */}
          <div className="custom-card-form">
            <form onSubmit={handleAddArticle}>
              <div className="form-grid-4">
                
                <div className="form-group-custom">
                  <label>Référence</label>
                  <input 
                    type="text" 
                    className="form-control-custom" 
                    value={reference} 
                    onChange={(e) => setReference(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group-custom">
                  <label>Désignation</label>
                  <input 
                    type="text" 
                    className="form-control-custom" 
                    value={designation} 
                    onChange={(e) => setDesignation(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group-custom">
                  <label>Prix Achat (Ar)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-control-custom" 
                    value={prixAchat} 
                    onChange={(e) => setPrixAchat(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group-custom">
                  <label>Prix Vente (Ar)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-control-custom" 
                    value={prixVente} 
                    onChange={(e) => setPrixVente(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group-custom">
                  <label>Quantité Initiale</label>
                  <input 
                    type="number" 
                    className="form-control-custom" 
                    value={quantite} 
                    onChange={(e) => setQuantite(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group-custom">
                  <label>Seuil Minimum</label>
                  <input 
                    type="number" 
                    className="form-control-custom" 
                    value={seuilMinimum} 
                    onChange={(e) => setSeuilMinimum(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group-custom">
                  <label>Catégorie</label>
                  <select 
                    className="form-control-custom" 
                    value={idCategorie} 
                    onChange={(e) => setIdCategorie(e.target.value)} 
                    required
                  >
                    <option value="">-- Choisir --</option>
                    {categories.map((c) => (
                      <option key={c.id_categorie || c.id} value={c.id_categorie || c.id}>
                        {c.nom_categorie || c.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group-custom">
                  <label>Fournisseur</label>
                  <select 
                    className="form-control-custom" 
                    value={idFournisseur} 
                    onChange={(e) => setIdFournisseur(e.target.value)} 
                    required
                  >
                    <option value="">-- Choisir --</option>
                    {fournisseurs.map((f) => (
                      <option key={f.id_fournisseur || f.id} value={f.id_fournisseur || f.id}>
                        {f.nom}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="submit" className="btn-save-article">
                  💾 Enregistrer l'article
                </button>
              </div>
            </form>
          </div>

          {/* TABLEAU DES ARTICLES */}
          <div className="custom-card-table">
            <div className="table-header-bar">
              <h2 className="table-title">Liste des Articles</h2>
              
              <div className="table-filter-group">
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input 
                    type="text" 
                    placeholder="Rechercher..."
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
                    <th>Réf</th>
                    <th>Désignation</th>
                    <th>Catégorie</th>
                    <th>Prix Vente</th>
                    <th>Stock</th>
                    <th>Seuil Min</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="empty-row">Chargement des données...</td>
                    </tr>
                  ) : filteredArticles.length > 0 ? (
                    filteredArticles.map((a) => {
                      const aid = a.id_article || a.id;
                      const isLowStock = (a.quantite || 0) <= (a.seuil_minimum || 0);

                      return (
                        <tr key={aid}>
                          <td style={{ fontWeight: '600' }}>{a.reference}</td>
                          <td>{a.designation}</td>
                          <td>
                            <span className="category-badge">
                              {getCategoryName(a)}
                            </span>
                          </td>
                          <td style={{ fontWeight: '600', color: '#063C2F' }}>
                            {Number(a.prix_vente || 0).toLocaleString('fr-FR')} Ar
                          </td>
                          <td style={{ fontWeight: '700', color: isLowStock ? '#d9534f' : '#0B5D4A' }}>
                            {a.quantite}
                          </td>
                          <td>{a.seuil_minimum}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button 
                              onClick={() => handleDelete(aid)} 
                              className="btn-delete-action"
                              title="Supprimer l'article"
                            >
                              🗑️ Supprimer
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="empty-row">Aucun article enregistré.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer-info">
              Affichage de {filteredArticles.length} sur {articles.length} article(s)
            </div>
          </div>

        </main>
      </div>

      {/* MODAL DÉCONNEXION */}
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

export default MagasinierArticlesPage;