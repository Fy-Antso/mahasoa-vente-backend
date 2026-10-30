import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import BarreRecherche from '../components/BarreRecherche';
import { correspond } from '../utils/recherche';
import './Articles.css';

function ArticlesPage() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState('');

  // Gestion du mode édition
  const [editingId, setEditingId] = useState(null);

  // Champs de l'article selon le MPD
  const [reference, setReference] = useState('');
  const [designation, setDesignation] = useState('');
  const [prixAchat, setPrixAchat] = useState('');
  const [prixVente, setPrixVente] = useState('');
  const [quantite, setQuantite] = useState('');
  const [seuilMinimum, setSeuilMinimum] = useState('');
  const [idCategorie, setIdCategorie] = useState('');
  const [idFournisseur, setIdFournisseur] = useState('');

  const fetchData = () => {
    Promise.all([
      api.get('articles/'),
      api.get('categories/'),
      api.get('fournisseurs/')
    ])
      .then(([resArticles, resCategories, resFournisseurs]) => {
        setArticles(resArticles.data);
        setCategories(resCategories.data);
        setFournisseurs(resFournisseurs.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveArticle = (e) => {
    e.preventDefault();

    const payload = {
      reference,
      designation,
      prix_achat: parseFloat(prixAchat),
      prix_vente: parseFloat(prixVente),
      quantite: parseInt(quantite),
      seuil_minimum: parseInt(seuilMinimum),
      id_categorie: idCategorie,
      id_fournisseur: idFournisseur
    };

    if (editingId) {
      // Modification (PUT)
      api.put(`articles/${editingId}/`, payload)
        .then((res) => {
          setArticles(articles.map(a => (a.id_article === editingId || a.id === editingId) ? res.data : a));
          resetForm();
        })
        .catch((err) => {
          console.error("Erreur lors de la modification de l'article :", err.response?.data || err);
          alert("Erreur lors de la modification. Vérifiez les champs.");
        });
    } else {
      // Ajout (POST)
      api.post('articles/', payload)
        .then((res) => {
          setArticles([...articles, res.data]);
          resetForm();
        })
        .catch((err) => {
          console.error("Erreur lors de l'ajout d'article :", err.response?.data || err);
          alert("Erreur lors de l'enregistrement. Vérifiez que la catégorie et le fournisseur sont bien sélectionnés.");
        });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setReference('');
    setDesignation('');
    setPrixAchat('');
    setPrixVente('');
    setQuantite('');
    setSeuilMinimum('');
    setIdCategorie('');
    setIdFournisseur('');
  };

  const handleEditClick = (article) => {
    const articleId = article.id_article || article.id;
    setEditingId(articleId);
    setReference(article.reference || '');
    setDesignation(article.designation || '');
    setPrixAchat(article.prix_achat || '');
    setPrixVente(article.prix_vente || '');
    setQuantite(article.quantite !== undefined ? article.quantite : '');
    setSeuilMinimum(article.seuil_minimum !== undefined ? article.seuil_minimum : '');
    setIdCategorie(article.id_categorie || article.categorie || '');
    setIdFournisseur(article.id_fournisseur || article.fournisseur || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet article ?")) {
      api.delete(`articles/${id}/`)
        .then(() => {
          setArticles(articles.filter(a => (a.id_article !== id && a.id !== id)));
        })
        .catch((err) => {
          console.error("Erreur lors de la suppression :", err);
          alert("Erreur lors de la suppression de l'article.");
        });
    }
  };

  // Filtrage de la recherche (n'affecte pas les données d'origine)
  const articlesFiltres = articles.filter((a) =>
    correspond(
      [a.reference, a.designation, a.nom_categorie, a.nom_fournisseur, a.prix_vente, a.quantite, a.seuil_minimum],
      recherche
    )
  );

  return (
    <div className="articles-container">
      {/* BOUTON RETOUR TABLEAU DE BORD */}
      <button className="btn-back" onClick={() => navigate('/')}>
        ← Retour
      </button>

      {/* EN-TÊTE DE LA PAGE */}
      <div className="page-title-section">
        <div className="title-icon-wrapper">
          📦
        </div>
        <div className="title-text-group">
          <h1>Gestion des Articles</h1>
          <div className="title-underline"></div>
        </div>
      </div>

      {/* FORMULAIRE D'AJOUT / MODIFICATION D'ARTICLE */}
      <div className="custom-card">
        <div className="card-header-custom">
          <span>{editingId ? '✏️' : '⊕'}</span>
          <span>{editingId ? "Modifier l'article" : 'Ajouter un nouvel article'}</span>
        </div>

        <div className="card-body-custom">
          <form onSubmit={handleSaveArticle}>
            <div className="form-grid">
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
                <label>Désignation / Nom</label>
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
                <label>Quantité initiale</label>
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
                  <option value="">-- Catégorie --</option>
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
                  <option value="">-- Fournisseur --</option>
                  {fournisseurs.map((f) => (
                    <option key={f.id_fournisseur || f.id} value={f.id_fournisseur || f.id}>
                      {f.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-actions" style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
              <button type="submit" className="btn-submit">
                {editingId ? '💾 Mettre à jour' : '💾 Enregistrer le produit'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-cancel"
                  style={{ backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* LISTE DES ARTICLES */}
      <div className="custom-card">
        <div className="card-header-light">
          <div className="page-title-section" style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.25rem' }}>📋</span>
            <div className="title-text-group">
              <h2 className="header-title-underline">Liste des articles enregistrés</h2>
              <div className="title-underline"></div>
            </div>
          </div>
        </div>

        <BarreRecherche
          valeur={recherche}
          onChange={setRecherche}
          placeholder="Rechercher un article (référence, nom, catégorie, fournisseur...)"
          total={articles.length}
          affiches={articlesFiltres.length}
        />

        <div className="table-responsive-custom">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Réf</th>
                <th>Désignation</th>
                <th>Prix Vente</th>
                <th>Stock</th>
                <th>Seuil Min</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="empty-state">
                    Chargement des données...
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-state">
                    <svg className="empty-icon-box" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div>Aucune donnée trouvée dans la base de données.</div>
                  </td>
                </tr>
              ) : articlesFiltres.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-state">
                    Aucun article ne correspond à « {recherche} ».
                  </td>
                </tr>
              ) : (
                articlesFiltres.map((a) => {
                  const articleId = a.id_article || a.id;
                  return (
                    <tr key={articleId}>
                      <td>{a.reference}</td>
                      <td>{a.designation}</td>
                      <td>{a.prix_vente} Ar</td>
                      <td>{a.quantite}</td>
                      <td>{a.seuil_minimum}</td>
                      <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => handleEditClick(a)}
                          style={{ backgroundColor: '#f0ad4e', color: '#fff', border: 'none', padding: '6px 12px', marginRight: '6px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteClick(articleId)}
                          style={{ backgroundColor: '#d9534f', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ArticlesPage;