
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Package,
  ClipboardList,
  Hash,
} from "lucide-react";

import { authRepository } from "../repositories/authRepository";
import { inventoryStore } from "../services/inventoryStore";

export default function NewLoanPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = authRepository.getCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  const selectedObject =
    (
      location.state as { object?: string } | null
    )?.object ?? "";

  const [student, setStudent] = useState(user?.name ?? "");
  const [course, setCourse] = useState(
    user?.role === "PROFESOR"
      ? "Profesor"
      : ""
  );
  const [object, setObject] = useState(selectedObject);
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");

  const items = inventoryStore.getItems();

  const selectedItem = items.find(
    (item) => item.name === object
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!student.trim() || !course.trim() || !object) {
      alert("Completa todos los campos.");
      return;
    }

    if (reason.trim().length < 10) {
      alert(
        "Escribe un motivo de al menos 10 caracteres."
      );
      return;
    }

    if (
      !selectedItem ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > selectedItem.available
    ) {
      alert("La cantidad solicitada no está disponible.");
      return;
    }

    const now = new Date();
    const due = new Date(now);
    due.setDate(due.getDate() + 7);

    const newLoan = {
      id: Date.now(),
      person: student.trim(),
      course: course.trim(),
      item: selectedItem.name,
      code: selectedItem.code,
      quantity,
      reason: reason.trim(),
      loanDate: now.toLocaleDateString("es-BO"),
      returnDate: due.toLocaleDateString("es-BO"),
      status: "Pendiente" as const,
      initials: student
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase(),
      requesterId: user?.id,
    };

    try {
      inventoryStore.requestLoan(newLoan);

      if (isAdmin) {
        inventoryStore.approveLoan(newLoan.id);
      }

      alert(
        isAdmin
          ? "Préstamo registrado correctamente."
          : "Solicitud enviada correctamente al administrador."
      );

      navigate("/prestamos");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "No se pudo registrar la solicitud."
      );
    }
  };

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 15px",
    border: "1px solid #dbe2ea",
    borderRadius: "11px",
    background: "#f8fafc",
    color: "#1e293b",
    fontSize: "15px",
    boxSizing: "border-box",
    marginTop: "7px",
    marginBottom: "19px",
    fontFamily: "inherit",
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 600,
    fontSize: "14px",
    color: "#334155",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fc",
        padding: "35px 20px",
      }}
    >
      <div style={{ maxWidth: "760px", margin: "auto" }}>
        <button
          onClick={() => navigate("/prestamos")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#334155",
            marginBottom: "25px",
          }}
        >
          <ArrowLeft size={19} />
          Volver a préstamos
        </button>

        <div
          style={{
            background: "white",
            padding: "35px",
            borderRadius: "20px",
            boxShadow: "0 12px 35px rgba(15,23,42,.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                width: "55px",
                height: "55px",
                background: "#e8f0ff",
                color: "#1769df",
                borderRadius: "14px",
                display: "grid",
                placeItems: "center",
              }}
            >
              <ClipboardList size={27} />
            </div>

            <div>
              <h1 style={{ margin: 0, color: "#172554" }}>
                {isAdmin
                  ? "Registrar préstamo"
                  : "Solicitar préstamo"}
              </h1>
              <p style={{ color: "#64748b", margin: "6px 0" }}>
                Inventario del Colegio Don Bosco
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>Nombre del solicitante</label>
            <input
              style={fieldStyle}
              value={student}
              readOnly={!isAdmin}
              required
              onChange={(e) => setStudent(e.target.value)}
              placeholder="Nombre completo"
            />

            <label style={labelStyle}>Curso o área</label>
            <input
              style={fieldStyle}
              value={course}
              required
              onChange={(e) => setCourse(e.target.value)}
              placeholder="Ej: 5° A"
            />

            <label style={labelStyle}>Objeto solicitado</label>
            <select
              style={fieldStyle}
              value={object}
              required
              onChange={(e) => {
                setObject(e.target.value);
                setQuantity(1);
              }}
            >
              <option value="">Seleccionar un objeto</option>

              {items
                .filter((item) => item.available > 0)
                .map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name} — {item.available} disponibles
                  </option>
                ))}
            </select>

            {selectedItem && (
              <div
                style={{
                  background: "#eff6ff",
                  padding: "17px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  display: "flex",
                  gap: "15px",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "35px" }}>
                  {selectedItem.emoji}
                </span>

                <div>
                  <strong>{selectedItem.name}</strong>

                  <p style={{ margin: "5px 0", color: "#475569" }}>
                    Estado: {selectedItem.status}
                  </p>

                  <p style={{ margin: 0, color: "#475569" }}>
                    Disponibles: {selectedItem.available}
                  </p>
                </div>
              </div>
            )}

            <label style={labelStyle}>
              <Hash size={15} style={{ verticalAlign: "middle" }} />{" "}
              Cantidad solicitada
            </label>

            <input
              type="number"
              min={1}
              max={selectedItem?.available ?? 1}
              step={1}
              style={fieldStyle}
              value={quantity}
              required
              onChange={(e) => setQuantity(Number(e.target.value))}
            />

            <label style={labelStyle}>
              ¿Por qué necesitas este objeto?
              <span style={{ color: "#dc2626" }}> *</span>
            </label>

            <textarea
              value={reason}
              required
              minLength={10}
              maxLength={500}
              rows={5}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ejemplo: Necesito el proyector para realizar una exposición de Ciencias Naturales con mi curso."
              style={{
                ...fieldStyle,
                height: "auto",
                resize: "vertical",
                lineHeight: 1.6,
                marginBottom: "8px",
              }}
            />

            <p
              style={{
                color: "#64748b",
                fontSize: "12px",
                margin: "0 0 24px",
              }}
            >
              Este motivo será visible para el administrador
              cuando revise tu solicitud. ({reason.length}/500)
            </p>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "16px",
                border: "none",
                borderRadius: "12px",
                background: "#1769df",
                color: "white",
                fontWeight: 700,
                fontSize: "15px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {isAdmin ? <Package size={19} /> : <Send size={19} />}
              {isAdmin
                ? "Registrar préstamo"
                : "Enviar solicitud al administrador"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
