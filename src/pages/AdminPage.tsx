import { useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import "./RolePages.css";

function AdminPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  const logout = () => {
    authRepository.logout();
    navigate("/login");
  };

  return (
    <div className="role-page admin-page">

      <header className="role-header">
        <div>
          <span className="role-badge admin-badge">
            ADMINISTRADOR
          </span>

          <h1>Hola, {user?.name} 👋</h1>

          <p>
            Tienes acceso completo al sistema.
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
          <p>Administrar todos los objetos.</p>
        </div>

        <div
          className="role-card"
          onClick={() => navigate("/prestamos")}
        >
          <span>📋</span>
          <h2>Préstamos</h2>
          <p>Registrar y administrar préstamos.</p>
        </div>

        <div
          className="role-card"
          onClick={() => navigate("/categorias")}
        >
          <span>🏷️</span>
          <h2>Categorías</h2>
          <p>Administrar categorías.</p>
        </div>

        <div
          className="role-card"
          onClick={() => navigate("/usuarios")}
        >
          <span>👥</span>
          <h2>Usuarios</h2>
          <p>Administrar usuarios.</p>
        </div>

        <div
          className="role-card"
          onClick={() => navigate("/reportes")}
        >
          <span>📊</span>
          <h2>Reportes</h2>
          <p>Consultar reportes del sistema.</p>
        </div>

        <div
          className="role-card"
          onClick={() => navigate("/configuracion")}
        >
          <span>⚙️</span>
          <h2>Configuración</h2>
          <p>Configurar el sistema.</p>
        </div>

      </div>
    </div>
  );
}

export default AdminPage;