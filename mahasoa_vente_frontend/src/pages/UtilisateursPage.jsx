import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios'; // Import de votre instance Axios préconfigurée
import './Utilisateurs.css';

export default function UtilisateursPage() {
  const navigate = useNavigate();
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // État du formulaire
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'vendeur',
    password: 'Password123!' // Mot de passe par défaut pour la création rapide
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Charger la liste des utilisateurs au chargement du composant
  const fetchUtilisateurs = async () => {
    try {
      setLoading(true);
      const response = await API.get('/users/'); // Ajustez l'URL API si nécessaire (ex: /api/users/)
      setUtilisateurs(response.data);
      setError('');
    } catch (err) {
      console.error("Erreur lors de la récupération des utilisateurs:", err);
      setError("Impossible de charger la liste des utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  // 2. Gérer le changement dans les champs du formulaire
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. Soumettre le formulaire pour créer un utilisateur
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email) {
      alert("Veuillez remplir le nom et l'adresse e-mail.");
      return;
    }

    try {
      setIsSubmitting(true);
      // Envoi de la requête POST au backend Django
      await API.post('/users/', formData);
      
      // Réinitialiser le formulaire
      setFormData({
        username: '',
        email: '',
        role: 'vendeur',
        password: 'Password123!'
      });

      // Rafraîchir la liste immédiatement
      await fetchUtilisateurs();
      alert("Utilisateur créé avec succès !");
    } catch (err) {
      console.error("Erreur lors de la création de l'utilisateur:", err);
      alert("Erreur lors de l'enregistrement de l'utilisateur. Vérifiez les informations.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#F7F6F1', minHeight: '100vh' }}>
      {/* Bouton de retour */}
      <button 
        onClick={() => navigate('/')} 
        className="btn btn-outline-secondary mb-3 bg-white"
      >
        ← Retour au tableau de bord
      </button>

      <h2 className="fw-bold mb-4" style={{ color: '#063C2F' }}>
        👥 Gestion des Utilisateurs
      </h2>

      {/* Carte Formulaire de création */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <div className="card-header text-white p-3" style={{ backgroundColor: '#063C2F' }}>
          <h5 className="mb-0 fw-bold">+ Créer un utilisateur</h5>
        </div>
        <div className="card-body p-4 bg-white">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold text-dark">Nom</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="ex: rindraniaina"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
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

              <div className="col-md-4">
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
            </div>

            {/* Bouton de soumission corrigé */}
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

      {/* Carte Liste des utilisateurs */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <div className="card-header bg-white p-3 border-bottom">
          <h5 className="mb-0 fw-bold" style={{ color: '#063C2F' }}>
            📋 Liste des utilisateurs
          </h5>
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
                ) : (
                  utilisateurs.map((u) => (
                    <tr key={u.id || u.username}>
                      <td className="px-3 fw-bold">#{u.id}</td>
                      <td className="px-3">{u.username || u.nom}</td>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}