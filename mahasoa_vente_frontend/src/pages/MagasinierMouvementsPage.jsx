import { useEffect, useState } from 'react';
import api from '../api/axios';
import MagasinierLayout from '../Layouts/MagasinierLayout';
import { lireUtilisateur, estEntree } from '../utils/session';
import './MagasinierMouvements.css';

const liste = (data) => (Array.isArray(data) ? data : data?.results || []);
const aujourdhui = () => new Date().toISOString().split('T')[0];

function MagasinierMouvementsPage() {
  const utilisateurConnecte = lireUtilisateur();
  const idParDefaut = utilisateurConnecte.id ? String(utilisateurConnecte.id) : '';

  const [mouvements, setMouvements] = useState([]);
  const [articles, setArticles] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState(aujourdhui());
  const [type, setType] = useState('ENTREE');
  const [quantite, setQuantite] = useState('');
  const [motif, setMotif] = useState('');
  const [idArticle, setIdArticle] = useState('');
  const [idUtilisateur, setIdUtilisateur] = useState(idParDefaut);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get('mouvements/').catch(() => ({ data: [] })),
      api.get('articles/').catch(() => ({ data: [] })),
      api.get('utilisateurs/').catch(() => ({ data: [] })),
    ])
      .then(([resMouvements, resArticles, resUtilisateurs]) => {
        setMouvements(liste(resMouvements.data));
        setArticles(liste(resArticles.data));
        setUtilisateurs(liste(resUtilisateurs.data));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des données :', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    const qtyNum = parseInt(quantite, 10);

    if (!idArticle) { alert('Veuillez sélectionner un article.'); return; }
    if (!idUtilisateur) { alert("Veuillez sélectionner l'utilisateur (magasinier)."); return; }
    if (isNaN(qtyNum) || qtyNum <= 0) { alert('La quantité doit être supérieure à 0.'); return; }

    const selectedArticle = articles.find((a) => String(a.id_article || a.id) === String(idArticle));
    if (type === 'SORTIE' && selectedArticle) {
      const stockActuel = selectedArticle.quantite || 0;
      if (qtyNum > stockActuel) {
        alert(`Stock insuffisant ! Le stock actuel pour "${selectedArticle.designation}" est de ${stockActuel} unité(s).`);
        return;
      }
    }

    const payload = {
      type: type === 'ENTREE' ? 'Entree' : 'Sortie', // valeurs acceptées par le modèle Django
      quantite: qtyNum,
      motif: motif.trim(),
      id_article: idArticle,
      id_utilisateur: idUtilisateur,
    };

    api.post('mouvements/', payload)
      .then((res) => {
        setMouvements((prev) => [res.data, ...prev]);
        if (selectedArticle) {
          const delta = type === 'ENTREE' ? qtyNum : -qtyNum;
          setArticles((prev) =>
            prev.map((art) =>
              String(art.id_article || art.id) === String(idArticle)
                ? { ...art, quantite: (art.quantite || 0) + delta }
                : art
            )
          );
        }
        setDate(aujourdhui());
        setQuantite('');
        setMotif('');
        setIdArticle('');
        setIdUtilisateur(idParDefaut);
        alert('Mouvement enregistré avec succès !');
      })
      .catch((err) => {
        console.error("Erreur lors de l'enregistrement :", err.response?.data || err);
        alert("Erreur lors de l'enregistrement du mouvement.");
      });
  };

  const getArticleName = (m) => {
    if (m.designation_article) return m.designation_article;
    const art = articles.find((a) => String(a.id_article || a.id) === String(m.id_article));
    return art ? art.designation : 'Article inconnu';
  };

  const getUserName = (m) => {
    if (m.nom_utilisateur) return m.nom_utilisateur;
    const u = utilisateurs.find((usr) => String(usr.id_utilisateur || usr.id) === String(m.id_utilisateur));
    return u ? u.nom : 'Magasinier';
  };

  const term = searchTerm.toLowerCase();
  const filteredMouvements = mouvements.filter(
    (m) =>
      getArticleName(m).toLowerCase().includes(term) ||
      (m.motif || '').toLowerCase().includes(term) ||
      (m.type || '').toLowerCase().includes(term)
  );

  return (
    <MagasinierLayout active="mouvements">
      <div className="page-header">
        <div className="header-icon-box">🔄</div>
        <div className="header-title-group">
          <h1>Enregistrer un Mouvement</h1>
          <p>Enregistrez les entrées ou sorties de stock.</p>
        </div>
      </div>

      <div className="custom-card-form form-avec-entete">
        <div className="form-card-header"><span>🔄</span> Nouveau Mouvement de Stock</div>

        <form onSubmit={handleAdd}>
          <div className="form-grid-3">
            <div className="form-group-custom">
              <label>Date</label>
              <input type="date" className="form-control-custom" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="form-group-custom">
              <label>Type de Mouvement</label>
              <select className="form-control-custom" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="ENTREE">ENTREE (+)</option>
                <option value="SORTIE">SORTIE (-)</option>
              </select>
            </div>
            <div className="form-group-custom">
              <label>Quantité</label>
              <input type="number" min="1" className="form-control-custom" value={quantite} onChange={(e) => setQuantite(e.target.value)} required />
            </div>
            <div className="form-group-custom">
              <label>Motif</label>
              <input type="text" className="form-control-custom" value={motif} onChange={(e) => setMotif(e.target.value)} placeholder="Ex: Réception fournisseur / Vente" />
            </div>
            <div className="form-group-custom">
              <label>Article</label>
              <select className="form-control-custom" value={idArticle} onChange={(e) => setIdArticle(e.target.value)} required>
                <option value="">-- Sélectionner un article --</option>
                {articles.map((a) => (
                  <option key={a.id_article || a.id} value={a.id_article || a.id}>
                    {a.reference} - {a.designation} (Stock: {a.quantite || 0})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group-custom">
              <label>Utilisateur (Magasinier)</label>
              <select className="form-control-custom" value={idUtilisateur} onChange={(e) => setIdUtilisateur(e.target.value)} required>
                <option value="">-- Sélectionner l'utilisateur --</option>
                {utilisateurs.map((u) => (
                  <option key={u.id_utilisateur || u.id} value={u.id_utilisateur || u.id}>{u.nom}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions-bar">
            <button type="submit" className="btn-save-mouvement">✔ Valider le mouvement</button>
          </div>
        </form>
      </div>

      <div className="custom-card-table">
        <div className="table-header-bar">
          <h2 className="table-title">Historique des Mouvements</h2>
          <div className="table-filter-group">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Rechercher un mouvement..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                <tr><td colSpan="7" className="empty-row">Chargement des données...</td></tr>
              ) : filteredMouvements.length > 0 ? (
                filteredMouvements.map((m, index) => {
                  const mId = m.id_mouvement || m.id || index;
                  const entree = estEntree(m.type);
                  return (
                    <tr key={mId}>
                      <td className="cell-gras">#{mId}</td>
                      <td>{m.date}</td>
                      <td>
                        <span className={`type-badge ${entree ? 'badge-entree' : 'badge-sortie'}`}>
                          {entree ? 'ENTREE (+)' : 'SORTIE (-)'}
                        </span>
                      </td>
                      <td>{getArticleName(m)}</td>
                      <td className={`cell-gras ${entree ? 'cell-vert-clair' : 'cell-rouge'}`}>
                        {entree ? `+${m.quantite}` : `-${m.quantite}`}
                      </td>
                      <td>{m.motif || '-'}</td>
                      <td>{getUserName(m)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="7" className="empty-row">Aucun mouvement enregistré.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer-info">
          Affichage de {filteredMouvements.length} sur {mouvements.length} mouvement(s)
        </div>
      </div>
    </MagasinierLayout>
  );
}

export default MagasinierMouvementsPage;