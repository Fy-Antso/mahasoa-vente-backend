export function lireUtilisateur() {
  try {
    return JSON.parse(localStorage.getItem('user')) || {};
  } catch {
    return {};
  }
}

// Accepte 'Entree', 'ENTREE', 'entrée'...
export const estEntree = (t) => String(t || '').toLowerCase().startsWith('entr');