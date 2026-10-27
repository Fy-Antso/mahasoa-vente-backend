import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Mouvements.css';

// Accepte 'Entree', 'ENTREE', 'entrée'...
const estEntree = (t) => String(t || '').toLowerCase().startsWith('entr');

const aujourdhui = () => new Date().toISOString().split('T')[0];

function MouvementsPage() {
  const navigate = useNavigate();

  const [mouvements, setMouvements] = useState([]);
  const [articles, setArticles] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState(aujourdhui());
  const [type, setType] = useState('ENTREE');
  const [quantite, setQuantite] = useState('');
  const [motif, setMotif] = useState('');
  const [idArticle, setIdArticle] = useState('');
  const [idUtilisateur, setIdUtilisateur] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchData = () => {
    Promise.all([
      api.get('mouvements/'),
      api.get('articles/'),
      api.get('utilisateurs/')
    ])
      .then(([resMouvements, resArticles, resUtilisateurs]) => {
        setMouvements(resMouvements.data);
        setArticles(resArticles.data);
        setUtilisateurs(resUtilisateurs.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des données :", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setDate(aujourdhui());
    setType('ENTREE');
    setQuantite('');
    setMotif('');
    setIdArticle('');
    setIdUtilisateur('');
    setEditingId(null);
  };

  const handleAdd = (e) => {
    e.preventDefault();

    const payload = {
      date,
      type: type === 'ENTREE' ? 'Entree' : 'Sortie', // valeurs acceptées par le modèle Django
      quantite: parseInt(quantite, 10),
      motif,
      id_article: idArticle,
      id_utilisateur: idUtilisateur
    };

    const afficherErreur = (err) => {
      console.error("Erreur mouvement :", err.response?.data || err);
      alert("Erreur lors de l'enregistrement du mouvement. Vérifiez les champs.");
    };

    if (editingId) {
      api.put(`mouvements/${editingId}/`, payload)
        .then(() => {
          fetchData();
          resetForm();
        })
        .catch(afficherErreur);
    } else {
      api.post('mouvements/', payload)
        .then(() => {
          // On recharge pour récupérer aussi les noms d'article et d'utilisateur
          fetchData();
          resetForm();
        })
        .catch(afficherErreur);
    }
  };

  const handleEdit = (m) => {
    setEditingId(m.id_mouvement || m.id);
    setDate(m.date || aujourdhui());
    setType(estEntree(m.type) ? 'ENTREE' : 'SORTIE');
    setQuantite(m.quantite || '');
    setMotif(m.motif || '');
    setIdArticle(m.id_article || m.article || '');
    setIdUtilisateur(m.id_utilisateur || m.utilisateur || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce mouvement ?")) {
      api.delete(`mouvements/${id}/`)
        .then(() => {
          setMouvements(mouvements.filter((m) => (m.id_mouvement || m.id) !== id));
        })
        .catch((err) => {
          console.error(err);
          alert("Erreur lors de la suppression du mouvement.");
        });
    }
  };

  return (
    <div className="mouvements-container">
      {/* BOUTON RETOUR VERS LE TABLEAU DE BORD */}
      <button className="btn-back" onClick={() => navigate('/')}>
        ← Retour au tableau de bord
      </button>

      {/* EN-TÊTE DE LA PAGE */}
      <div className="page-title-section">
        <div className="title-icon-wrapper">
          🔄
        </div>
        <div className="title-text-group">
          <h1>Mouvements de Stock</h1>
          <div className="title-underline"></div>
        </div>
      </div>

      {/* FORMULAIRE DE SAISIE COMPACT */}
      <div className="custom-card">
        <div className="card-header-custom">
          <span>{editingId ? '✏️ Modifier le mouvement' : '➕ Nouveau Mouvement'}</span>
        </div>
        <div className="card-body-custom">
          <form onSubmit={handleAdd}>
            <div className="form-grid-mouvements">
              <div className="form-group-custom">
                <label>Date</label>
                <input
                  type="date"
                  className="form-control-custom"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-custom">
                <label>Type</label>
                <select
                  className="form-control-custom"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="ENTREE">ENTREE</option>
                  <option value="SORTIE">SORTIE</option>
                </select>
              </div>

              <div className="form-group-custom">
                <label>Quantité</label>
                <input
                  type="number"
                  min="1"
                  className="form-control-custom"
                  value={quantite}
                  onChange={(e) => setQuantite(e.target.value)}
                  placeholder="Quantité"
                  required
                />
              </div>

              <div className="form-group-custom">
                <label>Motif</label>
                <input
                  type="text"
                  className="form-control-custom"
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                  placeholder="Motif"
                />
              </div>

              <div className="form-group-custom">
                <label>Article</label>
                <select
                  className="form-control-custom"
                  value={idArticle}
                  onChange={(e) => setIdArticle(e.target.value)}
                  required
                >
                  <option value="">-- Sélectionner un article --</option>
                  {articles.map((a) => (
                    <option key={a.id_article || a.id} value={a.id_article || a.id}>
                      {a.designation || a.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-custom">
                <label>Utilisateur</label>
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

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {editingId ? 'Mettre à jour' : 'Enregistrer le mouvement'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn-submit"
                  style={{ backgroundColor: '#64748b', marginLeft: '0.5rem' }}
                  onClick={resetForm}
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* TABLEAU DES MOUVEMENTS ENREGISTRÉS */}
      <div className="custom-card">
        <div className="card-header-light">
          <div className="page-title-section" style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>📋</span>
            <div className="title-text-group">
              <h2 className="header-title-underline">Historique des mouvements</h2>
              <div className="title-underline"></div>
            </div>
          </div>
        </div>

        <div className="table-responsive-custom">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Type</th>
                <th>Article</th>
                <th>Quantité</th>
                <th>Motif</th>
                <th>Utilisateur</th>
                <th style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="empty-state">Chargement des données...</td>
                </tr>
              ) : mouvements.length > 0 ? (
                mouvements.map((m, index) => (
                  <tr key={m.id_mouvement || m.id || index}>
                    <td>{m.id_mouvement || m.id || index + 1}</td>
                    <td>{m.date}</td>
                    <td>
                      <span style={{
                        color: estEntree(m.type) ? '#10b981' : '#ef4444',
                        fontWeight: '700'
                      }}>
                        {estEntree(m.type) ? 'ENTREE' : 'SORTIE'}
                      </span>
                    </td>
                    <td>{m.designation_article || '-'}</td>
                    <td>{m.quantite}</td>
                    <td>{m.motif || '-'}</td>
                    <td>{m.nom_utilisateur || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit" onClick={() => handleEdit(m)}>
                          Modifier
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(m.id_mouvement || m.id)}>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-state">
                    Aucun mouvement enregistré.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MouvementsPage;