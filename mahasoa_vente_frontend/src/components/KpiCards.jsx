function KpiCards({ totalProducts }) {
  return (
    <div className="row my-4">
      <div className="col-md-4 mb-3">
        <div className="card text-white bg-primary shadow-sm">
          <div className="card-body">
            <h5 className="card-title">📦 Total Produits</h5>
            <p className="card-text fs-3 fw-bold">{totalProducts}</p>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-3">
        <div className="card text-white bg-success shadow-sm">
          <div className="card-body">
            <h5 className="card-title">💰 Ventes du Jour</h5>
            <p className="card-text fs-3 fw-bold">0 Ar</p>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-3">
        <div className="card text-white bg-warning shadow-sm">
          <div className="card-body">
            <h5 className="card-title">⚠️ Stocks Faibles</h5>
            <p className="card-text fs-3 fw-bold">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KpiCards;