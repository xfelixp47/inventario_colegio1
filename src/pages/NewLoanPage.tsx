
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Send,
  Package,
  CheckCircle2,
  AlertTriangle,
  Minus,
  Plus,
  MapPin,
  Boxes,
  ClipboardList,
} from "lucide-react";

import { authRepository } from "../repositories/authRepository";
import { inventoryStore } from "../services/inventoryStore";

import "./NewLoanPage.css";

function NewLoanPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = authRepository.getCurrentUser();

  const isAdmin = user?.role === "ADMIN";

  const selectedObject =
    (location.state as { object?: string } | null)?.object ?? "";

  const [student, setStudent] = useState(
    isAdmin ? "" : user?.name ?? ""
  );

  const [course, setCourse] = useState(
    user?.role === "PROFESOR" ? "Profesor" : ""
  );

  const [object, setObject] = useState(selectedObject);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const items = inventoryStore.getItems();

  const selectedItem = items.find(
    (item) => item.name === object
  );

  const maxQuantity = selectedItem?.available ?? 0;

  const changeObject = (value: string) => {
    setObject(value);
    setQuantity(1);
  };

  const changeQuantity = (value: number) => {
    if (!Number.isInteger(value)) return;

    setQuantity(
      Math.max(1, Math.min(value, maxQuantity || 1))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Debes iniciar sesión.");
      navigate("/login");
      return;
    }

    if (!student.trim() || !course.trim() || !object) {
      alert("Completa todos los campos.");
      return;
    }

    const currentItem = inventoryStore
      .getItems()
      .find((item) => item.name === object);

    if (!currentItem) {
      alert("Selecciona un objeto válido.");
      return;
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > currentItem.available
    ) {
      alert(
        `Selecciona una cantidad entre 1 y ${currentItem.available}.`
      );
      return;
    }

    setLoading(true);

    const today = new Date();
    const dueDate = new Date(today);

    dueDate.setDate(dueDate.getDate() + 7);

    const loan = {
      id: Date.now(),
      person: student.trim(),
      course: course.trim(),
      item: currentItem.name,
      code: currentItem.code,
      quantity,
      loanDate: today.toLocaleDateString("es-BO"),
      returnDate: dueDate.toLocaleDateString("es-BO"),
      status: "Pendiente" as const,
      initials: student
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase(),
      requesterId: user.id,
    };

    try {
      inventoryStore.requestLoan(loan);

      if (isAdmin) {
        inventoryStore.approveLoan(loan.id);

        alert(
          `Préstamo de ${quantity} unidad(es) registrado correctamente.`
        );
      } else {
        alert(
          `Solicitud de ${quantity} unidad(es) enviada al administrador.`
        );
      }

      navigate("/prestamos");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "No se pudo registrar la solicitud."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-loan-page">
      {/* VOLVER */}

      <button
        className="new-loan-back"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={18} />
        Volver al inicio
      </button>

      {/* ENCABEZADO */}

      <div className="new-loan-heading">
        <div className="new-loan-heading-icon">
          <ClipboardList size={28} />
        </div>

        <div>
          <span className="new-loan-eyebrow">
            COLEGIO DON BOSCO
          </span>

          <h1>
            {isAdmin
              ? "Registrar préstamo"
              : "Solicitar préstamo"}
          </h1>

          <p>
            {isAdmin
              ? "Registra la entrega de materiales del inventario."
              : "Selecciona los materiales y la cantidad que necesitas."}
          </p>
        </div>
      </div>

      <form
        className="new-loan-card"
        onSubmit={handleSubmit}
      >
        {/* DATOS DEL SOLICITANTE */}

        <div className="new-loan-section-title">
          <span>01</span>
          <div>
            <h2>Datos del solicitante</h2>
            <p>Información de quien utilizará el material</p>
          </div>
        </div>

        <div className="new-loan-fields">
          <div className="new-loan-field">
            <label>Nombre completo</label>

            <input
              value={student}
              readOnly={!isAdmin}
              onChange={(e) => setStudent(e.target.value)}
              placeholder="Nombre completo"
              required
            />
          </div>

          <div className="new-loan-field">
            <label>Curso o área</label>

            <input
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="Ejemplo: 5° A"
              required
            />
          </div>
        </div>

        <div className="new-loan-divider"></div>

        {/* SELECCIÓN DE OBJETO */}

        <div className="new-loan-section-title">
          <span>02</span>
          <div>
            <h2>Seleccionar material</h2>
            <p>Consulta la disponibilidad del inventario</p>
          </div>
        </div>

        <div className="new-loan-field">
          <label>Objeto solicitado</label>

          <div className="new-loan-select-wrapper">
            <Package size={19} />

            <select
              value={object}
              onChange={(e) => changeObject(e.target.value)}
              required
            >
              <option value="">
                Selecciona un objeto del inventario
              </option>

              {items.map((item) => (
                <option
                  key={item.id}
                  value={item.name}
                  disabled={item.available === 0}
                >
                  {item.name} — {item.available > 0
                    ? `${item.available} disponibles`
                    : "Sin existencias"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* INFORMACIÓN DEL OBJETO */}

        {selectedItem && (
          <div className="new-loan-object-card">
            <div className="new-loan-object-top">
              <div className="new-loan-object-identity">
                <div className="new-loan-object-emoji">
                  {selectedItem.emoji}
                </div>

                <div>
                  <h3>{selectedItem.name}</h3>
                  <p>
                    {selectedItem.code} · {selectedItem.category}
                  </p>
                </div>
              </div>

              <span
                className={`new-loan-status ${
                  selectedItem.available === 0
                    ? "unavailable"
                    : selectedItem.status === "Stock bajo"
                    ? "low"
                    : "available"
                }`}
              >
                {selectedItem.available === 0 ? (
                  <AlertTriangle size={14} />
                ) : (
                  <CheckCircle2 size={14} />
                )}

                {selectedItem.available === 0
                  ? "No disponible"
                  : selectedItem.status}
              </span>
            </div>

            <div className="new-loan-object-details">
              <div>
                <Boxes size={17} />
                <span>Existencias disponibles</span>
                <strong>{selectedItem.available}</strong>
              </div>

              <div>
                <MapPin size={17} />
                <span>Ubicación</span>
                <strong>{selectedItem.location}</strong>
              </div>
            </div>
          </div>
        )}

        {/* CANTIDAD */}

        {selectedItem && selectedItem.available > 0 && (
          <div className="new-loan-quantity-section">
            <div>
              <h3>Cantidad solicitada</h3>
              <p>
                Puedes solicitar entre 1 y{" "}
                {selectedItem.available} unidades.
              </p>
            </div>

            <div className="new-loan-stepper">
              <button
                type="button"
                onClick={() => changeQuantity(quantity - 1)}
                disabled={quantity <= 1}
                aria-label="Disminuir cantidad"
              >
                <Minus size={18} />
              </button>

              <input
                type="number"
                min={1}
                max={selectedItem.available}
                step={1}
                value={quantity}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (Number.isInteger(value)) {
                    changeQuantity(value);
                  }
                }}
                aria-label="Cantidad solicitada"
              />

              <button
                type="button"
                onClick={() => changeQuantity(quantity + 1)}
                disabled={quantity >= selectedItem.available}
                aria-label="Aumentar cantidad"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        )}

        {/* MENSAJE */}

        {!isAdmin && (
          <div className="new-loan-notice">
            <AlertTriangle size={19} />
            <p>
              Tu solicitud quedará pendiente hasta que el
              administrador la apruebe. Las unidades se
              descontarán del inventario al aprobarla.
            </p>
          </div>
        )}

        {/* BOTÓN GUARDAR */}

        <button
          className="new-loan-submit"
          type="submit"
          disabled={
            loading ||
            !selectedItem ||
            selectedItem.available < 1
          }
        >
          <Send size={19} />

          {loading
            ? "Guardando..."
            : isAdmin
            ? "Registrar préstamo"
            : "Enviar solicitud"}
        </button>
      </form>
    </div>
  );
}

export default NewLoanPage;
