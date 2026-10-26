function ProductTable({ data }) {
  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white fw-bold">
        Liste des articles enregistrés
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0 align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nom / Désignation</th>
                <th>Prix</th>
                <th>Quantité en Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td className="fw-semibold">{item.nom || item.name || 'Produit sans nom'}</td>
                    <td>{item.prix || item.price || '0'} Ar</td>
                    <td>{item.quantite || item.stock || '0'}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2">Modifier</button>
                      <button className="btn btn-sm btn-outline-danger">Supprimer</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    Aucune donnée trouvée dans la base de données.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductTable;