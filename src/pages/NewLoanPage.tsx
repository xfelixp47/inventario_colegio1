import { useState } from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Save,
  Send,
} from "lucide-react";

import { authRepository } from "../repositories/authRepository";

function NewLoanPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const user =
    authRepository.getCurrentUser();

  const isProfesor =
    user?.role === "PROFESOR";

  const selectedObject =
    (
      location.state as
        | {
            object?: string;
          }
        | null
    )?.object ?? "";

  const [student, setStudent] =
    useState(
      isProfesor
        ? user?.name ?? ""
        : ""
    );

  const [course, setCourse] =
    useState(
      isProfesor
        ? "Profesor"
        : ""
    );

  const [object, setObject] =
    useState(selectedObject);

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !student ||
      !course ||
      !object
    ) {
      alert(
        "Completa todos los campos."
      );

      return;
    }

    if (isProfesor) {
      alert(
        "Solicitud de préstamo enviada correctamente."
      );
    } else {
      alert(
        "Préstamo registrado correctamente."
      );
    }

    navigate("/prestamos");
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "auto",
        padding: "40px",
      }}
    >
      <button
        onClick={() =>
          navigate("/")
        }
        style={{
          border: "none",
          background:
            "transparent",
          cursor: "pointer",
          display: "flex",
          gap: "7px",
          marginBottom:
            "25px",
          alignItems:
            "center",
        }}
      >
        <ArrowLeft size={18} />
        Volver al inicio
      </button>

      <div
        style={{
          background: "white",
          padding: "35px",
          borderRadius:
            "20px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1>
          {isProfesor
            ? "Solicitar préstamo"
            : "Nuevo préstamo"}
        </h1>

        <p
          style={{
            color: "#888",
            marginBottom:
              "30px",
          }}
        >
          {isProfesor
            ? "Solicita un objeto del inventario para utilizarlo en tus clases."
            : "Registra un nuevo préstamo de un objeto del colegio."}
        </p>

        <form
          onSubmit={
            handleSubmit
          }
        >
          <label>
            {isProfesor
              ? "Solicitante"
              : "Nombre del solicitante"}
          </label>

          <input
            style={inputStyle}
            value={student}
            readOnly={
              isProfesor
            }
            onChange={(e) =>
              setStudent(
                e.target.value
              )
            }
            placeholder="Nombre completo"
          />

          <label>
            {isProfesor
              ? "Área / curso"
              : "Curso"}
          </label>

          <input
            style={inputStyle}
            value={course}
            onChange={(e) =>
              setCourse(
                e.target.value
              )
            }
            placeholder="Ej: 5° A"
          />

          <label>Objeto</label>

          <select
            style={inputStyle}
            value={object}
            onChange={(e) =>
              setObject(
                e.target.value
              )
            }
          >
            <option value="">
              Seleccionar objeto
            </option>

            <option value="Laptop Lenovo IdeaPad">
              Laptop Lenovo
            </option>

            <option value="Proyector Epson X49">
              Proyector Epson
            </option>

            <option value="Micrófono inalámbrico">
              Micrófono inalámbrico
            </option>

            <option value="Balón de fútbol">
              Balón de fútbol
            </option>

            <option value="Microscopio escolar">
              Microscopio escolar
            </option>
          </select>

          <button
            type="submit"
            style={{
              width: "100%",
              height: "50px",
              border: "none",
              borderRadius:
                "10px",
              color: "white",
              background:
                "#1769df",
              cursor: "pointer",
              fontWeight:
                "bold",
              display: "flex",
              justifyContent:
                "center",
              alignItems:
                "center",
              gap: "8px",
            }}
          >
            {isProfesor ? (
              <Send size={18} />
            ) : (
              <Save size={18} />
            )}

            {isProfesor
              ? "Enviar solicitud"
              : "Registrar préstamo"}
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
  border:
    "1px solid #ddd",
  borderRadius: "10px",
  marginTop: "7px",
  marginBottom: "20px",
  boxSizing:
    "border-box" as const,
};

export default NewLoanPage;