import { useEffect, useState } from 'react';
import api from '../api/axios';
import MagasinierLayout from '../Layouts/MagasinierLayout';
import './MagasinierArticles.css';

const liste = (data) => (Array.isArray(data) ? data : data?.results || []);

function MagasinierArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reference, setReference] = useState('');
  const [designation, setDesignation] = useState('');
  const [prixAchat, setPrixAchat] = useState('');
  const [prixVente, setPrixVente] = useState('');
  const [quantite, setQuantite] = useState('');
  const [seuilMinimum, setSeuilMinimum] = useState('');
  const [idCategorie, setIdCategorie] = useState('');
  const [idFournisseur, setIdFournisseur] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get('articles/'),
      api.get('categories/').catch(() => ({ data: [] })),
      api.get('fournisseurs/').catch(() => ({ data: [] })),
    ])
      .then(([resArticles, resCategories, resFournisseurs]) => {
        setArticles(liste(resArticles.data));
        setCategories(liste(resCategories.data));
        setFournisseurs(liste(resFournisseurs.data));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur chargement données :', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setReference(''); setDesignation(''); setPrixAchat(''); setPrixVente('');
    setQuantite(''); setSeuilMinimum(''); setIdCategorie(''); setIdFournisseur('');
  };

  const handleAddArticle = (e) => {
    e.preventDefault();

    if (!reference.trim() || !designation.trim()) {
      alert('La référence et la désignation sont obligatoires.');
      return;
    }

    const pAchat = parseFloat(prixAchat);
    const pVente = parseFloat(prixVente);
    const qty = parseInt(quantite, 10);
    const seuil = parseInt(seuilMinimum, 10);

    if (isNaN(pAchat) || pAchat < 0) { alert("Prix d'achat invalide."); return; }
    if (isNaN(pVente) || pVente < 0) { alert('Prix de vente invalide.'); return; }
    if (isNaN(qty) || qty < 0) { alert('Quantité initiale invalide.'); return; }
    if (isNaN(seuil) || seuil < 0) { alert('Seuil minimum invalide.'); return; }
    if (!idCategorie) { alert('Veuillez choisir une catégorie.'); return; }
    if (!idFournisseur) { alert('Veuillez choisir un fournisseur.'); return; }

    const payload = {
      reference: reference.trim(),
      designation: designation.trim(),
      prix_achat: pAchat,
      prix_vente: pVente,
      quantite: qty,
      seuil_minimum: seuil,
      id_categorie: idCategorie,
      id_fournisseur: idFournisseur,
    };

    api.post('articles/', payload)
      .then((res) => {
        setArticles((prev) => [...prev, res.data]);
        resetForm();
        alert('Article enregistré avec succès !');
      })
      .catch((err) => {
        console.error('Erreur enregistrement :', err.response?.data || err);
        if (err.response?.data?.reference) {
          alert(`⚠️ La référence "${reference}" existe déjà. Veuillez utiliser une autre référence.`);
        } else {
          alert("Erreur lors de l'enregistrement de l'article.");
        }
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet article ?')) {
      api.delete(`articles/${id}/`)
        .then(() => setArticles((prev) => prev.filter((a) => (a.id_article || a.id) !== id)))
        .catch((err) => {
          console.error('Erreur suppression :', err);
          alert('Erreur lors de la suppression.');
        });
    }
  };

  const term = searchTerm.toLowerCase();
  const filteredArticles = articles.filter(
    (art) =>
      (art.reference || '').toLowerCase().includes(term) ||
      (art.designation || '').toLowerCase().includes(term)
  );

  const getCategoryName = (art) => {
    if (art.nom_categorie) return art.nom_categorie;
    const cId = art.id_categorie || art.categorie;
    const cat = categories.find((c) => (c.id_categorie || c.id) === cId);
    return cat ? cat.nom_categorie || cat.nom : 'Général';
  };

  return (
    <MagasinierLayout active="articles">
      <div className="page-header">
        <div className="header-icon-box">📦</div>
        <div className="header-title-group">
          <h1>Gestion des Articles</h1>
          <p>Ajoutez, modifiez et gérez vos articles en stock.</p>
        </div>
      </div>

      <div className="custom-card-form form-articles">
        <form onSubmit={handleAddArticle}>
          <div className="form-grid-4">
            <div className="form-group-custom">
              <label>Référence</label>
              <input type="text" className="form-control-custom" value={reference} onChange={(e) => setReference(e.target.value)} required />
            </div>
            <div className="form-group-custom">
              <label>Désignation</label>
              <input type="text" className="form-control-custom" value={designation} onChange={(e) => setDesignation(e.target.value)} required />
            </div>
            <div className="form-group-custom">
              <label>Prix Achat (Ar)</label>
              <input type="number" step="0.01" className="form-control-custom" value={prixAchat} onChange={(e) => setPrixAchat(e.target.value)} required />
            </div>
            <div className="form-group-custom">
              <label>Prix Vente (Ar)</label>
              <input type="number" step="0.01" className="form-control-custom" value={prixVente} onChange={(e) => setPrixVente(e.target.value)} required />
            </div>
            <div className="form-group-custom">
              <label>Quantité Initiale</label>
              <input type="number" className="form-control-custom" value={quantite} onChange={(e) => setQuantite(e.target.value)} required />
            </div>
            <div className="form-group-custom">
              <label>Seuil Minimum</label>
              <input type="number" className="form-control-custom" value={seuilMinimum} onChange={(e) => setSeuilMinimum(e.target.value)} required />
            </div>
            <div className="form-group-custom">
              <label>Catégorie</label>
              <select className="form-control-custom" value={idCategorie} onChange={(e) => setIdCategorie(e.target.value)} required>
                <option value="">-- Choisir --</option>
                {categories.map((c) => (
                  <option key={c.id_categorie || c.id} value={c.id_categorie || c.id}>{c.nom_categorie || c.nom}</option>
                ))}
              </select>
            </div>
            <div className="form-group-custom">
              <label>Fournisseur</label>
              <select className="form-control-custom" value={idFournisseur} onChange={(e) => setIdFournisseur(e.target.value)} required>
                <option value="">-- Choisir --</option>
                {fournisseurs.map((f) => (
                  <option key={f.id_fournisseur || f.id} value={f.id_fournisseur || f.id}>{f.nom}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions-bar">
            <button type="submit" className="btn-save-article">💾 Enregistrer l'article</button>
          </div>
        </form>
      </div>

      <div className="custom-card-table">
        <div className="table-header-bar">
          <h2 className="table-title">Liste des Articles</h2>
          <div className="table-filter-group">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                <th className="col-centre">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="empty-row">Chargement des données...</td></tr>
              ) : filteredArticles.length > 0 ? (
                filteredArticles.map((a) => {
                  const aid = a.id_article || a.id;
                  const isLowStock = (a.quantite || 0) <= (a.seuil_minimum || 0);
                  return (
                    <tr key={aid}>
                      <td className="cell-gras">{a.reference}</td>
                      <td>{a.designation}</td>
                      <td><span className="category-badge">{getCategoryName(a)}</span></td>
                      <td className="cell-gras cell-vert">{Number(a.prix_vente || 0).toLocaleString('fr-FR')} Ar</td>
                      <td className={`cell-gras ${isLowStock ? 'cell-rouge' : 'cell-vert-clair'}`}>{a.quantite}</td>
                      <td>{a.seuil_minimum}</td>
                      <td className="col-centre">
                        <button onClick={() => handleDelete(aid)} className="btn-delete-action" title="Supprimer l'article">🗑️ Supprimer</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="7" className="empty-row">Aucun article enregistré.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer-info">
          Affichage de {filteredArticles.length} sur {articles.length} article(s)
        </div>
      </div>
    </MagasinierLayout>
  );
}

export default MagasinierArticlesPage;