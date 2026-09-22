import { useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import "./RolePages.css";

function StudentPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  const logout = () => {
    authRepository.logout();
    navigate("/login");
  };

  return (
    <div className="role-page student-page">

      <header className="role-header">

        <div>
          <span className="role-badge student-badge">
            ESTUDIANTE
          </span>

          <h1>Hola, {user?.name} 🎓</h1>

          <p>
            Consulta los objetos disponibles del colegio.
          </p>
        </div>

        <button onClick={logout}>
          Cerrar sesión
        </button>

      </header>

      <div className="role-grid">

        <div
          className="role-card"
          onClick={() => navigate("/inventario")}
        >
          <span>🔍</span>

          <h2>Ver inventario</h2>

          <p>
            Consulta los objetos disponibles.
          </p>
        </div>

        <div
          className="role-card"
          onClick={() => navigate("/prestamos")}
        >
          <span>📖</span>

          <h2>Mis préstamos</h2>

          <p>
            Consulta tus préstamos actuales.
          </p>
        </div>

      </div>
    </div>
  );
}

export default StudentPage;