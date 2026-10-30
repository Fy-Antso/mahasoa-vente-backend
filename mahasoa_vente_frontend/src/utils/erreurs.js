export function messageErreur(err, defaut = "Une erreur est survenue.") {
  if (!err || !err.response) {
    return "Serveur injoignable. Réessayez dans un instant (le serveur gratuit peut mettre jusqu'à 50 s à se réveiller).";
  }

  const { status, data } = err.response;

  // Page HTML (erreur 404/500 Django) : on n'affiche pas le HTML
  if (typeof data === 'string') {
    return `Erreur ${status} du serveur. ${defaut}`;
  }

  if (data && typeof data === 'object') {
    const lignes = Object.entries(data).map(([champ, msgs]) => {
      const texte = Array.isArray(msgs) ? msgs.join(' ') : String(msgs);
      return champ === 'detail' || champ === 'non_field_errors' ? texte : `${champ} : ${texte}`;
    });
    if (lignes.length > 0) return lignes.join('\n');
  }

  return `Erreur ${status}. ${defaut}`;
}