import { useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import "./RolePages.css";

function TeacherPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  const logout = () => {
    authRepository.logout();
    navigate("/login");
  };

  return (
    <div className="role-page teacher-page">

      <header className="role-header">
        <div>
          <span className="role-badge teacher-badge">
            PROFESOR
          </span>

          <h1>Hola, {user?.name} 👨‍🏫</h1>

          <p>
            Puedes consultar objetos y gestionar préstamos.
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
          <span>📦</span>

          <h2>Inventario</h2>

          <p>
            Consulta los objetos disponibles.
          </p>
        </div>

        <div
          className="role-card"
          onClick={() => navigate("/prestamos")}
        >
          <span>📚</span>

          <h2>Préstamos</h2>

          <p>
            Consulta y registra préstamos.
          </p>
        </div>

        <div
          className="role-card"
          onClick={() => navigate("/nuevo-prestamo")}
        >
          <span>➕</span>

          <h2>Nuevo préstamo</h2>

          <p>
            Solicita o registra un nuevo préstamo.
          </p>
        </div>

      </div>
    </div>
  );
}

export default TeacherPage;