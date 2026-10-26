import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './MagasinierFournisseurs.css';

// Importation du logo officiel de MAHASOA VENTE
import logoMahasoa from '../assets/logo.png';

function MagasinierFournisseursPage() {
  const navigate = useNavigate();

  // États des données
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Champs du formulaire Fournisseur
  const [nom, setNom] = useState('');
  const [contact, setContact] = useState('');
  const [telephone, setTelephone] = useState('');

  // Barre de recherche dans la liste
  const [searchTerm, setSearchTerm] = useState('');

  // Modale de déconnexion
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fetchFournisseurs = () => {
    setLoading(true);
    api.get('fournisseurs/')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        setFournisseurs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des fournisseurs :", err);
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

    const payload = {
      nom: nom.trim(),
      contact: contact.trim(),
      telephone: telephone.trim()
    };

    api.post('fournisseurs/', payload)
      .then((res) => {
        setFournisseurs([...fournisseurs, res.data]);
        setNom('');
        setContact('');
        setTelephone('');
        alert("Fournisseur enregistré avec succès !");
      })
      .catch((err) => {
        console.error("Erreur lors de l'enregistrement :", err);
        alert("Erreur lors de l'enregistrement du fournisseur.");
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce fournisseur ?")) {
      api.delete(`fournisseurs/${id}/`)
        .then(() => {
          setFournisseurs(fournisseurs.filter(f => (f.id_fournisseur || f.id) !== id));
        })
        .catch((err) => {
          console.error("Erreur lors de la suppression :", err);
          alert("Erreur lors de la suppression du fournisseur.");
        });
    }
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Filtrage dynamique des fournisseurs
  const filteredFournisseurs = (fournisseurs || []).filter((f) => {
    const fNom = f.nom || '';
    const fContact = f.contact || '';
    const fTel = f.telephone || '';
    const term = searchTerm.toLowerCase();

    return fNom.toLowerCase().includes(term) ||
           fContact.toLowerCase().includes(term) ||
           fTel.toLowerCase().includes(term);
  });

  return (
    <div className="magasinier-layout">

      {/* 1. SIDEBAR FIXÉE À GAUCHE (Harmonisée avec l'Administrateur) */}
      <aside className="sidebar">
        <div className="sidebar-top-content">
          <div className="sidebar-brand">
            <img 
              src={logoMahasoa} 
              alt="MAHASOA VENTE Logo" 
              className="sidebar-logo"
            />
            <div className="brand-text">
              <h2>MAHASOA VENTE</h2>
              <span className="role-badge">magasinier</span>
            </div>
          </div>

          <ul className="sidebar-menu">
            <li className="menu-item" onClick={() => navigate('/magasinier')}>
              <span className="menu-icon">📊</span>
              <span>Tableau de Bord</span>
            </li>
            <li className="menu-item" onClick={() => navigate('/magasinier/articles')}>
              <span className="menu-icon">📋</span>
              <span>Articles & Stocks</span>
            </li>
            <li className="menu-item" onClick={() => navigate('/magasinier/mouvements')}>
              <span className="menu-icon">🔄</span>
              <span>Mouvements</span>
            </li>
            <li className="menu-item active" onClick={() => navigate('/magasinier/fournisseurs')}>
              <span className="menu-icon">🤝</span>
              <span>Fournisseurs</span>
            </li>
          </ul>
        </div>

        {/* Bouton de déconnexion ancré en bas */}
        <div className="sidebar-footer">
          <button className="btn-sidebar-logout" onClick={() => setShowLogoutModal(true)}>
            <span>🚪</span> Déconnexion
          </button>
        </div>
      </aside>

      {/* 2. ZONE PRINCIPALE */}
      <div className="main-content">

        {/* NAVBAR SUPÉRIEURE */}
        <header className="navbar-top">
          <div className="navbar-user-info">
            <div className="user-avatar">M</div>
            <div className="user-details">
              <div className="user-name">Espace Magasinier</div>
              <div className="user-role">Gestionnaire de Stock</div>
            </div>
          </div>
        </header>

        {/* CONTENU DE LA PAGE */}
        <main className="dashboard-view">

          <div className="page-header">
            <div className="header-icon-box">🤝</div>
            <div className="header-title-group">
              <h1>Gestion des Fournisseurs</h1>
              <p>Gérez vos fournisseurs et leurs informations de contact.</p>
            </div>
          </div>

          {/* FORMULAIRE D'AJOUT D'UN FOURNISSEUR */}
          <div className="custom-card-form" style={{ marginBottom: '2rem' }}>
            <div className="form-card-header">
              <span>➕</span> Ajouter un fournisseur
            </div>

            <form onSubmit={handleAdd}>
              <div className="form-grid-3" style={{ padding: '1.5rem' }}>

                <div className="form-group-custom">
                  <label className="form-label">Nom / Entreprise</label>
                  <input 
                    type="text" 
                    className="form-control-custom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
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
                  />
                </div>

                <div className="form-group-custom">
                  <label className="form-label">Téléphone</label>
                  <input 
                    type="text" 
                    className="form-control-custom"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                  />
                </div>

              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 1.5rem 1.5rem 0' }}>
                <button type="submit" className="btn-save-fournisseur">
                  💾 Enregistrer
                </button>
              </div>
            </form>
          </div>

          {/* LISTE DES FOURNISSEURS (TABLEAU) */}
          <div className="custom-card-table">
            <div className="table-header-bar">
              <h2 className="table-title">Liste des fournisseurs</h2>

              <div className="table-filter-group">
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input 
                    type="text" 
                    placeholder="Rechercher un fournisseur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
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
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="empty-row">Chargement des données...</td>
                    </tr>
                  ) : filteredFournisseurs.length > 0 ? (
                    filteredFournisseurs.map((f) => {
                      const fId = f.id_fournisseur || f.id;

                      return (
                        <tr key={fId}>
                          <td style={{ fontWeight: '600' }}>{fId}</td>
                          <td style={{ fontWeight: '600', color: '#063C2F' }}>{f.nom}</td>
                          <td>{f.contact || '-'}</td>
                          <td>{f.telephone || '-'}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button 
                              onClick={() => handleDelete(fId)} 
                              className="btn-delete-action"
                              title="Supprimer le fournisseur"
                            >
                              🗑️ Supprimer
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="empty-row">Aucun fournisseur enregistré.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer-info">
              Affichage de {filteredFournisseurs.length} sur {fournisseurs.length} fournisseur(s)
            </div>
          </div>

        </main>
      </div>

      {/* 3. MODAL DE CONFIRMATION DE DÉCONNEXION */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-icon">🚪</div>
            <h3 className="modal-title">Déconnexion</h3>
            <p className="modal-message">Êtes-vous sûr de vouloir vous déconnecter de la session ?</p>
            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={() => setShowLogoutModal(false)}>
                Non
              </button>
              <button className="btn-modal-confirm" onClick={confirmLogout}>
                Oui
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default MagasinierFournisseursPage;