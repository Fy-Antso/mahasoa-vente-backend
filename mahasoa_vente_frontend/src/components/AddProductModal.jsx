import { useState } from 'react';
import api from '../api/axios';

function AddProductModal({ onProductAdded }) {
  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState('');
  const [quantite, setQuantite] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const newProduct = { nom, prix: parseFloat(prix), quantite: parseInt(quantite) };

    api.post('articles/', newProduct)
      .then((response) => {
        setLoading(false);
        setNom('');
        setPrix('');
        setQuantite('');
        onProductAdded(response.data); // Rafraîchit la liste automatiquement
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout du produit :", error);
        setLoading(false);
      });
  };

  return (
    <div className="card shadow-sm my-4">
      <div className="card-header bg-primary text-white fw-bold">
        ➕ Ajouter un nouvel article
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Désignation / Nom</label>
            <input
              type="text"
              className="form-control"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Prix (Ar)</label>
            <input
              type="number"
              className="form-control"
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Quantité en Stock</label>
            <input
              type="number"
              className="form-control"
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
              required
            />
          </div>
          <div className="col-12 text-end">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer le produit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;