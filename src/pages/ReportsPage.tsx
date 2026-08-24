function ReportsPage() {
  return (
    <div style={{ padding: "35px" }}>
      <h1>Reportes</h1>

      <p>
        Aquí podrás consultar estadísticas y movimientos del inventario.
      </p>

      <div
        style={{
          marginTop: "30px",
          padding: "35px",
          background: "white",
          borderRadius: "15px",
        }}
      >
        <h2>Resumen general</h2>

        <p>Objetos registrados: 1248</p>
        <p>Objetos disponibles: 932</p>
        <p>Objetos prestados: 216</p>
        <p>Categorías: 28</p>
      </div>
    </div>
  );
}

export default ReportsPage;