import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Categories.css';

function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [nom, setNom] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCategories = () => {
    setLoading(true);
    api.get('categories/')
      .then((res) => {
        setCategories(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement :", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nom.trim()) {
      alert("Veuillez saisir un nom de catégorie.");
      return;
    }

    // On envoie un objet contenant les deux variantes possibles pour s'adapter au serializer Django
    const payload = { nom: nom, nom_categorie: nom };

    if (editingId) {
      api.put(`categories/${editingId}/`, payload)
        .then(() => {
          setNom('');
          setEditingId(null);
          fetchCategories();
        })
        .catch((err) => {
          console.error("Erreur modification :", err.response?.data || err);
          alert("Erreur lors de la modification : " + JSON.stringify(err.response?.data || err));
        });
    } else {
      api.post('categories/', payload)
        .then(() => {
          setNom('');
          fetchCategories();
        })
        .catch((err) => {
          console.error("Erreur ajout :", err.response?.data || err);
          alert("Erreur lors de l'ajout : " + JSON.stringify(err.response?.data || err));
        });
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id || cat.id_categorie);
    setNom(cat.nom || cat.nom_categorie);
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
      api.delete(`categories/${id}/`)
        .then(() => {
          fetchCategories();
        })
        .catch((err) => {
          console.error("Erreur suppression :", err.response?.data || err);
          alert("Erreur lors de la suppression.");
        });
    }
  };

  return (
    <div className="categories-container">
      <button className="btn-back" onClick={() => navigate('/')}>
        ← Retour au tableau de bord
      </button>

      <div className="page-title-section">
        <div className="title-icon-wrapper">🏷️</div>
        <div className="title-text-group">
          <h1>Gestion des Catégories</h1>
          <div className="title-underline"></div>
        </div>
      </div>

      <div className="custom-card">
        <div className="card-header-custom">
          <span>{editingId ? '✏️ Modifier la catégorie' : '➕ Ajouter une nouvelle catégorie'}</span>
        </div>
        <div className="card-body-custom">
          {/* onSubmit gère obligatoirement le clic sur le bouton Ajouter */}
          <form onSubmit={handleSubmit} className="form-inline-custom">
            <div className="form-group-custom">
              <label>Nom de la catégorie</label>
              <input 
                type="text" 
                className="form-control-custom" 
                placeholder="Ex: Accessoires Cuisine" 
                value={nom} 
                onChange={(e) => setNom(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn-submit">
              {editingId ? 'Mettre à jour' : 'Ajouter'}
            </button>
            {editingId && (
              <button 
                type="button" 
                className="btn-submit" 
                style={{ backgroundColor: '#64748b' }} 
                onClick={() => { setEditingId(null); setNom(''); }}
              >
                Annuler
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="custom-card">
        <div className="card-header-light">
          <div className="page-title-section" style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>📋</span>
            <div className="title-text-group">
              <h2 className="header-title-underline">Liste des catégories enregistrées</h2>
              <div className="title-underline"></div>
            </div>
          </div>
        </div>

        <div className="table-responsive-custom">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom de la catégorie</th>
                <th style={{ width: '160px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="empty-state">Chargement des catégories...</td>
                </tr>
              ) : categories.length > 0 ? (
                categories.map((cat, index) => {
                  const catId = cat.id || cat.id_categorie;
                  const catName = cat.nom || cat.nom_categorie;
                  return (
                    <tr key={catId || index}>
                      <td>{catId}</td>
                      <td><strong>{catName}</strong></td>
                      <td>
                        <div className="action-buttons">
                          <button type="button" className="btn-edit" onClick={() => handleEdit(cat)}>Modifier</button>
                          <button type="button" className="btn-delete" onClick={() => handleDelete(catId)}>Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" className="empty-state">
                    Aucune catégorie enregistrée pour le moment.
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

export default CategoriesPage;