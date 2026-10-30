// Supprime accents et majuscules pour comparer les textes
export const normaliser = (v) =>
  String(v ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

// Vrai si tous les mots recherchés se trouvent dans l'une des valeurs
export function correspond(valeurs, terme) {
  const mots = normaliser(terme).split(/\s+/).filter(Boolean);
  if (mots.length === 0) return true;
  const texte = normaliser(valeurs.join(' '));
  return mots.every((m) => texte.includes(m));
}