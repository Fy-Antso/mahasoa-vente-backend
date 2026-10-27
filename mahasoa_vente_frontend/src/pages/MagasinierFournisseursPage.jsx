import { useEffect, useState } from 'react';
import api from '../api/axios';
import MagasinierLayout from '../Layouts/MagasinierLayout';
import './MagasinierFournisseurs.css';

function MagasinierFournisseursPage() {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nom, setNom] = useState('');
  const [contact, setContact] = useState('');
  const [telephone, setTelephone] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFournisseurs = () => {
    setLoading(true);
    api.get('fournisseurs/')
      .then((res) => {
        setFournisseurs(Array.isArray(res.data) ? res.data : res.data?.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des fournisseurs :', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();

    if (!nom.trim()) {
      alert("Le nom ou l'entreprise du fournisseur est obligatoire.");
      return;
    }

    api.post('fournisseurs/', { nom: nom.trim(), contact: contact.trim(), telephone: telephone.trim() })
      .then((res) => {
        setFournisseurs((prev) => [...prev, res.data]);
        setNom(''); setContact(''); setTelephone('');
        alert('Fournisseur enregistré avec succès !');
      })
      .catch((err) => {
        console.error("Erreur lors de l'enregistrement :", err);
        alert("Erreur lors de l'enregistrement du fournisseur.");
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce fournisseur ?')) {
      api.delete(`fournisseurs/${id}/`)
        .then(() => setFournisseurs((prev) => prev.filter((f) => (f.id_fournisseur || f.id) !== id)))
        .catch((err) => {
          console.error('Erreur lors de la suppression :', err);
          alert('Erreur lors de la suppression du fournisseur.');
        });
    }
  };

  const term = searchTerm.toLowerCase();
  const filteredFournisseurs = fournisseurs.filter(
    (f) =>
      (f.nom || '').toLowerCase().includes(term) ||
      (f.contact || '').toLowerCase().includes(term) ||
      (f.telephone || '').toLowerCase().includes(term)
  );

  return (
    <MagasinierLayout active="fournisseurs">
      <div className="page-header">
        <div className="header-icon-box">🤝</div>
        <div className="header-title-group">
          <h1>Gestion des Fournisseurs</h1>
          <p>Gérez vos fournisseurs et leurs informations de contact.</p>
        </div>
      </div>

      <div className="custom-card-form form-avec-entete">
        <div className="form-card-header"><span>➕</span> Ajouter un fournisseur</div>

        <form onSubmit={handleAdd}>
          <div className="form-grid-3">
            <div className="form-group-custom">
              <label>Nom / Entreprise</label>
              <input type="text" className="form-control-custom" value={nom} onChange={(e) => setNom(e.target.value)} required />
            </div>
            <div className="form-group-custom">
              <label>Contact</label>
              <input type="text" className="form-control-custom" value={contact} onChange={(e) => setContact(e.target.value)} />
            </div>
            <div className="form-group-custom">
              <label>Téléphone</label>
              <input type="text" className="form-control-custom" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
            </div>
          </div>

          <div className="form-actions-bar">
            <button type="submit" className="btn-save-fournisseur">💾 Enregistrer</button>
          </div>
        </form>
      </div>

      <div className="custom-card-table">
        <div className="table-header-bar">
          <h2 className="table-title">Liste des fournisseurs</h2>
          <div className="table-filter-group">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Rechercher un fournisseur..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom / Entreprise</th>
                <th>Contact</th>
                <th>Téléphone</th>
                <th className="col-centre">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="empty-row">Chargement des données...</td></tr>
              ) : filteredFournisseurs.length > 0 ? (
                filteredFournisseurs.map((f) => {
                  const fId = f.id_fournisseur || f.id;
                  return (
                    <tr key={fId}>
                      <td className="cell-gras">{fId}</td>
                      <td className="cell-gras cell-vert">{f.nom}</td>
                      <td>{f.contact || '-'}</td>
                      <td>{f.telephone || '-'}</td>
                      <td className="col-centre">
                        <button onClick={() => handleDelete(fId)} className="btn-delete-action" title="Supprimer le fournisseur">🗑️ Supprimer</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="5" className="empty-row">Aucun fournisseur enregistré.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer-info">
          Affichage de {filteredFournisseurs.length} sur {fournisseurs.length} fournisseur(s)
        </div>
      </div>
    </MagasinierLayout>
  );
}

export default MagasinierFournisseursPage;