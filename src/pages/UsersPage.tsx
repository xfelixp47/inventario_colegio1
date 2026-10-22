
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
import { userService } from "../services/userService";
import { authRepository } from "../repositories/authRepository";
import type { UserRole } from "../types/auth";

import "./UsersPage.css";

type UserItem = {
  id: string;
  name: string;
  carnet: string;
  role: UserRole;
};

const originalUsers: UserItem[] = initialUsers.map(
  (user) => ({
    id: String(user.id),
    name: user.name,
    carnet: user.carnet,
    role: user.role as UserRole,
  })
);

function UsersPage() {
  const navigate = useNavigate();

  const currentUser = authRepository.getCurrentUser();
  const isAdmin = currentUser?.role === "ADMIN";

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");

  const [users, setUsers] = useState<UserItem[]>(() => [
    ...originalUsers,
    ...userService.getUsers(),
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newCarnet, setNewCarnet] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] =
    useState<UserRole>("ESTUDIANTE");

  const [saving, setSaving] = useState(false);

  // ACTUALIZAR USUARIOS

  const refreshUsers = () => {
    setUsers([
      ...originalUsers,
      ...userService.getUsers(),
    ]);
  };

  // FILTRAR USUARIOS

  const filteredUsers = useMemo(() => {
    const text = search.toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(text) ||
        user.carnet.toLowerCase().includes(text) ||
        user.role.toLowerCase().includes(text);

      const matchesRole =
        roleFilter === "Todos" ||
        user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // ESTADÍSTICAS

  const adminCount = users.filter(
    (user) => user.role === "ADMIN"
  ).length;

  const teacherCount = users.filter(
    (user) => user.role === "PROFESOR"
  ).length;

  const studentCount = users.filter(
    (user) => user.role === "ESTUDIANTE"
  ).length;

  // LIMPIAR FORMULARIO

  const resetForm = () => {
    setNewName("");
    setNewCarnet("");
    setNewPassword("");
    setNewRole("ESTUDIANTE");
    setEditingId(null);
    setShowModal(false);
  };

  // CREAR USUARIO

  const openCreate = () => {
    if (!isAdmin) return;

    resetForm();
    setShowModal(true);
  };

  // EDITAR USUARIO

  const editUser = (user: UserItem) => {
    if (!isAdmin) return;

    const isCreated = userService
      .getUsers()
      .some((item) => item.id === user.id);

    if (!isCreated) {
      alert(
        "Esta es una cuenta original del sistema. " +
        "Solo puedes editar cuentas creadas desde este panel."
      );
      return;
    }

    setEditingId(user.id);
    setNewName(user.name);
    setNewCarnet(user.carnet);
    setNewPassword("");
    setNewRole(user.role);
    setShowModal(true);
  };

  // GUARDAR USUARIO

  const handleSaveUser = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!isAdmin || saving) return;

    if (!newName.trim() || !newCarnet.trim()) {
      alert("Completa todos los campos.");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        userService.updateUser(editingId, {
          name: newName,
          role: newRole,
        });

        if (newPassword.trim()) {
          await userService.changePassword(
            editingId,
            newPassword
          );
        }

        alert("Usuario actualizado correctamente.");
      } else {
        if (!newPassword.trim()) {
          alert("Introduce una contraseña.");
          return;
        }

        if (
          users.some(
            (user) => user.carnet === newCarnet.trim()
          )
        ) {
          alert("Ya existe un usuario con ese carnet.");
          return;
        }

        await userService.createUser({
          name: newName,
          carnet: newCarnet,
          password: newPassword,
          role: newRole,
        });

        alert(
          "Usuario registrado correctamente. " +
          "Ya puede iniciar sesión."
        );
      }

      refreshUsers();
      resetForm();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el usuario."
      );
    } finally {
      setSaving(false);
    }
  };

  // ELIMINAR USUARIO

  const deleteUser = (user: UserItem) => {
    if (!isAdmin) return;

    const isCreated = userService
      .getUsers()
      .some((item) => item.id === user.id);

    if (!isCreated) {
      alert(
        "No puedes eliminar las cuentas originales del sistema."
      );
      return;
    }

    if (user.id === currentUser?.id) {
      alert("No puedes eliminar tu propia cuenta activa.");
      return;
    }

    if (
      !window.confirm(
        `¿Seguro que quieres eliminar a "${user.name}"?`
      )
    ) {
      return;
    }

    userService.deleteUser(user.id);
    refreshUsers();

    alert("Usuario eliminado correctamente.");
  };

  // INICIALES

  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[1].charAt(0)
    ).toUpperCase();
  };

  // NOMBRE DEL ROL

  const formatRole = (role: UserRole) => {
    if (role === "ADMIN") return "Administrador";
    if (role === "PROFESOR") return "Profesor";
    return "Estudiante";
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

      {/* ENCABEZADO */}

      <header className="users-header">
        <div>
          <span className="users-eyebrow">
            ADMINISTRACIÓN DEL SISTEMA
          </span>

          <h1>Usuarios</h1>

          <p>
            Gestiona administradores, profesores y estudiantes
            que pueden acceder al sistema de inventario.
          </p>
        </div>

        <button
          className="new-user-button"
          onClick={openCreate}
          disabled={!isAdmin}
        >
          <UserPlus size={19} />
          Nuevo usuario
        </button>
      </header>

      {/* ESTADÍSTICAS */}

      <section className="users-stats">
        <div className="user-stat-card">
          <div className="user-stat-icon gold">
            <ShieldCheck size={24} />
          </div>

          <div>
            <span>Administradores</span>
            <strong>{adminCount}</strong>
            <small>Acceso completo</small>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon blue">
            <UserRound size={24} />
          </div>

          <div>
            <span>Profesores</span>
            <strong>{teacherCount}</strong>
            <small>Consulta y solicitudes</small>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon green">
            <Users size={24} />
          </div>

          <div>
            <span>Estudiantes</span>
            <strong>{studentCount}</strong>
            <small>Acceso limitado</small>
          </div>
        </div>
      </section>

      {/* PANEL DE USUARIOS */}

      <section className="users-panel">
        <div className="users-panel-header">
          <div>
            <h2>Usuarios registrados</h2>

            <p>
              {filteredUsers.length} usuarios encontrados
            </p>
          </div>
        </div>

        {/* BÚSQUEDA */}

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

          {/* FILTRO */}

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

              <option value="ADMIN">
                Administradores
              </option>

              <option value="PROFESOR">
                Profesores
              </option>

              <option value="ESTUDIANTE">
                Estudiantes
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
                  {/* NOMBRE */}

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
                        <strong>{user.name}</strong>

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
                      <span>{user.carnet}</span>
                    </div>
                  </td>

                  {/* ROL */}

                  <td>
                    <span
                      className={`user-role ${
                        user.role === "ADMIN"
                          ? "administrator"
                          : "normal"
                      }`}
                    >
                      {user.role === "ADMIN" && (
                        <ShieldCheck size={13} />
                      )}

                      {formatRole(user.role)}
                    </span>
                  </td>

                  {/* ESTADO */}

                  <td>
                    <span className="user-status">
                      <span></span>
                      Activo
                    </span>
                  </td>

                  {/* BOTONES */}

                  <td>
                    <div className="user-actions">
                      <button
                        className="user-edit-button"
                        onClick={() => editUser(user)}
                        title="Editar usuario"
                        disabled={!isAdmin}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="user-delete-button"
                        onClick={() => deleteUser(user)}
                        title="Eliminar usuario"
                        disabled={!isAdmin}
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

        {/* PIE DE TABLA */}

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

      {/* VENTANA DE REGISTRO Y EDICIÓN */}

      {showModal && (
        <div
          className="user-modal-overlay"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              resetForm();
            }
          }}
        >
          <div className="user-modal">
            <div className="user-modal-header">
              <div>
                <span>
                  {editingId
                    ? "EDITAR USUARIO"
                    : "NUEVO USUARIO"}
                </span>

                <h2>
                  {editingId
                    ? "Modificar usuario"
                    : "Registrar usuario"}
                </h2>

                <p>
                  {editingId
                    ? "Actualiza los datos de esta cuenta."
                    : "Crea una nueva cuenta para acceder al sistema."}
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
              >
                <X size={19} />
              </button>
            </div>

            {/* FORMULARIO */}

            <form
              className="new-user-form"
              onSubmit={handleSaveUser}
            >
              {/* NOMBRE */}

              <div className="new-user-form-group">
                <label>Nombre completo</label>

                <div className="new-user-input">
                  <UserRound size={18} />

                  <input
                    type="text"
                    placeholder="Ej: Juan Pérez"
                    value={newName}
                    onChange={(e) =>
                      setNewName(e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* CARNET */}

              <div className="new-user-form-group">
                <label>Carnet de identidad</label>

                <div className="new-user-input">
                  <IdCard size={18} />

                  <input
                    type="text"
                    placeholder="Ej: 12345678"
                    value={newCarnet}
                    onChange={(e) =>
                      setNewCarnet(e.target.value)
                    }
                    readOnly={Boolean(editingId)}
                    required
                  />
                </div>
              </div>

              {/* CONTRASEÑA */}

              <div className="new-user-form-group">
                <label>
                  {editingId
                    ? "Nueva contraseña (opcional)"
                    : "Contraseña"}
                </label>

                <div className="new-user-input">
                  <KeyRound size={18} />

                  <input
                    type="password"
                    placeholder={
                      editingId
                        ? "Dejar vacío para conservar contraseña"
                        : "Mínimo 8 caracteres"
                    }
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value)
                    }
                    required={!editingId}
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* ROL */}

              <div className="new-user-form-group">
                <label>Rol</label>

                <select
                  className="new-user-role-select"
                  value={newRole}
                  onChange={(e) =>
                    setNewRole(e.target.value as UserRole)
                  }
                >
                  <option value="ESTUDIANTE">
                    Estudiante
                  </option>

                  <option value="PROFESOR">
                    Profesor
                  </option>

                  <option value="ADMIN">
                    Administrador
                  </option>
                </select>
              </div>

              {/* PERMISOS */}

              <div className="role-information">
                <ShieldCheck size={18} />

                <div>
                  <strong>Permisos</strong>

                  <p>
                    {newRole === "ADMIN"
                      ? "Acceso completo al sistema."
                      : newRole === "PROFESOR"
                      ? "Puede consultar objetos y solicitar préstamos."
                      : "Puede consultar el inventario y solicitar objetos."}
                  </p>
                </div>
              </div>

              {/* ACCIONES */}

              <div className="new-user-form-actions">
                <button
                  type="button"
                  className="cancel-user-button"
                  onClick={resetForm}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="save-user-button"
                  disabled={saving}
                >
                  <Save size={17} />

                  {saving
                    ? "Guardando..."
                    : editingId
                    ? "Guardar cambios"
                    : "Guardar usuario"}
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
