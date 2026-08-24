import { useState } from "react";
import { ArrowLeft, Package, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NewObjectPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !category || quantity <= 0) {
      alert("Completa correctamente todos los campos.");
      return;
    }

    const newObject = {
      id: Date.now(),
      name,
      category,
      quantity,
      status: "Disponible",
    };

    console.log("Objeto registrado:", newObject);

    alert("Objeto registrado correctamente.");

    navigate("/inventario");
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "700px",
        margin: "auto",
      }}
    >
      <button
        onClick={() => navigate("/inventario")}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "25px",
        }}
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      <div
        style={{
          background: "white",
          padding: "35px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <Package size={38} color="#1769df" />

        <h1>Registrar objeto</h1>

        <p style={{ color: "#888" }}>
          Añade un nuevo objeto al inventario del colegio.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Nombre del objeto</label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Proyector Epson"
            style={inputStyle}
          />

          <label>Categoría</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
          >
            <option value="">Seleccionar categoría</option>
            <option value="Computación">Computación</option>
            <option value="Audiovisuales">Audiovisuales</option>
            <option value="Deportes">Deportes</option>
            <option value="Audio">Audio</option>
            <option value="Mobiliario">Mobiliario</option>
            <option value="Laboratorio">Laboratorio</option>
          </select>

          <label>Cantidad</label>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              height: "50px",
              border: "none",
              borderRadius: "12px",
              background: "#1769df",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: "15px",
            }}
          >
            <Save size={18} />

            Guardar objeto
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  height: "48px",
  padding: "0 15px",
  border: "1px solid #dfe4ea",
  borderRadius: "10px",
  marginTop: "7px",
  marginBottom: "20px",
  outline: "none",
};

export default NewObjectPage;