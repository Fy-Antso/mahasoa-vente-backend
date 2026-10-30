function BarreRecherche({ valeur, onChange, placeholder = 'Rechercher...', total = 0, affiches = 0 }) {
  return (
    <div style={{ padding: '0.75rem 1.25rem 1rem' }}>
      <div style={{ position: 'relative', maxWidth: '400px' }}>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        >
          🔍
        </span>
        <input
          type="search"
          value={valeur}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '10px 12px 10px 38px',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            fontSize: '0.95rem',
            outline: 'none',
            backgroundColor: '#fff',
            color: '#1e293b',
          }}
        />
      </div>
      {valeur.trim() !== '' && (
        <small style={{ display: 'block', marginTop: '6px', color: '#64748b' }}>
          {affiches} résultat{affiches > 1 ? 's' : ''} sur {total}
        </small>
      )}
    </div>
  );
}

export default BarreRecherche;