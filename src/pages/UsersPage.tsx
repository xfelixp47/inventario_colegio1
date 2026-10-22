
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
  KeyRound,
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

const originalUsers: UserItem[] = initialUsers.map((user) => ({
  id: String(user.id),
  name: user.name,
  carnet: user.carnet,
  role: user.role as UserRole,
}));

function UsersPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserItem[]>(() => [
    ...originalUsers,
    ...userService.getUsers(),
  ]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newCarnet, setNewCarnet] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [newRole, setNewRole] = useState<UserRole>("ESTUDIANTE");

  const [saving, setSaving] = useState(false);

  const isAdmin =
    authRepository.getCurrentUser()?.role === "ADMIN";

  const refreshUsers = () => {
    setUsers([
      ...originalUsers,
      ...userService.getUsers(),
    ]);
  };

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

  const adminCount = users.filter(
    (user) => user.role === "ADMIN"
  ).length;

  const teacherCount = users.filter(
    (user) => user.role === "PROFESOR"
  ).length;

  const studentCount = users.filter(
    (user) => user.role === "ESTUDIANTE"
  ).length;

  const resetForm = () => {
    setNewName("");
    setNewCarnet("");
    setNewPassword("");
    setNewRole("ESTUDIANTE");
    setEditingId(null);
    setShowModal(false);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (user: UserItem) => {
    const isCreated = userService
      .getUsers()
      .some((item) => item.id === user.id);

    if (!isCreated) {
      alert(
        "Esta es una cuenta original del proyecto. " +
        "Puedes modificar las cuentas creadas desde este panel."
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

  const handleSubmit = async (
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
          alert("Debes introducir una contraseña.");
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
          "Usuario registrado correctamente. Ya puede iniciar sesión."
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

  const deleteUser = (user: UserItem) => {
    if (!isAdmin) return;

    const isCreated = userService
      .getUsers()
      .some((item) => item.id === user.id);

    if (!isCreated) {
      alert(
        "No puedes eliminar las cuentas originales desde este panel."
      );
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

  const getInitials = (name: string) => {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const formatRole = (role: UserRole) => {
    if (role === "ADMIN") return "Administrador";
    if (role === "PROFESOR") return "Profesor";
    return "Estudiante";
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    border: "1px solid #dbe2ea",
    borderRadius: "10px",
    boxSizing: "border-box",
    marginTop: "7px",
    marginBottom: "17px",
  };

  return (
    <div className="users-page">
      <button
        className="users-back-button"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={18} />
        Volver al inicio
      </button>

      <header className="users-header">
        <div>
          <span className="users-eyebrow">
            ADMINISTRACIÓN DEL SISTEMA
          </span>

          <h1>Usuarios</h1>

          <p>
            Administra las cuentas de administradores,
            profesores y estudiantes del Colegio Don Bosco.
          </p>
        </div>

        <button
          onClick={openCreate}
          disabled={!isAdmin}
          style={buttonStyle("#1769df")}
        >
          <UserPlus size={18} />
          Agregar usuario
        </button>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 15,
          margin: "25px 0",
        }}
      >
        <StatCard
          title="Total usuarios"
          value={users.length}
          icon={<Users size={24} color="#1769df" />}
        />

        <StatCard
          title="Administradores"
          value={adminCount}
          icon={<ShieldCheck size={24} color="#7c3aed" />}
        />

        <StatCard
          title="Profesores"
          value={teacherCount}
          icon={<UserRound size={24} color="#16a34a" />}
        />

        <StatCard
          title="Estudiantes"
          value={studentCount}
          icon={<Users size={24} color="#f59e0b" />}
        />
      </section>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          margin: "25px 0",
        }}
      >
        <div style={{ flex: 1, position: "relative" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              top: 13,
              left: 12,
              color: "#64748b",
            }}
          />

          <input
            placeholder="Buscar usuarios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              ...inputStyle,
              paddingLeft: 40,
              margin: 0,
            }}
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            padding: 12,
            border: "1px solid #dbe2ea",
            borderRadius: 10,
          }}
        >
          <option value="Todos">Todos los roles</option>
          <option value="ADMIN">Administradores</option>
          <option value="PROFESOR">Profesores</option>
          <option value="ESTUDIANTE">Estudiantes</option>
        </select>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 18,
          padding: 20,
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr>
              {[
                "Usuario",
                "Carnet",
                "Rol",
                "Acciones",
              ].map((title) => (
                <th
                  key={title}
                  style={{
                    padding: 15,
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td
                  style={{
                    padding: 15,
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: "#dbeafe",
                        color: "#1d4ed8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                      }}
                    >
                      {getInitials(user.name)}
                    </div>

                    <strong>{user.name}</strong>
                  </div>
                </td>

                <td style={{ padding: 15 }}>
                  {user.carnet}
                </td>

                <td style={{ padding: 15 }}>
                  <span
                    style={{
                      padding: "7px 12px",
                      borderRadius: 20,
                      fontWeight: 600,
                      background:
                        user.role === "ADMIN"
                          ? "#ede9fe"
                          : user.role === "PROFESOR"
                          ? "#dcfce7"
                          : "#dbeafe",
                    }}
                  >
                    {formatRole(user.role)}
                  </span>
                </td>

                <td style={{ padding: 15 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      title="Editar usuario"
                      onClick={() => openEdit(user)}
                      style={buttonStyle("#2563eb")}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      title="Eliminar usuario"
                      onClick={() => deleteUser(user)}
                      style={buttonStyle("#dc2626")}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 45,
              color: "#64748b",
            }}
          >
            <Users size={40} style={{ margin: "auto" }} />
            <h3>No se encontraron usuarios</h3>
          </div>
        )}
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 480,
              background: "white",
              padding: 30,
              borderRadius: 20,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h2>
                {editingId
                  ? "Editar usuario"
                  : "Agregar usuario"}
              </h2>

              <button
                onClick={resetForm}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <X size={23} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Nombre completo</label>

              <input
                style={inputStyle}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nombre y apellido"
                required
              />

              <label>Carnet de identidad</label>

              <input
                style={inputStyle}
                value={newCarnet}
                readOnly={Boolean(editingId)}
                onChange={(e) => setNewCarnet(e.target.value)}
                placeholder="Ejemplo: 12345678"
                required
              />

              <label>
                <KeyRound size={15} style={{ display: "inline" }} />{" "}
                {editingId
                  ? "Nueva contraseña (opcional)"
                  : "Contraseña"}
              </label>

              <input
                type="password"
                style={inputStyle}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required={!editingId}
                minLength={8}
                autoComplete="new-password"
              />

              <label>Rol del usuario</label>

              <select
                style={inputStyle}
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

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 15,
                }}
              >
                <button
                  type="button"
                  onClick={resetForm}
                  style={buttonStyle("#64748b")}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    ...buttonStyle("#1769df"),
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <Save size={17} />
                  {saving
                    ? "Guardando..."
                    : editingId
                    ? "Guardar cambios"
                    : "Crear usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 15,
        padding: 22,
        display: "flex",
        alignItems: "center",
        gap: 15,
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
      }}
    >
      {icon}

      <div>
        <div style={{ color: "#64748b", fontSize: 14 }}>
          {title}
        </div>

        <strong style={{ fontSize: 27 }}>
          {value}
        </strong>
      </div>
    </div>
  );
}

function buttonStyle(
  color: string
): React.CSSProperties {
  return {
    background: color,
    color: "white",
    padding: "10px 14px",
    border: "none",
    borderRadius: 9,
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    fontWeight: 600,
    cursor: "pointer",
  };
}

export default UsersPage;
