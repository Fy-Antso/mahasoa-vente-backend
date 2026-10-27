import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Utilisateurs.css';

const ROLES = ['administrateur', 'magasinier'];

function lireUtilisateurConnecte() {
  try {
    return JSON.parse(localStorage.getItem('user')) || {};
  } catch {
    return {};
  }
}

// Transforme une réponse d'erreur DRF en message lisible
function messageErreur(err, defaut) {
  const data = err.response?.data;
  if (!data) return defaut;
  if (typeof data === 'string') return defaut;
  const texte = Object.entries(data)
    .map(([champ, msgs]) => `${champ} : ${[].concat(msgs).join(' ')}`)
    .join('\n');
  return texte || defaut;
}

function UtilisateursPage() {
  const navigate = useNavigate();
  const connecte = lireUtilisateurConnecte();

  const [utilisateurs, setUtilisateurs] = useState([]);
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('magasinier');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const fetchUtilisateurs = () => {
    api.get('utilisateurs/')
      .then((res) => {
        setUtilisateurs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const resetForm = () => {
    setNom('');
    setEmail('');
    setRole('magasinier');
    setPassword('');
    setEditingId(null);
  };

  const handleAdd = (e) => {
    e.preventDefault();

    if (!editingId && !password) {
      alert('Le mot de passe est obligatoire pour un nouvel utilisateur.');
      return;
    }

    const payload = { nom, email, role };
    if (password) payload.password = password;

    const afficherErreur = (err) => {
      console.error(err.response?.data || err);
      alert(messageErreur(err, "Erreur lors de l'enregistrement de l'utilisateur."));
    };

    if (editingId) {
      api.put(`utilisateurs/${editingId}/`, payload)
        .then(() => {
          fetchUtilisateurs();
          resetForm();
        })
        .catch(afficherErreur);
    } else {
      api.post('utilisateurs/', payload)
        .then(() => {
          fetchUtilisateurs();
          resetForm();
        })
        .catch(afficherErreur);
    }
  };

  const handleEdit = (u) => {
    setEditingId(u.id_utilisateur || u.id);
    setNom(u.nom || '');
    setEmail(u.email || '');
    setRole(u.role || 'magasinier');
    setPassword('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (connecte.id && String(connecte.id) === String(id)) {
      alert('Vous ne pouvez pas supprimer le compte avec lequel vous êtes connecté.');
      return;
    }
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      api.delete(`utilisateurs/${id}/`)
        .then(() => {
          setUtilisateurs(utilisateurs.filter((u) => (u.id_utilisateur || u.id) !== id));
        })
        .catch((err) => {
          console.error(err);
          alert("Erreur lors de la suppression (cet utilisateur a peut-être des mouvements enregistrés).");
        });
    }
  };

  // Garde un rôle existant hors liste sélectionnable (ex. « vendeur »)
  const rolesDisponibles = ROLES.includes(role) ? ROLES : [...ROLES, role];

  return (
    <div className="utilisateurs-container">
      {/* BOUTON RETOUR VERS LE TABLEAU DE BORD */}
      <button className="btn-back" onClick={() => navigate('/')}>
        ← Retour au tableau de bord
      </button>

      {/* EN-TÊTE DE LA PAGE */}
      <div className="page-title-section">
        <div className="title-icon-wrapper">
          👥
        </div>
        <div className="title-text-group">
          <h1>Gestion des Utilisateurs</h1>
          <div className="title-underline"></div>
        </div>
      </div>

      {/* FORMULAIRE DE SAISIE COMPACT */}
      <div className="custom-card">
        <div className="card-header-custom">
          <span>{editingId ? '✏️ Modifier l’utilisateur' : '➕ Créer un utilisateur'}</span>
        </div>
        <div className="card-body-custom">
          <form onSubmit={handleAdd}>
            <div className="form-grid-utilisateurs">
              <div className="form-group-custom">
                <label className="form-label">Nom</label>
                <input
                  type="text"
                  className="form-control-custom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-custom">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control-custom"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-custom">
                <label className="form-label">Rôle</label>
                <select
                  className="form-control-custom"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  {rolesDisponibles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="form-group-custom">
                <label className="form-label">
                  {editingId ? 'Nouveau mot de passe (facultatif)' : 'Mot de passe'}
                </label>
                <input
                  type="password"
                  className="form-control-custom"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  autoComplete="new-password"
                  placeholder={editingId ? 'Laisser vide pour ne pas changer' : '8 caractères minimum'}
                  required={!editingId}
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

      {/* TABLEAU DES UTILISATEURS ENREGISTRÉS */}
      <div className="custom-card">
        <div className="card-header-light">
          <div className="page-title-section" style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>📋</span>
            <div className="title-text-group">
              <h2 className="header-title-underline">Liste des utilisateurs</h2>
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
                <th>Email</th>
                <th>Rôle</th>
                <th style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="empty-state">Chargement...</td>
                </tr>
              ) : utilisateurs.length > 0 ? (
                utilisateurs.map((u, index) => (
                  <tr key={u.id_utilisateur || u.id || index}>
                    <td>{u.id_utilisateur || u.id}</td>
                    <td><strong>{u.nom}</strong></td>
                    <td>{u.email}</td>
                    <td>
                      <span className="badge bg-secondary" style={{ padding: '0.3em 0.6em', borderRadius: '4px' }}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit" onClick={() => handleEdit(u)}>
                          Modifier
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(u.id_utilisateur || u.id)}>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state">
                    Aucun utilisateur trouvé.
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

export default UtilisateursPage;