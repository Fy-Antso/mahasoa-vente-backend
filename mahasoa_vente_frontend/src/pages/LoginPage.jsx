import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import logoImg from '../assets/logo.png';
import './Login.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // État pour le message de confirmation
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    api.post('/api/login/', { username, password })
      .then((res) => {
        const user = res.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', user.role);

        // Affichage du message de confirmation avant la redirection
        setSuccessMessage("Connexion réussie ! Redirection en cours...");

        // Délai de 1 seconde pour laisser le temps de voir le message de confirmation
        setTimeout(() => {
          if (user.role.toLowerCase() === 'administrateur' || user.role.toLowerCase() === 'admin') {
            navigate('/');
          } else if (user.role.toLowerCase() === 'magasinier') {
            navigate('/magasinier');
          } else {
            navigate('/');
          }
        }, 1000);
      })
      .catch((err) => {
        console.error(err);
        if (!err.response) {
          setError("Serveur injoignable. Réessayez dans un instant (le serveur gratuit peut mettre 30 s à démarrer).");
        } else if (err.response.status >= 500) {
          setError("Erreur du serveur. Contactez l'administrateur.");
        } else {
          setError("Identifiants incorrects.");
        }
      });
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        
        {/* EN-TÊTE AVEC VOTRE LOGO */}
        <div className="brand-container">
          <img src={logoImg} alt="MAHASOA VENTE Logo" className="brand-logo-img" />
          <h1 className="brand-title">MAHASOA VENTE</h1>
          <div className="brand-divider">
            <span className="dot-center"></span>
          </div>
          <p className="brand-subtitle">Connexion à votre espace de gestion</p>
        </div>

        {error && <div className="error-banner">{error}</div>}
        
        {/* BANNIÈRE DE CONFIRMATION DE SUCCÈS */}
        {successMessage && (
          <div style={{
            backgroundColor: '#d1fae5',
            color: '#065f46',
            padding: '0.75rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontWeight: '600',
            textAlign: 'center',
            fontSize: '0.9rem',
            border: '1px solid #10b981'
          }}>
            {successMessage}
          </div>
        )}

        {/* FORMULAIRE */}
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <div className="input-container">
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#043327" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-container">
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#043327" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v3"/>
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Afficher/Masquer le mot de passe"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          <div className="options-container" style={{ justifyContent: 'flex-start' }}>
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Se souvenir de moi</span>
            </label>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            <span>Se connecter</span>
          </button>
        </form>

        <div className="security-footer" style={{ marginTop: '1.5rem' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>Accès réservé aux utilisateurs autorisés</span>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;