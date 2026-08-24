import { useState } from "react";
import { Package, Plus, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function InventoryPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [objects, setObjects] = useState([
    {
      id: 1,
      name: "Proyector Epson X49",
      category: "Audiovisuales",
      quantity: 4,
      status: "Disponible",
    },
    {
      id: 2,
      name: "Micrófono inalámbrico",
      category: "Audio",
      quantity: 8,
      status: "Disponible",
    },
    {
      id: 3,
      name: "Laptop Lenovo",
      category: "Computación",
      quantity: 10,
      status: "Prestado",
    },
    {
      id: 4,
      name: "Balón de fútbol",
      category: "Deportes",
      quantity: 15,
      status: "Disponible",
    },
  ]);

  const filteredObjects = objects.filter((object) =>
    object.name.toLowerCase().includes(search.toLowerCase())
  );

  const deleteObject = (id: number) => {
    const confirmDelete = window.confirm(
      "¿Seguro que quieres eliminar este objeto?"
    );

    if (confirmDelete) {
      setObjects(objects.filter((object) => object.id !== id));
    }
  };

  return (
    <div style={{ padding: "35px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1>Inventario</h1>
          <p>Administra todos los objetos del colegio.</p>
        </div>

        <button
          onClick={() => navigate("/inventario/nuevo")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
            border: "none",
            borderRadius: "10px",
            background: "#ffc83d",
            color: "#073776",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          <Plus size={18} />
          Registrar objeto
        </button>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: "15px",
          padding: "25px",
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "10px 15px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "25px",
          }}
        >
          <Search size={18} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar objeto..."
            style={{
              width: "100%",
              border: "none",
              outline: "none",
            }}
          />
        </div>

        {filteredObjects.map((object) => (
          <div
            key={object.id}
            style={{
              display: "grid",
              gridTemplateColumns: "50px 1fr 150px 100px 70px",
              alignItems: "center",
              gap: "15px",
              borderBottom: "1px solid #eee",
              padding: "15px 0",
            }}
          >
            <Package color="#1769df" />

            <div>
              <strong>{object.name}</strong>

              <div
                style={{
                  color: "#888",
                  fontSize: "12px",
                }}
              >
                {object.category}
              </div>
            </div>

            <div>
              Cantidad: <strong>{object.quantity}</strong>
            </div>

            <div>{object.status}</div>

            <button
              onClick={() => deleteObject(object.id)}
              style={{
                border: "none",
                background: "#fff1f1",
                color: "#d64040",
                width: "38px",
                height: "38px",
                borderRadius: "9px",
                cursor: "pointer",
              }}
            >
              <Trash2 size={17} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InventoryPage;