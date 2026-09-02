import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Package,
  Plus,
  Search,
  Trash2,
  Pencil,
  Boxes,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Filter,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";

import "./InventoryPage.css";

type InventoryObject = {
  id: number;
  name: string;
  code: string;
  category: string;
  quantity: number;
  available: number;
  status: "Disponible" | "Prestado" | "Stock bajo";
  location: string;
  emoji: string;
};

function InventoryPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [objects, setObjects] = useState<InventoryObject[]>([
    {
      id: 1,
      name: "Proyector Epson X49",
      code: "DB-001",
      category: "Audiovisuales",
      quantity: 4,
      available: 3,
      status: "Disponible",
      location: "Sala audiovisual",
      emoji: "📽️",
    },
    {
      id: 2,
      name: "Micrófono inalámbrico",
      code: "DB-002",
      category: "Audio",
      quantity: 8,
      available: 8,
      status: "Disponible",
      location: "Depósito principal",
      emoji: "🎙️",
    },
    {
      id: 3,
      name: "Laptop Lenovo IdeaPad",
      code: "DB-003",
      category: "Computación",
      quantity: 10,
      available: 6,
      status: "Prestado",
      location: "Sala de computación",
      emoji: "💻",
    },
    {
      id: 4,
      name: "Balón de fútbol",
      code: "DB-004",
      category: "Deportes",
      quantity: 15,
      available: 12,
      status: "Disponible",
      location: "Depósito deportivo",
      emoji: "⚽",
    },
    {
      id: 5,
      name: "Sillas plásticas",
      code: "DB-005",
      category: "Mobiliario",
      quantity: 40,
      available: 5,
      status: "Stock bajo",
      location: "Almacén",
      emoji: "🪑",
    },
    {
      id: 6,
      name: "Microscopio escolar",
      code: "DB-006",
      category: "Laboratorio",
      quantity: 6,
      available: 6,
      status: "Disponible",
      location: "Laboratorio",
      emoji: "🔬",
    },
  ]);

  const categories = [
    "Todas",
    ...Array.from(new Set(objects.map((object) => object.category))),
  ];

  const filteredObjects = useMemo(() => {
    return objects.filter((object) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        object.name.toLowerCase().includes(searchText) ||
        object.code.toLowerCase().includes(searchText) ||
        object.category.toLowerCase().includes(searchText);

      const matchesCategory =
        categoryFilter === "Todas" ||
        object.category === categoryFilter;

      const matchesStatus =
        statusFilter === "Todos" ||
        object.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [objects, search, categoryFilter, statusFilter]);

  const totalObjects = objects.reduce(
    (total, object) => total + object.quantity,
    0
  );

  const totalAvailable = objects.reduce(
    (total, object) => total + object.available,
    0
  );

  const totalBorrowed = totalObjects - totalAvailable;

  const lowStock = objects.filter(
    (object) => object.status === "Stock bajo"
  ).length;

  const deleteObject = (object: InventoryObject) => {
    const confirmDelete = window.confirm(
      `¿Seguro que quieres eliminar "${object.name}" del inventario?`
    );

    if (!confirmDelete) return;

    setObjects((currentObjects) =>
      currentObjects.filter((item) => item.id !== object.id)
    );
  };

  const editObject = (object: InventoryObject) => {
    alert(
      `Editar objeto: ${object.name}\n\nLuego podemos crear el formulario completo de edición.`
    );
  };

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("Todas");
    setStatusFilter("Todos");
  };

  return (
    <div className="inventory-page">
      {/* VOLVER AL HOME */}

      <button
        className="inventory-back-button"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={18} />
        Volver al inicio
      </button>

      {/* HEADER */}

      <header className="inventory-header">
        <div>
          <span className="inventory-eyebrow">
            GESTIÓN DE RECURSOS
          </span>

          <h1>Inventario</h1>

          <p>
            Administra y controla todos los objetos, materiales y
            recursos del Colegio Don Bosco.
          </p>
        </div>

        <button
          className="add-object-button"
          onClick={() => navigate("/inventario/nuevo")}
        >
          <Plus size={19} />
          Registrar objeto
        </button>
      </header>

      {/* ESTADÍSTICAS */}

      <section className="inventory-stats">
        <div className="inventory-stat-card">
          <div className="inventory-stat-icon blue">
            <Boxes size={24} />
          </div>

          <div>
            <span>Total de objetos</span>
            <strong>{totalObjects}</strong>
            <small>Unidades registradas</small>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon green">
            <CheckCircle2 size={24} />
          </div>

          <div>
            <span>Disponibles</span>
            <strong>{totalAvailable}</strong>
            <small>Listos para utilizar</small>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon orange">
            <Clock3 size={24} />
          </div>

          <div>
            <span>Prestados</span>
            <strong>{totalBorrowed}</strong>
            <small>Fuera del almacén</small>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon red">
            <AlertTriangle size={24} />
          </div>

          <div>
            <span>Stock bajo</span>
            <strong>{lowStock}</strong>
            <small>Requieren atención</small>
          </div>
        </div>
      </section>

      {/* PANEL */}

      <section className="inventory-panel">
        <div className="inventory-panel-header">
          <div>
            <h2>Objetos registrados</h2>

            <p>{filteredObjects.length} objetos encontrados</p>
          </div>

          <button className="options-button">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* BUSCADOR Y FILTROS */}

        <div className="inventory-toolbar">
          <div className="inventory-search">
            <Search size={19} />

            <input
              type="text"
              placeholder="Buscar por nombre, código o categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-select">
            <Filter size={17} />

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "Todas"
                    ? "Todas las categorías"
                    : category}
                </option>
              ))}
            </select>

            <ChevronDown size={16} />
          </div>

          <div className="filter-select">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="Todos">
                Todos los estados
              </option>

              <option value="Disponible">
                Disponible
              </option>

              <option value="Prestado">
                Prestado
              </option>

              <option value="Stock bajo">
                Stock bajo
              </option>
            </select>

            <ChevronDown size={16} />
          </div>
        </div>

        {/* TABLA */}

        <div className="inventory-table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>OBJETO</th>
                <th>CATEGORÍA</th>
                <th>UBICACIÓN</th>
                <th>EXISTENCIAS</th>
                <th>ESTADO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>

            <tbody>
              {filteredObjects.map((object) => (
                <tr key={object.id}>
                  <td>
                    <div className="inventory-object">
                      <div className="inventory-object-image">
                        {object.emoji}
                      </div>

                      <div>
                        <strong>{object.name}</strong>
                        <span>{object.code}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="category-badge">
                      {object.category}
                    </span>
                  </td>

                  <td>
                    <span className="location-text">
                      {object.location}
                    </span>
                  </td>

                  <td>
                    <div className="stock-info">
                      <strong>{object.available}</strong>

                      <span>/ {object.quantity}</span>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`inventory-status ${
                        object.status === "Disponible"
                          ? "available"
                          : object.status === "Prestado"
                          ? "borrowed"
                          : "low"
                      }`}
                    >
                      <span className="status-dot"></span>

                      {object.status}
                    </span>
                  </td>

                  <td>
                    <div className="inventory-actions">
                      <button
                        className="edit-button"
                        onClick={() =>
                          editObject(object)
                        }
                        title="Editar objeto"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteObject(object)
                        }
                        title="Eliminar objeto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredObjects.length === 0 && (
            <div className="empty-inventory">
              <div className="empty-inventory-icon">
                <Package size={34} />
              </div>

              <h3>No encontramos objetos</h3>

              <p>
                Prueba con otro nombre o cambia los filtros.
              </p>

              <button onClick={clearFilters}>
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {filteredObjects.length > 0 && (
          <div className="inventory-panel-footer">
            <span>
              Mostrando {filteredObjects.length} de{" "}
              {objects.length} registros
            </span>

            <div className="inventory-footer-summary">
              <span>
                <i className="summary-dot green"></i>
                {totalAvailable} disponibles
              </span>

              <span>
                <i className="summary-dot orange"></i>
                {totalBorrowed} prestados
              </span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default InventoryPage;