import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Plus,
  Search,
  FolderOpen,
  Package,
  Pencil,
  Trash2,
  Layers3,
  X,
  Save,
} from "lucide-react";

import "./CategoriesPage.css";

type Category = {
  id: number;
  name: string;
  description: string;
  objects: number;
  icon: string;
};

function CategoriesPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: "Computación",
      description: "Laptops, computadoras y accesorios tecnológicos.",
      objects: 18,
      icon: "💻",
    },
    {
      id: 2,
      name: "Audiovisuales",
      description: "Proyectores, pantallas y equipos audiovisuales.",
      objects: 12,
      icon: "📽️",
    },
    {
      id: 3,
      name: "Audio",
      description: "Micrófonos, parlantes y equipos de sonido.",
      objects: 15,
      icon: "🎙️",
    },
    {
      id: 4,
      name: "Deportes",
      description: "Balones, redes y materiales deportivos.",
      objects: 27,
      icon: "⚽",
    },
    {
      id: 5,
      name: "Mobiliario",
      description: "Mesas, sillas, estantes y muebles escolares.",
      objects: 48,
      icon: "🪑",
    },
    {
      id: 6,
      name: "Laboratorio",
      description: "Materiales y equipos utilizados en laboratorio.",
      objects: 21,
      icon: "🔬",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newIcon, setNewIcon] = useState("📦");

  const filteredCategories = useMemo(() => {
    const text = search.toLowerCase();

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(text) ||
        category.description.toLowerCase().includes(text)
    );
  }, [categories, search]);

  const totalObjects = categories.reduce(
    (total, category) => total + category.objects,
    0
  );

  const biggestCategory = categories.reduce<Category | null>(
    (largest, category) => {
      if (!largest) return category;

      return category.objects > largest.objects
        ? category
        : largest;
    },
    null
  );

  const handleAddCategory = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!newName.trim()) {
      alert("Debes ingresar un nombre para la categoría.");
      return;
    }

    const categoryExists = categories.some(
      (category) =>
        category.name.toLowerCase() ===
        newName.trim().toLowerCase()
    );

    if (categoryExists) {
      alert("Ya existe una categoría con ese nombre.");
      return;
    }

    const newCategory: Category = {
      id: Date.now(),
      name: newName.trim(),
      description:
        newDescription.trim() ||
        "Sin descripción registrada.",
      objects: 0,
      icon: newIcon || "📦",
    };

    setCategories((current) => [
      ...current,
      newCategory,
    ]);

    setNewName("");
    setNewDescription("");
    setNewIcon("📦");
    setShowModal(false);
  };

  const editCategory = (category: Category) => {
    const newCategoryName = window.prompt(
      "Nuevo nombre de la categoría:",
      category.name
    );

    if (!newCategoryName?.trim()) return;

    setCategories((current) =>
      current.map((item) =>
        item.id === category.id
          ? {
              ...item,
              name: newCategoryName.trim(),
            }
          : item
      )
    );
  };

  const deleteCategory = (category: Category) => {
    if (category.objects > 0) {
      const confirmDelete = window.confirm(
        `"${category.name}" tiene ${category.objects} objetos registrados. ¿Seguro que quieres eliminarla?`
      );

      if (!confirmDelete) return;
    } else {
      const confirmDelete = window.confirm(
        `¿Seguro que quieres eliminar la categoría "${category.name}"?`
      );

      if (!confirmDelete) return;
    }

    setCategories((current) =>
      current.filter(
        (item) => item.id !== category.id
      )
    );
  };

  return (
    <div className="categories-page">
      {/* VOLVER */}

      <button
        className="categories-back-button"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={18} />
        Volver al inicio
      </button>

      {/* HEADER */}

      <header className="categories-header">
        <div>
          <span className="categories-eyebrow">
            ORGANIZACIÓN DEL INVENTARIO
          </span>

          <h1>Categorías</h1>

          <p>
            Organiza los objetos del Colegio Don Bosco en
            diferentes grupos para encontrarlos y
            administrarlos fácilmente.
          </p>
        </div>

        <button
          className="new-category-button"
          onClick={() => setShowModal(true)}
        >
          <Plus size={19} />
          Nueva categoría
        </button>
      </header>

      {/* ESTADÍSTICAS */}

      <section className="categories-stats">
        <div className="category-stat-card">
          <div className="category-stat-icon blue">
            <FolderOpen size={24} />
          </div>

          <div>
            <span>Categorías</span>
            <strong>{categories.length}</strong>
            <small>Categorías registradas</small>
          </div>
        </div>

        <div className="category-stat-card">
          <div className="category-stat-icon green">
            <Package size={24} />
          </div>

          <div>
            <span>Objetos clasificados</span>
            <strong>{totalObjects}</strong>
            <small>Objetos organizados</small>
          </div>
        </div>

        <div className="category-stat-card">
          <div className="category-stat-icon orange">
            <Layers3 size={24} />
          </div>

          <div>
            <span>Mayor categoría</span>

            <strong>
              {biggestCategory?.objects ?? 0}
            </strong>

            <small>
              {biggestCategory?.name ?? "Sin categorías"}
            </small>
          </div>
        </div>
      </section>

      {/* PANEL */}

      <section className="categories-panel">
        <div className="categories-panel-header">
          <div>
            <h2>Categorías registradas</h2>

            <p>
              {filteredCategories.length} categorías
              encontradas
            </p>
          </div>

          <div className="categories-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Buscar categoría..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>
        </div>

        {/* GRID */}

        {filteredCategories.length > 0 ? (
          <div className="categories-grid">
            {filteredCategories.map((category) => (
              <article
                className="category-card"
                key={category.id}
              >
                <div className="category-card-top">
                  <div className="category-main-icon">
                    {category.icon}
                  </div>

                  <div className="category-actions">
                    <button
                      className="category-edit-button"
                      onClick={() =>
                        editCategory(category)
                      }
                      title="Editar categoría"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      className="category-delete-button"
                      onClick={() =>
                        deleteCategory(category)
                      }
                      title="Eliminar categoría"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="category-card-content">
                  <h3>{category.name}</h3>

                  <p>
                    {category.description}
                  </p>
                </div>

                <div className="category-card-footer">
                  <div>
                    <Package size={15} />

                    <span>
                      {category.objects} objetos
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      navigate("/inventario")
                    }
                  >
                    Ver objetos
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-categories">
            <div className="empty-category-icon">
              <FolderOpen size={35} />
            </div>

            <h3>No encontramos categorías</h3>

            <p>
              Prueba con otro término de búsqueda.
            </p>

            <button onClick={() => setSearch("")}>
              Limpiar búsqueda
            </button>
          </div>
        )}
      </section>

      {/* MODAL NUEVA CATEGORÍA */}

      {showModal && (
        <div
          className="category-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              setShowModal(false);
            }
          }}
        >
          <div className="category-modal">
            <div className="category-modal-header">
              <div>
                <span>NUEVA CATEGORÍA</span>
                <h2>Crear categoría</h2>
              </div>

              <button
                onClick={() => setShowModal(false)}
              >
                <X size={19} />
              </button>
            </div>

            <form
              className="category-form"
              onSubmit={handleAddCategory}
            >
              <div className="category-form-group">
                <label>
                  Icono
                </label>

                <input
                  type="text"
                  value={newIcon}
                  maxLength={4}
                  onChange={(e) =>
                    setNewIcon(e.target.value)
                  }
                  className="category-icon-input"
                />
              </div>

              <div className="category-form-group">
                <label>
                  Nombre de la categoría
                </label>

                <input
                  type="text"
                  placeholder="Ej: Biblioteca"
                  value={newName}
                  onChange={(e) =>
                    setNewName(e.target.value)
                  }
                />
              </div>

              <div className="category-form-group">
                <label>
                  Descripción
                </label>

                <textarea
                  placeholder="Describe qué objetos pertenecen a esta categoría..."
                  value={newDescription}
                  onChange={(e) =>
                    setNewDescription(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="category-form-actions">
                <button
                  type="button"
                  className="cancel-category-button"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="save-category-button"
                >
                  <Save size={17} />
                  Guardar categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;