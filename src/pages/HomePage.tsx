import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  Handshake,
  FolderOpen,
  BarChart3,
  Users,
  LogOut,
  Bell,
  Plus,
  UserPlus,
  CheckCircle2,
  Clock3,
  ChevronRight,
  Settings,
  School,
  Menu,
  X,
  Search,
} from "lucide-react";

import { authRepository } from "../repositories/authRepository";

import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  const user = authRepository.getCurrentUser();

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const handleLogout = () => {
    authRepository.logout();

    navigate("/login", {
      replace: true,
    });
  };

  const recentObjects = [
    {
      id: 1,
      name: "Proyector Epson X49",
      category: "Audiovisuales",
      status: "Disponible",
      date: "24/08/2026",
      icon: "📽️",
    },
    {
      id: 2,
      name: "Micrófono inalámbrico",
      category: "Audio",
      status: "Disponible",
      date: "24/08/2026",
      icon: "🎙️",
    },
    {
      id: 3,
      name: "Laptop Lenovo",
      category: "Computación",
      status: "Prestado",
      date: "23/08/2026",
      icon: "💻",
    },
    {
      id: 4,
      name: "Balón de fútbol",
      category: "Deportes",
      status: "Disponible",
      date: "22/08/2026",
      icon: "⚽",
    },
  ];

  const loans = [
    {
      id: 1,
      person: "Carlos Ramírez",
      course: "5° A",
      item: "Laptop Lenovo",
      status: "Activo",
      initials: "CR",
    },
    {
      id: 2,
      person: "María González",
      course: "3° B",
      item: "Proyector Epson",
      status: "Activo",
      initials: "MG",
    },
    {
      id: 3,
      person: "Juan Pérez",
      course: "6° A",
      item: "Microscopio escolar",
      status: "Activo",
      initials: "JP",
    },
  ];

  if (!user) {
    return (
      <div className="no-session-page">
        <div className="no-session-card">
          <div className="no-session-logo">
            <School size={42} />
          </div>

          <span className="school-label">
            COLEGIO DON BOSCO
          </span>

          <h1>Sistema de Inventario</h1>

          <p>
            Administra, organiza y controla los objetos
            y recursos del colegio desde un solo lugar.
          </p>

          <button
            className="login-button"
            onClick={() =>
              navigate("/login")
            }
          >
            Iniciar sesión
            <ChevronRight size={19} />
          </button>
        </div>
      </div>
    );
  }

  const isAdmin =
    user.role === "ADMIN";

  const isProfesor =
    user.role === "PROFESOR";

  const isEstudiante =
    user.role === "ESTUDIANTE";

  const roleLabel =
    user.role === "ADMIN"
      ? "Administrador"
      : user.role === "PROFESOR"
      ? "Profesor"
      : "Estudiante";

  const visibleLoans = isEstudiante
    ? loans.filter(
        (loan) =>
          loan.person === user.name
      )
    : loans;

  const heroText = isAdmin
    ? "Administra y controla todos los objetos, materiales y recursos del Colegio Don Bosco de una manera rápida, ordenada y segura."
    : isProfesor
    ? "Consulta los objetos disponibles y solicita los materiales que necesitas para tus clases."
    : "Consulta los materiales disponibles del colegio y revisa tus préstamos actuales.";

  return (
    <div
      className={`dashboard ${
        sidebarOpen
          ? ""
          : "sidebar-hidden"
      }`}
    >
      <aside
        className={`sidebar ${
          sidebarOpen
            ? ""
            : "sidebar-collapsed"
        }`}
      >
        <button
          className="sidebar-brand"
          onClick={() =>
            navigate("/")
          }
          style={{
            border: "none",
            background: "transparent",
            color: "inherit",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
          }}
        >
          <div className="brand-icon">
            <School size={31} />
          </div>

          <div>
            <h2>Inventario</h2>
            <span>Don Bosco</span>
          </div>
        </button>

        <div className="menu-title">
          MENÚ PRINCIPAL
        </div>

        <nav className="sidebar-nav">
          <button
            className="nav-item active"
            onClick={() =>
              navigate("/")
            }
          >
            <LayoutDashboard size={20} />
            <span>Inicio</span>
          </button>

          <button
            className="nav-item"
            onClick={() =>
              navigate("/inventario")
            }
          >
            <Package size={20} />
            <span>Inventario</span>
          </button>

          <button
            className="nav-item"
            onClick={() =>
              navigate("/prestamos")
            }
          >
            <Handshake size={20} />

            <span>
              {isEstudiante
                ? "Mis préstamos"
                : "Préstamos"}
            </span>
          </button>

          {isAdmin && (
            <>
              <button
                className="nav-item"
                onClick={() =>
                  navigate("/categorias")
                }
              >
                <FolderOpen size={20} />
                <span>Categorías</span>
              </button>

              <button
                className="nav-item"
                onClick={() =>
                  navigate("/reportes")
                }
              >
                <BarChart3 size={20} />
                <span>Reportes</span>
              </button>

              <button
                className="nav-item"
                onClick={() =>
                  navigate("/usuarios")
                }
              >
                <Users size={20} />
                <span>Usuarios</span>
              </button>
            </>
          )}
        </nav>

        <div className="sidebar-bottom">
          {isAdmin && (
            <button
              className="nav-item"
              onClick={() =>
                navigate("/configuracion")
              }
            >
              <Settings size={20} />
              <span>Configuración</span>
            </button>
          )}

          <button
            className="nav-item logout"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Cerrar sesión</span>
          </button>
        </div>

        <div className="sidebar-decoration">
          <School
            size={100}
            strokeWidth={1}
          />
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-button"
              onClick={() =>
                setSidebarOpen(
                  !sidebarOpen
                )
              }
              title={
                sidebarOpen
                  ? "Ocultar menú"
                  : "Mostrar menú"
              }
            >
              <Menu size={22} />
            </button>

            <div>
              <h2>Panel principal</h2>

              <p>
                Inventario Colegio Don Bosco
              </p>
            </div>
          </div>

          <div className="topbar-right">
            <div className="notifications-wrapper">
              <button
                className="notification-button"
                onClick={() =>
                  setShowNotifications(
                    !showNotifications
                  )
                }
              >
                <Bell size={21} />

                <span className="notification-dot">
                  3
                </span>
              </button>

              {showNotifications && (
                <div className="notifications-panel">
                  <div className="notifications-header">
                    <div>
                      <strong>
                        Notificaciones
                      </strong>

                      <span>3 nuevas</span>
                    </div>

                    <button
                      onClick={() =>
                        setShowNotifications(
                          false
                        )
                      }
                    >
                      <X size={17} />
                    </button>
                  </div>

                  <div className="notification-item">
                    <div className="notification-icon warning">
                      <Clock3 size={17} />
                    </div>

                    <div>
                      <strong>
                        Préstamo pendiente
                      </strong>

                      <p>
                        Revisa los préstamos
                        pendientes de devolución.
                      </p>
                    </div>
                  </div>

                  <div className="notification-item">
                    <div className="notification-icon success">
                      <CheckCircle2
                        size={17}
                      />
                    </div>

                    <div>
                      <strong>
                        Objeto disponible
                      </strong>

                      <p>
                        Hay materiales disponibles
                        en el inventario.
                      </p>
                    </div>
                  </div>

                  <div className="notification-item">
                    <div className="notification-icon info">
                      <Package size={17} />
                    </div>

                    <div>
                      <strong>
                        Inventario
                      </strong>

                      <p>
                        Consulta los recursos del
                        colegio.
                      </p>
                    </div>
                  </div>

                  <button
                    className="notification-footer"
                    onClick={() => {
                      setShowNotifications(
                        false
                      );

                      navigate(
                        "/prestamos"
                      );
                    }}
                  >
                    Revisar préstamos
                  </button>
                </div>
              )}
            </div>

            <button
              className="user-profile"
              onClick={() => {
                if (isAdmin) {
                  navigate("/usuarios");
                }
              }}
              style={{
                border: "none",
                background: "transparent",
                cursor: isAdmin
                  ? "pointer"
                  : "default",
              }}
            >
              <div className="user-avatar">
                {user.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="user-info">
                <strong>
                  {user.name}
                </strong>

                <span>
                  {roleLabel}
                </span>
              </div>
            </button>
          </div>
        </header>

        <section className="hero">
          <div className="hero-content">
            <span className="welcome">
              BIENVENIDO DE NUEVO,{" "}
              {user.name.toUpperCase()} 👋
            </span>

            <h1>
              Gestión inteligente para
              <span>
                {" "}
                nuestro colegio
              </span>
            </h1>

            <p>
              {heroText}
            </p>

            <div className="hero-actions">
              {isAdmin && (
                <>
                  <button
                    className="primary-action"
                    onClick={() =>
                      navigate(
                        "/inventario/nuevo"
                      )
                    }
                  >
                    <Plus size={19} />
                    Registrar objeto
                  </button>

                  <button
                    className="secondary-action"
                    onClick={() =>
                      navigate(
                        "/prestamos/nuevo"
                      )
                    }
                  >
                    <UserPlus size={19} />
                    Nuevo préstamo
                  </button>
                </>
              )}

              {isProfesor && (
                <>
                  <button
                    className="primary-action"
                    onClick={() =>
                      navigate(
                        "/prestamos/nuevo"
                      )
                    }
                  >
                    <UserPlus size={19} />
                    Solicitar préstamo
                  </button>

                  <button
                    className="secondary-action"
                    onClick={() =>
                      navigate(
                        "/inventario"
                      )
                    }
                  >
                    <Search size={19} />
                    Consultar objetos
                  </button>
                </>
              )}

              {isEstudiante && (
                <>
                  <button
                    className="primary-action"
                    onClick={() =>
                      navigate(
                        "/inventario"
                      )
                    }
                  >
                    <Search size={19} />
                    Consultar objetos
                  </button>

                  <button
                    className="secondary-action"
                    onClick={() =>
                      navigate(
                        "/prestamos"
                      )
                    }
                  >
                    <Handshake size={19} />
                    Mis préstamos
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="hero-illustration">
            <div className="illustration-circle circle-one" />
            <div className="illustration-circle circle-two" />

            <div className="hero-box">
              <Package
                size={80}
                strokeWidth={1.3}
              />
            </div>
          </div>
        </section>

        <section className="stats-grid">
          <button
            className="stat-card"
            onClick={() =>
              navigate("/inventario")
            }
            style={{
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <div className="stat-icon blue">
              <Package size={25} />
            </div>

            <div className="stat-content">
              <span>
                OBJETOS REGISTRADOS
              </span>

              <strong>1,248</strong>

              <small className="positive">
                Recursos del colegio
              </small>
            </div>
          </button>

          <button
            className="stat-card"
            onClick={() =>
              navigate("/inventario")
            }
            style={{
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <div className="stat-icon green">
              <CheckCircle2
                size={25}
              />
            </div>

            <div className="stat-content">
              <span>DISPONIBLES</span>

              <strong>932</strong>

              <small>
                74.7% del total
              </small>
            </div>
          </button>

          <button
            className="stat-card"
            onClick={() =>
              navigate("/prestamos")
            }
            style={{
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <div className="stat-icon orange">
              <Clock3 size={25} />
            </div>

            <div className="stat-content">
              <span>
                {isEstudiante
                  ? "MIS PRÉSTAMOS"
                  : "PRESTADOS"}
              </span>

              <strong>
                {isEstudiante
                  ? visibleLoans.length
                  : 216}
              </strong>

              <small>
                {isEstudiante
                  ? "Préstamos registrados"
                  : "17.3% del total"}
              </small>
            </div>
          </button>

          {isAdmin && (
            <button
              className="stat-card"
              onClick={() =>
                navigate("/categorias")
              }
              style={{
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <div className="stat-icon purple">
                <FolderOpen size={25} />
              </div>

              <div className="stat-content">
                <span>
                  CATEGORÍAS
                </span>

                <strong>28</strong>

                <small>
                  Categorías activas
                </small>
              </div>
            </button>
          )}
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <div className="card-title">
                <div className="small-icon">
                  <Package size={18} />
                </div>

                <div>
                  <h3>
                    Objetos recientes
                  </h3>

                  <p>
                    Materiales registrados
                    recientemente
                  </p>
                </div>
              </div>

              <button
                className="view-all"
                onClick={() =>
                  navigate(
                    "/inventario"
                  )
                }
              >
                Ver todo
                <ChevronRight
                  size={17}
                />
              </button>
            </div>

            <div className="objects-list">
              {recentObjects.map(
                (object) => (
                  <div
                    className="object-row"
                    key={object.id}
                  >
                    <div className="object-main">
                      <div className="object-image">
                        {object.icon}
                      </div>

                      <div>
                        <strong>
                          {object.name}
                        </strong>

                        <span>
                          {
                            object.category
                          }
                        </span>
                      </div>
                    </div>

                    <div
                      className={`status ${
                        object.status ===
                        "Disponible"
                          ? "available"
                          : "borrowed"
                      }`}
                    >
                      {object.status}
                    </div>

                    <span className="object-date">
                      {object.date}
                    </span>
                  </div>
                )
              )}
            </div>

            <button
              className="card-footer-button"
              onClick={() =>
                navigate(
                  "/inventario"
                )
              }
            >
              Ver todos los objetos
              <ChevronRight
                size={17}
              />
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <div className="card-title">
                <div className="small-icon">
                  <Handshake size={18} />
                </div>

                <div>
                  <h3>
                    {isEstudiante
                      ? "Mis préstamos"
                      : "Préstamos recientes"}
                  </h3>

                  <p>
                    {isEstudiante
                      ? "Tus préstamos registrados"
                      : "Movimientos realizados recientemente"}
                  </p>
                </div>
              </div>

              <button
                className="view-all"
                onClick={() =>
                  navigate(
                    "/prestamos"
                  )
                }
              >
                Ver todo
                <ChevronRight
                  size={17}
                />
              </button>
            </div>

            <div className="loans-list">
              {visibleLoans.map(
                (loan, index) => (
                  <div
                    className="loan-row"
                    key={loan.id}
                  >
                    <div
                      className={`loan-avatar avatar-${
                        (index % 3) + 1
                      }`}
                    >
                      {loan.initials}
                    </div>

                    <div className="loan-person">
                      <strong>
                        {loan.person}
                      </strong>

                      <span>
                        {loan.course}
                      </span>
                    </div>

                    <div className="loan-object">
                      <span>
                        Objeto
                      </span>

                      <strong>
                        {loan.item}
                      </strong>
                    </div>

                    <div
                      className={`status ${
                        loan.status ===
                        "Activo"
                          ? "borrowed"
                          : "available"
                      }`}
                    >
                      {loan.status}
                    </div>
                  </div>
                )
              )}

              {visibleLoans.length ===
                0 && (
                <div
                  style={{
                    padding: "25px",
                    textAlign: "center",
                    color: "#7e8b9e",
                  }}
                >
                  No tienes préstamos
                  registrados.
                </div>
              )}
            </div>

            <button
              className="card-footer-button"
              onClick={() =>
                navigate(
                  "/prestamos"
                )
              }
            >
              {isEstudiante
                ? "Ver mis préstamos"
                : "Ver todos los préstamos"}

              <ChevronRight
                size={17}
              />
            </button>
          </div>
        </section>

        <section className="bottom-banner">
          <div className="banner-icon">
            <School size={25} />
          </div>

          <div>
            <strong>
              Ayudemos a cuidar los
              recursos del colegio
            </strong>

            <p>
              Mantener el inventario
              actualizado permite tener un
              mejor control de todos los
              materiales.
            </p>
          </div>

          <div className="banner-decoration">
            <Package
              size={60}
              strokeWidth={1}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;