import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { messageErreur } from '../utils/erreurs';
import './Fournisseurs.css';

function FournisseursPage() {
  const navigate = useNavigate();

  const [fournisseurs, setFournisseurs] = useState([]);
  const [nom, setNom] = useState('');
  const [contact, setContact] = useState('');
  const [telephone, setTelephone] = useState('');
  const [loading, setLoading] = useState(true);
  const [erreurChargement, setErreurChargement] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchFournisseurs = () => {
    api.get('fournisseurs/')
      .then((res) => {
        setFournisseurs(Array.isArray(res.data) ? res.data : []);
        setErreurChargement('');
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement fournisseurs :", err.response?.data || err);
        setErreurChargement("Impossible de charger les fournisseurs : " + messageErreur(err));
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const resetForm = () => {
    setNom('');
    setContact('');
    setTelephone('');
    setEditingId(null);
  };

  const afficherErreur = (err) => {
    console.error("Erreur fournisseur :", err.response?.data || err);
    alert("Erreur lors de l'enregistrement du fournisseur :\n" + messageErreur(err));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const payload = { nom, contact, telephone };

    if (editingId) {
      // Modification (PUT)
      api.put(`fournisseurs/${editingId}/`, payload)
        .then(() => {
          fetchFournisseurs();
          resetForm();
        })
        .catch(afficherErreur);
    } else {
      // Ajout (POST)
      api.post('fournisseurs/', payload)
        .then((res) => {
          setFournisseurs([...fournisseurs, res.data]);
          resetForm();
        })
        .catch(afficherErreur);
    }
  };

  const handleEdit = (f) => {
    setEditingId(f.id_fournisseur || f.id);
    setNom(f.nom || '');
    setContact(f.contact || '');
    setTelephone(f.telephone || '');
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce fournisseur ?")) {
      api.delete(`fournisseurs/${id}/`)
        .then(() => {
          setFournisseurs(fournisseurs.filter((f) => (f.id_fournisseur || f.id) !== id));
        })
        .catch((err) => {
          console.error("Erreur suppression :", err.response?.data || err);
          alert("Suppression impossible :\n" + messageErreur(err));
        });
    }
  };

  return (
    <div className="fournisseurs-container">
      {/* BOUTON RETOUR VERS LE TABLEAU DE BORD */}
      <button className="btn-back" onClick={() => navigate('/')}>
        ← Retour au tableau de bord
      </button>

      {/* EN-TÊTE DE LA PAGE */}
      <div className="page-title-section">
        <div className="title-icon-wrapper">
          🚚
        </div>
        <div className="title-text-group">
          <h1>Gestion des Fournisseurs</h1>
          <div className="title-underline"></div>
        </div>
      </div>

      {/* FORMULAIRE DE SAISIE COMPACT */}
      <div className="custom-card">
        <div className="card-header-custom">
          <span>{editingId ? '✏️ Modifier le fournisseur' : '➕ Ajouter un fournisseur'}</span>
        </div>
        <div className="card-body-custom">
          <form onSubmit={handleAdd}>
            <div className="form-grid-fournisseurs">
              <div className="form-group-custom">
                <label className="form-label">Nom</label>
                <input
                  type="text"
                  className="form-control-custom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Nom du fournisseur"
                  required
                />
              </div>

              <div className="form-group-custom">
                <label className="form-label">Contact</label>
                <input
                  type="text"
                  className="form-control-custom"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Personne de contact / Email"
                />
              </div>

              <div className="form-group-custom">
                <label className="form-label">Téléphone</label>
                <input
                  type="text"
                  className="form-control-custom"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="Numéro de téléphone"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {editingId ? 'Mettre à jour' : 'Enregistrer'}
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

      {/* TABLEAU DES FOURNISSEURS ENREGISTRÉS */}
      <div className="custom-card">
        <div className="card-header-light">
          <div className="page-title-section" style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>📋</span>
            <div className="title-text-group">
              <h2 className="header-title-underline">Liste des fournisseurs</h2>
              <div className="title-underline"></div>
            </div>
          </div>
        </div>

        <div className="table-responsive-custom">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Contact</th>
                <th>Téléphone</th>
                <th style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="empty-state">Chargement...</td>
                </tr>
              ) : erreurChargement ? (
                <tr>
                  <td colSpan="5" className="empty-state" style={{ color: '#dc2626' }}>
                    {erreurChargement}
                  </td>
                </tr>
              ) : fournisseurs.length > 0 ? (
                fournisseurs.map((f, index) => (
                  <tr key={f.id_fournisseur || f.id || index}>
                    <td>{f.id_fournisseur || f.id || index + 1}</td>
                    <td><strong>{f.nom}</strong></td>
                    <td>{f.contact || '-'}</td>
                    <td>{f.telephone || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit" onClick={() => handleEdit(f)}>
                          Modifier
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(f.id_fournisseur || f.id)}>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state">
                    Aucun fournisseur enregistré.
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

export default FournisseursPage;