import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

function NewLoanPage() {
  const navigate = useNavigate();

  const [student, setStudent] = useState("");
  const [course, setCourse] = useState("");
  const [object, setObject] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!student || !course || !object) {
      alert("Completa todos los campos.");
      return;
    }

    alert("Préstamo registrado correctamente.");

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
        onClick={() => navigate("/prestamos")}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          gap: "7px",
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
        }}
      >
        <h1>Nuevo préstamo</h1>

        <form onSubmit={handleSubmit}>
          <label>Nombre del estudiante</label>

          <input
            style={inputStyle}
            value={student}
            onChange={(e) => setStudent(e.target.value)}
          />

          <label>Curso</label>

          <input
            style={inputStyle}
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Ej: 5° A"
          />

          <label>Objeto</label>

          <select
            style={inputStyle}
            value={object}
            onChange={(e) => setObject(e.target.value)}
          >
            <option value="">Seleccionar objeto</option>
            <option>Laptop Lenovo</option>
            <option>Proyector Epson</option>
            <option>Micrófono inalámbrico</option>
            <option>Balón de fútbol</option>
          </select>

          <button
            style={{
              width: "100%",
              height: "50px",
              border: "none",
              borderRadius: "10px",
              color: "white",
              background: "#1769df",
              cursor: "pointer",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Save size={18} />
            Registrar préstamo
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
  border: "1px solid #ddd",
  borderRadius: "10px",
  marginTop: "7px",
  marginBottom: "20px",
};

export default NewLoanPage;