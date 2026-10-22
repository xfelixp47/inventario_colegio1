
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";

import { authRepository } from "../repositories/authRepository";
import { inventoryStore } from "../services/inventoryStore";

function NewLoanPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = authRepository.getCurrentUser();

  const isAdmin = user?.role === "ADMIN";
  const isProfesor = user?.role === "PROFESOR";
  const isEstudiante = user?.role === "ESTUDIANTE";

  const selectedObject =
    (location.state as { object?: string } | null)?.object ?? "";

  const [student, setStudent] = useState(
    isAdmin ? "" : user?.name ?? ""
  );

  const [course, setCourse] = useState(
    isProfesor ? "Profesor" : ""
  );

  const [object, setObject] = useState(selectedObject);
  const [loading, setLoading] = useState(false);

  const availableItems = inventoryStore
    .getItems()
    .filter((item) => item.available > 0);

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

    const item = inventoryStore
      .getItems()
      .find((i) => i.name === object);

    if (!item || item.available < 1) {
      alert("Este objeto no está disponible.");
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
      item: item.name,
      code: item.code,
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
        alert("Préstamo registrado correctamente.");
      } else {
        alert(
          "Solicitud enviada correctamente. El administrador podrá revisarla."
        );
      }

      navigate("/prestamos");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "No se pudo guardar la solicitud."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    borderRadius: "10px",
    border: "1px solid #dce3ee",
    marginTop: "8px",
    marginBottom: "20px",
    fontSize: "15px",
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "auto",
        padding: "40px 20px",
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 25,
        }}
      >
        <ArrowLeft size={18} />
        Volver al inicio
      </button>

      <div
        style={{
          background: "white",
          padding: 35,
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1>
          {isAdmin ? "Registrar préstamo" : "Solicitar préstamo"}
        </h1>

        <p style={{ color: "#64748b", marginBottom: 30 }}>
          {isAdmin
            ? "Registra un préstamo para el colegio."
            : "Solicita un objeto del inventario. El administrador revisará tu solicitud."}
        </p>

        <form onSubmit={handleSubmit}>
          <label>Nombre del solicitante</label>

          <input
            style={inputStyle}
            value={student}
            readOnly={!isAdmin}
            onChange={(e) => setStudent(e.target.value)}
            required
          />

          <label>
            {isProfesor
              ? "Área"
              : isEstudiante
              ? "Curso"
              : "Curso o área"}
          </label>

          <input
            style={inputStyle}
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Ejemplo: 5° A"
            required
          />

          <label>Objeto solicitado</label>

          <select
            style={inputStyle}
            value={object}
            onChange={(e) => setObject(e.target.value)}
            required
          >
            <option value="">Seleccionar objeto</option>

            {availableItems.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name} — {item.available} disponibles
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "10px",
              background: "#1769df",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Send size={18} />
            {loading
              ? "Guardando..."
              : isAdmin
              ? "Registrar préstamo"
              : "Enviar solicitud"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewLoanPage;
