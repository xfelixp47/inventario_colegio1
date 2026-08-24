function CategoriesPage() {
  const categories = [
    "Computación",
    "Audiovisuales",
    "Audio",
    "Deportes",
    "Mobiliario",
    "Laboratorio",
  ];

  return (
    <div style={{ padding: "35px" }}>
      <h1>Categorías</h1>
      <p>Clasificación de los objetos del colegio.</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {categories.map((category) => (
          <div
            key={category}
            style={{
              padding: "25px",
              background: "white",
              borderRadius: "15px",
            }}
          >
            <h3>{category}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoriesPage;