import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  UserRound,
  Pencil,
  Trash2,
  X,
  Save,
  Filter,
  ChevronDown,
  KeyRound,
  IdCard,
} from "lucide-react";

import initialUsers from "../data/users.json";
import "./UsersPage.css";

type UserItem = {
  id: number | string;
  name: string;
  carnet: string;
  role: string;
  password?: string;
};

function UsersPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");

  const [users, setUsers] = useState<UserItem[]>(
    initialUsers as UserItem[]
  );

  const [showModal, setShowModal] = useState(false);

  const [newName, setNewName] = useState("");
  const [newCarnet, setNewCarnet] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("usuario");

  /* =========================
     FILTROS
  ========================= */

  const filteredUsers = useMemo(() => {
    const text = search.toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(text) ||
        user.carnet.toLowerCase().includes(text) ||
        user.role.toLowerCase().includes(text);

      const matchesRole =
        roleFilter === "Todos" ||
        user.role.toLowerCase() === roleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  /* =========================
     ESTADÍSTICAS
  ========================= */

  const adminCount = users.filter(
    (user) => user.role.toLowerCase() === "admin"
  ).length;

  const normalUsersCount = users.filter(
    (user) => user.role.toLowerCase() !== "admin"
  ).length;

  /* =========================
     CREAR USUARIO
  ========================= */

  const handleCreateUser = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !newName.trim() ||
      !newCarnet.trim() ||
      !newPassword.trim()
    ) {
      alert("Completa todos los campos.");
      return;
    }

    const carnetExists = users.some(
      (user) => user.carnet === newCarnet.trim()
    );

    if (carnetExists) {
      alert("Ya existe un usuario con ese carnet.");
      return;
    }

    const newUser: UserItem = {
      id: Date.now(),
      name: newName.trim(),
      carnet: newCarnet.trim(),
      password: newPassword,
      role: newRole,
    };

    setUsers((currentUsers) => [
      ...currentUsers,
      newUser,
    ]);

    setNewName("");
    setNewCarnet("");
    setNewPassword("");
    setNewRole("usuario");

    setShowModal(false);
  };

  /* =========================
     EDITAR
  ========================= */

  const editUser = (user: UserItem) => {
    const newUserName = window.prompt(
      "Nuevo nombre del usuario:",
      user.name
    );

    if (!newUserName?.trim()) return;

    setUsers((currentUsers) =>
      currentUsers.map((currentUser) =>
        currentUser.id === user.id
          ? {
              ...currentUser,
              name: newUserName.trim(),
            }
          : currentUser
      )
    );
  };

  /* =========================
     ELIMINAR
  ========================= */

  const deleteUser = (user: UserItem) => {
    const confirmDelete = window.confirm(
      `¿Seguro que quieres eliminar al usuario "${user.name}"?`
    );

    if (!confirmDelete) return;

    setUsers((currentUsers) =>
      currentUsers.filter(
        (currentUser) => currentUser.id !== user.id
      )
    );
  };

  /* =========================
     INICIALES
  ========================= */

  const getInitials = (name: string) => {
    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[1].charAt(0)
    ).toUpperCase();
  };

  return (
    <div className="users-page">
      {/* VOLVER */}

      <button
        className="users-back-button"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={18} />
        Volver al inicio
      </button>

      {/* HEADER */}

      <header className="users-header">
        <div>
          <span className="users-eyebrow">
            ADMINISTRACIÓN DEL SISTEMA
          </span>

          <h1>Usuarios</h1>

          <p>
            Gestiona las personas que pueden acceder al sistema
            de inventario del Colegio Don Bosco y controla sus
            permisos.
          </p>
        </div>

        <button
          className="new-user-button"
          onClick={() => setShowModal(true)}
        >
          <UserPlus size={19} />
          Nuevo usuario
        </button>
      </header>

      {/* ESTADÍSTICAS */}

      <section className="users-stats">
        <div className="user-stat-card">
          <div className="user-stat-icon blue">
            <Users size={24} />
          </div>

          <div>
            <span>Total usuarios</span>
            <strong>{users.length}</strong>
            <small>Registrados en el sistema</small>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon gold">
            <ShieldCheck size={24} />
          </div>

          <div>
            <span>Administradores</span>
            <strong>{adminCount}</strong>
            <small>Con acceso completo</small>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon green">
            <UserRound size={24} />
          </div>

          <div>
            <span>Usuarios</span>
            <strong>{normalUsersCount}</strong>
            <small>Acceso estándar</small>
          </div>
        </div>
      </section>

      {/* PANEL PRINCIPAL */}

      <section className="users-panel">
        <div className="users-panel-header">
          <div>
            <h2>Usuarios registrados</h2>

            <p>
              {filteredUsers.length} usuarios encontrados
            </p>
          </div>
        </div>

        {/* BUSCADOR Y FILTRO */}

        <div className="users-toolbar">
          <div className="users-search">
            <Search size={19} />

            <input
              type="text"
              placeholder="Buscar por nombre, carnet o rol..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="users-filter">
            <Filter size={17} />

            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value)
              }
            >
              <option value="Todos">
                Todos los roles
              </option>

              <option value="admin">
                Administradores
              </option>

              <option value="usuario">
                Usuarios
              </option>
            </select>

            <ChevronDown size={16} />
          </div>
        </div>

        {/* TABLA */}

        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>USUARIO</th>
                <th>CARNET</th>
                <th>ROL</th>
                <th>ESTADO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  {/* USUARIO */}

                  <td>
                    <div className="registered-user">
                      <div
                        className={`registered-user-avatar user-avatar-${
                          (index % 4) + 1
                        }`}
                      >
                        {getInitials(user.name)}
                      </div>

                      <div>
                        <strong>
                          {user.name}
                        </strong>

                        <span>
                          Usuario #{String(user.id).slice(-4)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* CARNET */}

                  <td>
                    <div className="user-carnet">
                      <IdCard size={15} />

                      <span>
                        {user.carnet}
                      </span>
                    </div>
                  </td>

                  {/* ROL */}

                  <td>
                    <span
                      className={`user-role ${
                        user.role.toLowerCase() === "admin"
                          ? "administrator"
                          : "normal"
                      }`}
                    >
                      {user.role.toLowerCase() === "admin" && (
                        <ShieldCheck size={13} />
                      )}

                      {user.role}
                    </span>
                  </td>

                  {/* ESTADO */}

                  <td>
                    <span className="user-status">
                      <span></span>
                      Activo
                    </span>
                  </td>

                  {/* ACCIONES */}

                  <td>
                    <div className="user-actions">
                      <button
                        className="user-edit-button"
                        onClick={() =>
                          editUser(user)
                        }
                        title="Editar usuario"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="user-delete-button"
                        onClick={() =>
                          deleteUser(user)
                        }
                        title="Eliminar usuario"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* SIN RESULTADOS */}

          {filteredUsers.length === 0 && (
            <div className="empty-users">
              <div className="empty-users-icon">
                <Users size={35} />
              </div>

              <h3>No encontramos usuarios</h3>

              <p>
                Prueba cambiando el nombre o el filtro.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setRoleFilter("Todos");
                }}
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* FOOTER */}

        {filteredUsers.length > 0 && (
          <div className="users-panel-footer">
            <span>
              Mostrando {filteredUsers.length} de{" "}
              {users.length} usuarios
            </span>

            <div className="users-footer-info">
              <span>
                <i className="users-green-dot"></i>
                {users.length} activos
              </span>

              <span>
                <ShieldCheck size={13} />
                {adminCount} administradores
              </span>
            </div>
          </div>
        )}
      </section>

      {/* MODAL NUEVO USUARIO */}

      {showModal && (
        <div
          className="user-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.currentTarget === event.target
            ) {
              setShowModal(false);
            }
          }}
        >
          <div className="user-modal">
            {/* HEADER MODAL */}

            <div className="user-modal-header">
              <div>
                <span>NUEVO USUARIO</span>
                <h2>Registrar usuario</h2>

                <p>
                  Crea una nueva cuenta para acceder al sistema.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
              >
                <X size={19} />
              </button>
            </div>

            {/* FORM */}

            <form
              className="new-user-form"
              onSubmit={handleCreateUser}
            >
              {/* NOMBRE */}

              <div className="new-user-form-group">
                <label>
                  Nombre completo
                </label>

                <div className="new-user-input">
                  <UserRound size={18} />

                  <input
                    type="text"
                    placeholder="Ej: Juan Pérez"
                    value={newName}
                    onChange={(e) =>
                      setNewName(e.target.value)
                    }
                  />
                </div>
              </div>

              {/* CARNET */}

              <div className="new-user-form-group">
                <label>
                  Carnet de identidad
                </label>

                <div className="new-user-input">
                  <IdCard size={18} />

                  <input
                    type="text"
                    placeholder="Ej: 12345678"
                    value={newCarnet}
                    onChange={(e) =>
                      setNewCarnet(e.target.value)
                    }
                  />
                </div>
              </div>

              {/* CONTRASEÑA */}

              <div className="new-user-form-group">
                <label>
                  Contraseña
                </label>

                <div className="new-user-input">
                  <KeyRound size={18} />

                  <input
                    type="password"
                    placeholder="Crear contraseña"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value)
                    }
                  />
                </div>
              </div>

              {/* ROL */}

              <div className="new-user-form-group">
                <label>
                  Rol
                </label>

                <select
                  className="new-user-role-select"
                  value={newRole}
                  onChange={(e) =>
                    setNewRole(e.target.value)
                  }
                >
                  <option value="usuario">
                    Usuario
                  </option>

                  <option value="admin">
                    Administrador
                  </option>
                </select>
              </div>

              {/* INFORMACIÓN */}

              <div className="role-information">
                <ShieldCheck size={18} />

                <div>
                  <strong>
                    Permisos de usuario
                  </strong>

                  <p>
                    Los administradores tienen acceso a todas
                    las secciones del sistema.
                  </p>
                </div>
              </div>

              {/* BOTONES */}

              <div className="new-user-form-actions">
                <button
                  type="button"
                  className="cancel-user-button"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="save-user-button"
                >
                  <Save size={17} />
                  Guardar usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersPage;