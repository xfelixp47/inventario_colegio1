
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Save } from "lucide-react";

import { inventoryStore } from "../services/inventoryStore";

export default function NewObjectPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState("Almacén");

  const categories = [
    "Computación",
    "Audiovisuales",
    "Deportes",
    "Audio",
    "Mobiliario",
    "Laboratorio",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !category || quantity < 1) {
      alert("Completa correctamente todos los campos.");
      return;
    }

    const items = inventoryStore.getItems();

    const nextNumber =
      Math.max(
        0,
        ...items.map(
          (item) => Number(item.code.replace("DB-", "")) || 0
        )
      ) + 1;

    inventoryStore.setItems([
      ...items,
      {
        id: Date.now(),
        name: name.trim(),
        code: `DB-${String(nextNumber).padStart(3, "0")}`,
        category,
        quantity,
        available: quantity,
        location: location.trim() || "Almacén",
        emoji: "📦",
        status: "Disponible",
      },
    ]);

    alert("Objeto agregado correctamente.");
    navigate("/inventario");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: 13,
    borderRadius: 10,
    border: "1px solid #dce3ee",
    marginTop: 8,
    marginBottom: 20,
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 35 }}>
      <button
        onClick={() => navigate("/inventario")}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 25,
        }}
      >
        <ArrowLeft size={18} />
        Volver al inventario
      </button>

      <div
        style={{
          background: "white",
          padding: 35,
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <Package size={38} color="#1769df" />
        <h1>Registrar objeto</h1>
        <p style={{ color: "#64748b", marginBottom: 28 }}>
          Añade materiales al inventario del colegio.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Nombre del objeto</label>
          <input
            style={inputStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Proyector Epson"
            required
          />

          <label>Categoría</label>
          <select
            style={inputStyle}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label>Cantidad</label>
          <input
            type="number"
            min={1}
            style={inputStyle}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />

          <label>Ubicación</label>
          <input
            style={inputStyle}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ej: Almacén principal"
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: 15,
              border: "none",
              borderRadius: 10,
              background: "#1769df",
              color: "white",
              cursor: "pointer",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
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
