
import {
  useEffect,
  useMemo,
  useState,
} from "react";

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

  // OBJETOS DEL INVENTARIO

  const [objects, setObjects] = useState<InventoryItem[]>(
    () => inventoryStore.getItems()
  );

  // BUSCADOR Y FILTROS

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("Todas");

  const [statusFilter, setStatusFilter] =
    useState("Todos");

  // ACTUALIZAR INVENTARIO CUANDO HAY CAMBIOS

  useEffect(() => {
    const reload = () => {
      setObjects(inventoryStore.getItems());
    };

    window.addEventListener("storage", reload);

    window.addEventListener(
      "donbosco:changed",
      reload
    );

    return () => {
      window.removeEventListener("storage", reload);

      window.removeEventListener(
        "donbosco:changed",
        reload
      );
    };
  }, []);

  // CATEGORÍAS

  const categories = [
    "Todas",
    ...Array.from(
      new Set(
        objects.map((object) => object.category)
      )
    ),
  ];

  // CALCULAR ESTADO ACTUAL DEL OBJETO

  const getObjectStatus = (
    object: InventoryItem
  ): InventoryItem["status"] => {
    if (object.available <= 0) {
      return "Prestado";
    }

    const minimum = Math.max(
      1,
      Math.floor(object.quantity * 0.2)
    );

    if (object.available <= minimum) {
      return "Stock bajo";
    }

    return "Disponible";
  };

  // OBJETOS FILTRADOS

  const filteredObjects = useMemo(() => {
    return objects.filter((object) => {
      const text = search.toLowerCase();

      const matchesSearch =
        object.name.toLowerCase().includes(text) ||
        object.code.toLowerCase().includes(text) ||
        object.category.toLowerCase().includes(text);

      const matchesCategory =
        categoryFilter === "Todas" ||
        object.category === categoryFilter;

      const currentStatus = getObjectStatus(object);

      const matchesStatus =
        statusFilter === "Todos" ||
        currentStatus === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [objects, search, categoryFilter, statusFilter]);

  // ESTADÍSTICAS

  const totalObjects = objects.reduce(
    (total, object) => total + object.quantity,
    0
  );

  const totalAvailable = objects.reduce(
    (total, object) => total + object.available,
    0
  );

  const totalBorrowed =
    totalObjects - totalAvailable;

  const lowStock = objects.filter(
    (object) => getObjectStatus(object) === "Stock bajo"
  ).length;

  // ELIMINAR OBJETO

  const deleteObject = (object: InventoryItem) => {
    if (!isAdmin) return;

    const borrowed =
      object.quantity - object.available;

    if (borrowed > 0) {
      alert(
        "No puedes eliminar este objeto porque tiene unidades prestadas."
      );
      return;
    }

    const confirmDelete = window.confirm(
      `¿Seguro que quieres eliminar "${object.name}"?`
    );

    if (!confirmDelete) return;

    const updated = objects.filter(
      (item) => item.id !== object.id
    );

    inventoryStore.setItems(updated);

    setObjects(inventoryStore.getItems());

    alert("Objeto eliminado correctamente.");
  };

  // EDITAR OBJETO

  const editObject = (object: InventoryItem) => {
    if (!isAdmin) return;

    const newName = window.prompt(
      "Nombre del objeto:",
      object.name
    );

    if (!newName?.trim()) return;

    const quantityText = window.prompt(
      "Cantidad total de unidades:",
      String(object.quantity)
    );

    if (quantityText === null) return;

    const newQuantity = Number(quantityText);

    const borrowed =
      object.quantity - object.available;

    if (
      !Number.isInteger(newQuantity) ||
      newQuantity < borrowed ||
      newQuantity < 1
    ) {
      alert(
        "La cantidad no es válida o es menor que las unidades prestadas."
      );
      return;
    }

    const newCategory =
      window.prompt(
        "Categoría:",
        object.category
      )?.trim() || object.category;

    const newLocation =
      window.prompt(
        "Ubicación:",
        object.location
      )?.trim() || object.location;

    const updated = objects.map((item) =>
      item.id === object.id
        ? {
            ...item,
            name: newName.trim(),
            quantity: newQuantity,
            available: newQuantity - borrowed,
            category: newCategory,
            location: newLocation,
          }
        : item
    );

    inventoryStore.setItems(updated);

    setObjects(inventoryStore.getItems());

    alert("Objeto actualizado correctamente.");
  };

  // SOLICITAR OBJETO

  const requestObject = (object: InventoryItem) => {
    if (!canRequest) return;

    if (object.available <= 0) {
      alert(
        "Este objeto no tiene unidades disponibles."
      );
      return;
    }

    navigate("/prestamos/nuevo", {
      state: {
        object: object.name,
      },
    });
  };

  // LIMPIAR FILTROS

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("Todas");
    setStatusFilter("Todos");
  };

  return (
    <div className="inventory-page">
      {/* BOTÓN VOLVER */}

      <button
        className="inventory-back-button"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={18} />
        Volver al inicio
      </button>

      {/* ENCABEZADO */}

      <header className="inventory-header">
        <div>
          <span className="inventory-eyebrow">
            {isAdmin
              ? "GESTIÓN DE RECURSOS"
              : "CONSULTA DE RECURSOS"}
          </span>

          <h1>Inventario</h1>

          <p>
            {isAdmin
              ? "Administra y controla todos los objetos, materiales y recursos del Colegio Don Bosco."
              : "Consulta los objetos disponibles y solicita los materiales que necesites."}
          </p>
        </div>

        {isAdmin && (
          <button
            className="add-object-button"
            onClick={() =>
              navigate("/inventario/nuevo")
            }
          >
            <Plus size={19} />
            Registrar objeto
          </button>
        )}
      </header>

      {/* ESTADÍSTICAS */}

      <section className="inventory-stats">
        {/* TOTAL */}

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

        {/* DISPONIBLES */}

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

        {/* PRESTADOS */}

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

        {/* STOCK BAJO */}

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

      {/* PANEL DEL INVENTARIO */}

      <section className="inventory-panel">
        <div className="inventory-panel-header">
          <div>
            <h2>Objetos registrados</h2>

            <p>
              {filteredObjects.length} objetos encontrados
            </p>
          </div>

          {isAdmin && (
            <button
              className="options-button"
              onClick={clearFilters}
              title="Limpiar filtros"
            >
              <MoreHorizontal size={20} />
            </button>
          )}
        </div>

        {/* BÚSQUEDA Y FILTROS */}

        <div className="inventory-toolbar">
          <div className="inventory-search">
            <Search size={19} />

            <input
              type="text"
              placeholder="Buscar por nombre, código o categoría..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          {/* FILTRAR POR CATEGORÍA */}

          <div className="filter-select">
            <Filter size={17} />

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category === "Todas"
                    ? "Todas las categorías"
                    : category}
                </option>
              ))}
            </select>

            <ChevronDown size={16} />
          </div>

          {/* FILTRAR POR ESTADO */}

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

                <th>
                  {isAdmin
                    ? "ACCIONES"
                    : canRequest
                    ? "SOLICITAR"
                    : "ACCESO"}
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredObjects.map((object) => {
                const status = getObjectStatus(object);

                const borrowed =
                  object.quantity - object.available;

                return (
                  <tr key={object.id}>
                    {/* OBJETO */}

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

                    {/* CATEGORÍA */}

                    <td>
                      <span className="category-badge">
                        {object.category}
                      </span>
                    </td>

                    {/* UBICACIÓN */}

                    <td>
                      <span className="location-text">
                        {object.location}
                      </span>
                    </td>

                    {/* EXISTENCIAS */}

                    <td>
                      <div className="stock-info">
                        <strong>{object.available}</strong>

                        <span>
                          / {object.quantity}
                        </span>
                      </div>

                      {borrowed > 0 && (
                        <small
                          style={{
                            color: "#d97706",
                            fontWeight: 600,
                            display: "block",
                            marginTop: 5,
                          }}
                        >
                          {borrowed} prestado(s)
                        </small>
                      )}
                    </td>

                    {/* ESTADO */}

                    <td>
                      <span
                        className={`inventory-status ${
                          status === "Disponible"
                            ? "available"
                            : status === "Prestado"
                            ? "borrowed"
                            : "low"
                        }`}
                      >
                        <span className="status-dot"></span>
                        {status}
                      </span>
                    </td>

                    {/* ACCIONES */}

                    <td>
                      {isAdmin && (
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
                      )}

                      {canRequest && (
                        <button
                          className="edit-button"
                          onClick={() =>
                            requestObject(object)
                          }
                          disabled={object.available <= 0}
                          title={
                            object.available > 0
                              ? "Solicitar objeto"
                              : "Sin existencias"
                          }
                        >
                          <Handshake size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* SIN RESULTADOS */}

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

        {/* PIE DEL PANEL */}

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
