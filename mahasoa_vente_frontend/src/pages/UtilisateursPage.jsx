import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { messageErreur } from '../utils/erreurs';
import BarreRecherche from '../components/BarreRecherche';
import { correspond } from '../utils/recherche';
import './Utilisateurs.css';

const MIN_PASSWORD = 8;
const FORM_VIDE = { nom: '', email: '', role: 'vendeur', password: '' };

export default function UtilisateursPage() {
  const navigate = useNavigate();
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(FORM_VIDE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recherche, setRecherche] = useState('');

  const fetchUtilisateurs = async () => {
    try {
      setLoading(true);
      const response = await API.get('utilisateurs/');
      setUtilisateurs(Array.isArray(response.data) ? response.data : []);
      setError('');
    } catch (err) {
      console.error("Erreur lors de la récupération des utilisateurs:", err.response?.data || err);
      setError("Impossible de charger la liste des utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nom.trim() || !formData.email.trim()) {
      alert("Veuillez remplir le nom et l'adresse e-mail.");
      return;
    }
    if (formData.password.length < MIN_PASSWORD) {
      alert(`Le mot de passe doit contenir au moins ${MIN_PASSWORD} caractères.`);
      return;
    }

    try {
      setIsSubmitting(true);
      await API.post('utilisateurs/', {
        nom: formData.nom.trim(),
        email: formData.email.trim(),
        role: formData.role,
        password: formData.password,
      });

      setFormData(FORM_VIDE);
      await fetchUtilisateurs();
      alert("Utilisateur créé avec succès !");
    } catch (err) {
      console.error("Erreur lors de la création de l'utilisateur:", err.response?.data || err);
      alert("Erreur lors de l'enregistrement :\n" + messageErreur(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const utilisateursFiltres = utilisateurs.filter((u) =>
    correspond([u.id_utilisateur, u.id, u.nom, u.email, u.role], recherche)
  );

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#F7F6F1', minHeight: '100vh' }}>
      <button
        onClick={() => navigate('/')}
        className="btn btn-outline-secondary mb-3 bg-white"
      >
        ← Retour au tableau de bord
      </button>

      <h2 className="fw-bold mb-4" style={{ color: '#063C2F' }}>
        👥 Gestion des Utilisateurs
      </h2>

      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <div className="card-header text-white p-3" style={{ backgroundColor: '#063C2F' }}>
          <h5 className="mb-0 fw-bold">+ Créer un utilisateur</h5>
        </div>
        <div className="card-body p-4 bg-white">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label fw-semibold text-dark">Nom</label>
                <input
                  type="text"
                  name="nom"
                  className="form-control"
                  placeholder="ex: rindraniaina"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold text-dark">E-mail</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="ex: rindra@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold text-dark">Rôle</label>
                <select
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="vendeur">vendeur</option>
                  <option value="magasinier">magasinier</option>
                  <option value="administrateur">administrateur</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold text-dark">Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder={`${MIN_PASSWORD} caractères minimum`}
                  value={formData.password}
                  onChange={handleChange}
                  minLength={MIN_PASSWORD}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <div className="d-flex justify-content-end mt-3">
              <button
                type="submit"
                className="btn text-white fw-bold px-4 py-2"
                style={{ backgroundColor: '#063C2F', borderRadius: '6px' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <div className="card-header bg-white p-3 border-bottom">
          <h5 className="mb-0 fw-bold" style={{ color: '#063C2F' }}>
            📋 Liste des utilisateurs
          </h5>
        </div>

        <div className="bg-white">
          <BarreRecherche
            valeur={recherche}
            onChange={setRecherche}
            placeholder="Rechercher un utilisateur (nom, e-mail, rôle)..."
            total={utilisateurs.length}
            affiches={utilisateursFiltres.length}
          />
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ backgroundColor: '#063C2F', color: '#FFFFFF' }}>
                <tr>
                  <th className="py-3 px-3 text-white">IDENTIFIANT</th>
                  <th className="py-3 px-3 text-white">Nom</th>
                  <th className="py-3 px-3 text-white">E-mail</th>
                  <th className="py-3 px-3 text-white">Rôle</th>
                  <th className="py-3 px-3 text-white">Actes</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      Chargement des utilisateurs...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-danger">
                      {error}
                    </td>
                  </tr>
                ) : utilisateurs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : utilisateursFiltres.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      Aucun utilisateur ne correspond à « {recherche} ».
                    </td>
                  </tr>
                ) : (
                  utilisateursFiltres.map((u) => {
                    const uid = u.id_utilisateur || u.id;
                    return (
                      <tr key={uid || u.email}>
                        <td className="px-3 fw-bold">#{uid}</td>
                        <td className="px-3">{u.nom}</td>
                        <td className="px-3">{u.email}</td>
                        <td className="px-3">
                          <span className="badge bg-secondary text-capitalize">
                            {u.role || 'utilisateur'}
                          </span>
                        </td>
                        <td className="px-3">
                          <button className="btn btn-sm btn-outline-danger">
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
    </div>
  );
}