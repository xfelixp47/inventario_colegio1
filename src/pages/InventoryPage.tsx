
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Plus,
  Search,
  Package,
  Pencil,
  Trash2,
  Handshake,
} from "lucide-react";

import { authRepository } from "../repositories/authRepository";

import {
  inventoryStore,
  type InventoryItem,
} from "../services/inventoryStore";

import "./InventoryPage.css";

function InventoryPage() {
  const navigate = useNavigate();

  const user = authRepository.getCurrentUser();

  const isAdmin = user?.role === "ADMIN";

  const canRequest =
    user?.role === "PROFESOR" ||
    user?.role === "ESTUDIANTE";

  const [objects, setObjects] = useState<InventoryItem[]>(
    () => inventoryStore.getItems()
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [status, setStatus] = useState("Todos");

  useEffect(() => {
    const reload = () => {
      setObjects(inventoryStore.getItems());
    };

    window.addEventListener("storage", reload);
    window.addEventListener("donbosco:changed", reload);

    return () => {
      window.removeEventListener("storage", reload);
      window.removeEventListener("donbosco:changed", reload);
    };
  }, []);

  const categories = [
    "Todas",
    ...Array.from(new Set(objects.map((item) => item.category))),
  ];

  const filteredObjects = useMemo(() => {
    return objects.filter((item) => {
      const q = search.toLowerCase();

      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      const matchesCategory =
        category === "Todas" || item.category === category;

      const matchesStatus =
        status === "Todos" || item.status === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [objects, search, category, status]);

  const total = objects.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const available = objects.reduce(
    (sum, item) => sum + item.available,
    0
  );

  const borrowed = total - available;

  const deleteObject = (item: InventoryItem) => {
    if (!isAdmin) return;

    if (item.available < item.quantity) {
      alert(
        "No puedes eliminar este objeto porque tiene préstamos activos."
      );
      return;
    }

    if (!confirm(`¿Eliminar "${item.name}"?`)) return;

    const updated = objects.filter((i) => i.id !== item.id);

    inventoryStore.setItems(updated);
    setObjects(updated);
  };

  const editObject = (item: InventoryItem) => {
    if (!isAdmin) return;

    const name = prompt("Nombre del objeto:", item.name)?.trim();
    if (!name) return;

    const quantityText = prompt(
      "Cantidad total:",
      String(item.quantity)
    );

    if (quantityText === null) return;

    const quantity = Number(quantityText);
    const borrowedUnits = item.quantity - item.available;

    if (
      !Number.isInteger(quantity) ||
      quantity < borrowedUnits
    ) {
      alert(
        "La cantidad no puede ser menor que las unidades prestadas."
      );
      return;
    }

    const newCategory =
      prompt("Categoría:", item.category)?.trim() ||
      item.category;

    const location =
      prompt("Ubicación:", item.location)?.trim() ||
      item.location;

    const updated = objects.map((i) =>
      i.id === item.id
        ? {
            ...i,
            name,
            quantity,
            available: quantity - borrowedUnits,
            category: newCategory,
            location,
          }
        : i
    );

    inventoryStore.setItems(updated);
    setObjects(inventoryStore.getItems());
  };

  const requestObject = (item: InventoryItem) => {
    if (!canRequest || item.available < 1) return;

    navigate("/prestamos/nuevo", {
      state: {
        object: item.name,
      },
    });
  };

  const inputStyle: React.CSSProperties = {
    padding: 12,
    border: "1px solid #dbe2ea",
    borderRadius: 10,
    background: "white",
  };

  return (
    <div className="inventory-page">
      <button
        className="inventory-back-button"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={18} />
        Volver al inicio
      </button>

      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 15,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <div>
          <h1>Inventario</h1>
          <p>
            Gestión de objetos del Colegio Don Bosco.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => navigate("/inventario/nuevo")}
            style={buttonStyle("#1769df")}
          >
            <Plus size={18} />
            Agregar objeto
          </button>
        )}
      </header>

      <section
        style={{
          display: "flex",
          gap: 15,
          flexWrap: "wrap",
          marginBottom: 25,
        }}
      >
        <StatCard title="Total de objetos" value={total} />
        <StatCard title="Disponibles" value={available} />
        <StatCard title="Prestados" value={borrowed} />
        <StatCard
          title="Tipos de objetos"
          value={objects.length}
        />
      </section>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 25,
        }}
      >
        <div style={{ position: "relative", flex: 1 }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              top: 13,
              left: 12,
              color: "#64748b",
            }}
          />

          <input
            placeholder="Buscar objetos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              ...inputStyle,
              width: "100%",
              boxSizing: "border-box",
              paddingLeft: 40,
            }}
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyle}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={inputStyle}
        >
          {[
            "Todos",
            "Disponible",
            "Prestado",
            "Stock bajo",
          ].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 20,
        }}
      >
        {filteredObjects.map((item) => (
          <div
            key={item.id}
            style={{
              background: "white",
              borderRadius: 18,
              padding: 24,
              boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                fontSize: 42,
                marginBottom: 14,
              }}
            >
              {item.emoji}
            </div>

            <h3 style={{ marginBottom: 7 }}>
              {item.name}
            </h3>

            <p
              style={{
                color: "#64748b",
                fontSize: 14,
              }}
            >
              {item.code} · {item.category}
            </p>

            <p style={{ fontSize: 14 }}>
              Ubicación: {item.location}
            </p>

            <p>
              <strong>{item.available}</strong> de{" "}
              <strong>{item.quantity}</strong> disponibles
            </p>

            <span
              style={{
                background:
                  item.status === "Disponible"
                    ? "#dcfce7"
                    : item.status === "Stock bajo"
                    ? "#fef3c7"
                    : "#fee2e2",
                padding: "6px 11px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {item.status}
            </span>

            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 20,
                flexWrap: "wrap",
              }}
            >
              {isAdmin && (
                <>
                  <button
                    style={buttonStyle("#2563eb")}
                    onClick={() => editObject(item)}
                  >
                    <Pencil size={16} />
                    Editar
                  </button>

                  <button
                    style={buttonStyle("#dc2626")}
                    onClick={() => deleteObject(item)}
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </>
              )}

              {canRequest && item.available > 0 && (
                <button
                  style={buttonStyle("#16a34a")}
                  onClick={() => requestObject(item)}
                >
                  <Handshake size={16} />
                  Solicitar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredObjects.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: 50,
            color: "#64748b",
          }}
        >
          <Package
            size={40}
            style={{ margin: "auto" }}
          />

          <h3>No se encontraron objetos</h3>

          <p>
            Prueba cambiando la búsqueda o los filtros.
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 160,
        background: "white",
        borderRadius: 15,
        padding: 22,
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          color: "#64748b",
          fontSize: 14,
        }}
      >
        {title}
      </div>

      <strong style={{ fontSize: 29 }}>
        {value}
      </strong>
    </div>
  );
}

function buttonStyle(
  color: string
): React.CSSProperties {
  return {
    background: color,
    color: "white",
    padding: "10px 14px",
    border: "none",
    borderRadius: 9,
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    fontWeight: 600,
    cursor: "pointer",
  };
}

export default InventoryPage;
