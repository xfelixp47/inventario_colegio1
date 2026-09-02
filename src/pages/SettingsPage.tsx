import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Bell,
  PackageSearch,
  Clock3,
  LayoutDashboard,
  Save,
  RotateCcw,
  ShieldCheck,
  UserRound,
  Database,
  CheckCircle2,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

import { authRepository } from "../repositories/authRepository";
import "./SettingsPage.css";

type AppSettings = {
  notifications: boolean;
  lowStockAlerts: boolean;
  loanReminders: boolean;
  compactMode: boolean;
  rowsPerPage: string;
  startPage: string;
};

const SETTINGS_KEY = "don_bosco_settings";

const defaultSettings: AppSettings = {
  notifications: true,
  lowStockAlerts: true,
  loanReminders: true,
  compactMode: false,
  rowsPerPage: "10",
  startPage: "inicio",
};

function SettingsPage() {
  const navigate = useNavigate();

  const user = authRepository.getCurrentUser();

  const [settings, setSettings] =
    useState<AppSettings>(defaultSettings);

  const [saved, setSaved] = useState(false);

  /* =========================
     CARGAR CONFIGURACIÓN
  ========================= */

  useEffect(() => {
    const savedSettings =
      localStorage.getItem(SETTINGS_KEY);

    if (savedSettings) {
      try {
        const parsedSettings =
          JSON.parse(savedSettings);

        setSettings({
          ...defaultSettings,
          ...parsedSettings,
        });
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  /* =========================
     CAMBIAR TOGGLE
  ========================= */

  const toggleSetting = (
    settingName:
      | "notifications"
      | "lowStockAlerts"
      | "loanReminders"
      | "compactMode"
  ) => {
    setSaved(false);

    setSettings((currentSettings) => ({
      ...currentSettings,
      [settingName]:
        !currentSettings[settingName],
    }));
  };

  /* =========================
     GUARDAR
  ========================= */

  const saveSettings = () => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  /* =========================
     RESTAURAR
  ========================= */

  const restoreSettings = () => {
    const confirmRestore = window.confirm(
      "¿Quieres restaurar la configuración predeterminada?"
    );

    if (!confirmRestore) return;

    setSettings(defaultSettings);

    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(defaultSettings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="settings-page">
      {/* VOLVER */}

      <button
        className="settings-back-button"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={18} />
        Volver al inicio
      </button>

      {/* HEADER */}

      <header className="settings-header">
        <div>
          <span className="settings-eyebrow">
            PERSONALIZACIÓN DEL SISTEMA
          </span>

          <h1>Configuración</h1>

          <p>
            Ajusta el comportamiento del sistema de
            inventario del Colegio Don Bosco según tus
            necesidades.
          </p>
        </div>

        <button
          className="save-settings-button"
          onClick={saveSettings}
        >
          {saved ? (
            <>
              <CheckCircle2 size={18} />
              Guardado
            </>
          ) : (
            <>
              <Save size={18} />
              Guardar cambios
            </>
          )}
        </button>
      </header>

      {/* PERFIL */}

      <section className="settings-profile-card">
        <div className="settings-profile-left">
          <div className="settings-profile-avatar">
            {user?.name
              ?.charAt(0)
              .toUpperCase() || "U"}
          </div>

          <div>
            <span>SESIÓN ACTUAL</span>

            <h2>
              {user?.name || "Usuario"}
            </h2>

            <p>
              Carnet: {user?.carnet || "No disponible"}
            </p>
          </div>
        </div>

        <div className="settings-profile-role">
          <ShieldCheck size={16} />

          <span>
            {user?.role || "Usuario"}
          </span>
        </div>

        <div className="profile-decoration">
          <UserRound size={110} strokeWidth={0.8} />
        </div>
      </section>

      {/* CONTENIDO */}

      <div className="settings-grid">
        {/* =================================
            NOTIFICACIONES
        ================================= */}

        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-section-icon blue">
              <Bell size={21} />
            </div>

            <div>
              <h2>Notificaciones</h2>

              <p>
                Controla los avisos que recibirás dentro
                del sistema.
              </p>
            </div>
          </div>

          <div className="settings-options">
            {/* NOTIFICACIONES */}

            <div className="setting-row">
              <div className="setting-row-info">
                <div className="setting-small-icon">
                  <Bell size={17} />
                </div>

                <div>
                  <strong>
                    Mostrar notificaciones
                  </strong>

                  <span>
                    Mostrar avisos en el panel principal.
                  </span>
                </div>
              </div>

              <button
                type="button"
                className={`toggle-switch ${
                  settings.notifications
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  toggleSetting("notifications")
                }
                aria-label="Activar o desactivar notificaciones"
              >
                <span></span>
              </button>
            </div>

            {/* STOCK */}

            <div className="setting-row">
              <div className="setting-row-info">
                <div className="setting-small-icon warning">
                  <PackageSearch size={17} />
                </div>

                <div>
                  <strong>
                    Alertas de stock bajo
                  </strong>

                  <span>
                    Avisar cuando queden pocos objetos.
                  </span>
                </div>
              </div>

              <button
                type="button"
                className={`toggle-switch ${
                  settings.lowStockAlerts
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  toggleSetting("lowStockAlerts")
                }
              >
                <span></span>
              </button>
            </div>

            {/* PRÉSTAMOS */}

            <div className="setting-row">
              <div className="setting-row-info">
                <div className="setting-small-icon orange">
                  <Clock3 size={17} />
                </div>

                <div>
                  <strong>
                    Recordatorios de préstamos
                  </strong>

                  <span>
                    Avisar cuando un préstamo esté por
                    vencer.
                  </span>
                </div>
              </div>

              <button
                type="button"
                className={`toggle-switch ${
                  settings.loanReminders
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  toggleSetting("loanReminders")
                }
              >
                <span></span>
              </button>
            </div>
          </div>
        </section>

        {/* =================================
            APARIENCIA
        ================================= */}

        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-section-icon purple">
              <SlidersHorizontal size={21} />
            </div>

            <div>
              <h2>Preferencias</h2>

              <p>
                Personaliza cómo se muestra el contenido.
              </p>
            </div>
          </div>

          <div className="settings-options">
            {/* VISTA COMPACTA */}

            <div className="setting-row">
              <div className="setting-row-info">
                <div className="setting-small-icon purple">
                  <LayoutDashboard size={17} />
                </div>

                <div>
                  <strong>
                    Vista compacta
                  </strong>

                  <span>
                    Reduce el espacio entre elementos.
                  </span>
                </div>
              </div>

              <button
                type="button"
                className={`toggle-switch ${
                  settings.compactMode
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  toggleSetting("compactMode")
                }
              >
                <span></span>
              </button>
            </div>

            {/* REGISTROS */}

            <div className="setting-select-row">
              <div>
                <strong>
                  Registros por página
                </strong>

                <span>
                  Cantidad de elementos que se mostrarán.
                </span>
              </div>

              <div className="settings-select">
                <select
                  value={settings.rowsPerPage}
                  onChange={(e) => {
                    setSaved(false);

                    setSettings({
                      ...settings,
                      rowsPerPage:
                        e.target.value,
                    });
                  }}
                >
                  <option value="5">5</option>

                  <option value="10">
                    10
                  </option>

                  <option value="20">
                    20
                  </option>

                  <option value="50">
                    50
                  </option>
                </select>

                <ChevronDown size={15} />
              </div>
            </div>

            {/* PÁGINA INICIAL */}

            <div className="setting-select-row">
              <div>
                <strong>
                  Página inicial
                </strong>

                <span>
                  Sección predeterminada del sistema.
                </span>
              </div>

              <div className="settings-select large">
                <select
                  value={settings.startPage}
                  onChange={(e) => {
                    setSaved(false);

                    setSettings({
                      ...settings,
                      startPage:
                        e.target.value,
                    });
                  }}
                >
                  <option value="inicio">
                    Inicio
                  </option>

                  <option value="inventario">
                    Inventario
                  </option>

                  <option value="prestamos">
                    Préstamos
                  </option>
                </select>

                <ChevronDown size={15} />
              </div>
            </div>
          </div>
        </section>

        {/* =================================
            SISTEMA
        ================================= */}

        <section className="settings-card settings-system-card">
          <div className="settings-card-header">
            <div className="settings-section-icon green">
              <Database size={21} />
            </div>

            <div>
              <h2>Información del sistema</h2>

              <p>
                Información general del proyecto.
              </p>
            </div>
          </div>

          <div className="system-information">
            <div className="system-info-row">
              <span>
                Nombre del sistema
              </span>

              <strong>
                Inventario Colegio Don Bosco
              </strong>
            </div>

            <div className="system-info-row">
              <span>
                Versión
              </span>

              <strong>
                1.0.0
              </strong>
            </div>

            <div className="system-info-row">
              <span>
                Estado
              </span>

              <div className="system-status">
                <span></span>
                Operativo
              </div>
            </div>

            <div className="system-info-row">
              <span>
                Almacenamiento
              </span>

              <strong>
                Navegador local
              </strong>
            </div>
          </div>
        </section>

        {/* =================================
            SEGURIDAD
        ================================= */}

        <section className="settings-card security-settings-card">
          <div className="security-settings-content">
            <div className="security-big-icon">
              <ShieldCheck size={32} />
            </div>

            <div>
              <span>SEGURIDAD</span>

              <h2>
                Protege la información del colegio
              </h2>

              <p>
                No compartas tu contraseña y recuerda cerrar
                sesión cuando utilices una computadora
                compartida.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              authRepository.logout();

              navigate("/login", {
                replace: true,
              });
            }}
          >
            Cerrar sesión
          </button>
        </section>
      </div>

      {/* RESTAURAR */}

      <section className="restore-settings">
        <div>
          <RotateCcw size={20} />

          <div>
            <strong>
              Restaurar configuración
            </strong>

            <p>
              Vuelve a utilizar las opciones originales del
              sistema.
            </p>
          </div>
        </div>

        <button onClick={restoreSettings}>
          Restaurar valores
        </button>
      </section>

      {/* MENSAJE GUARDADO */}

      {saved && (
        <div className="settings-saved-message">
          <CheckCircle2 size={18} />

          Configuración guardada correctamente
        </div>
      )}
    </div>
  );
}

export default SettingsPage;