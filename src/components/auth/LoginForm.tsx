import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  IdCard,
  LockKeyhole,
  LogIn,
  Package,
  School,
  ShieldCheck,
} from "lucide-react";

import { authRepository } from "../../repositories/authRepository";
import "./LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();

  const [carnet, setCarnet] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!carnet.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    const user = authRepository.login({
      carnet,
      password,
    });

    if (!user) {
      setError("Carnet o contraseña incorrectos.");
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <div className="login-page">
      {/* DECORACIONES DE FONDO */}
      <div className="login-background-circle circle-1"></div>
      <div className="login-background-circle circle-2"></div>

      <main className="login-container">
        {/* LADO IZQUIERDO */}
        <section className="login-information">
          <div className="information-content">
            <div className="login-brand">
              <div className="login-brand-icon">
                <School size={37} />
              </div>

              <div>
                <span>SISTEMA DE</span>
                <h2>Inventario</h2>
              </div>
            </div>

            <div className="login-welcome">
              <span className="institution-label">
                COLEGIO DON BOSCO
              </span>

              <h1>
                Todo el inventario,
                <span> en un solo lugar.</span>
              </h1>

              <p>
                Gestiona los objetos, materiales y préstamos del colegio
                de manera rápida, organizada y segura.
              </p>
            </div>

            <div className="login-features">
              <div className="login-feature">
                <div className="feature-icon">
                  <Package size={20} />
                </div>

                <div>
                  <strong>Control de inventario</strong>
                  <span>
                    Consulta y administra los objetos del colegio.
                  </span>
                </div>
              </div>

              <div className="login-feature">
                <div className="feature-icon">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <strong>Acceso seguro</strong>
                  <span>
                    La información está disponible solo para usuarios
                    autorizados.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="school-decoration">
            <School size={240} strokeWidth={0.6} />
          </div>

          <div className="dots-decoration">
            {Array.from({ length: 25 }).map((_, index) => (
              <span key={index}></span>
            ))}
          </div>
        </section>

        {/* LADO DERECHO */}
        <section className="login-form-section">
          <div className="login-form-wrapper">
            <div className="mobile-logo">
              <School size={31} />
            </div>

            <div className="login-heading">
              <span>BIENVENIDO 👋</span>

              <h2>Iniciar sesión</h2>

              <p>
                Ingresa tus datos para acceder al sistema de inventario.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {/* CARNET */}
              <div className="form-group">
                <label htmlFor="carnet">
                  Carnet de identidad
                </label>

                <div className="input-container">
                  <IdCard size={20} />

                  <input
                    id="carnet"
                    type="text"
                    value={carnet}
                    onChange={(e) => {
                      setCarnet(e.target.value);
                      setError("");
                    }}
                    placeholder="Ingrese su carnet"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* CONTRASEÑA */}
              <div className="form-group">
                <div className="password-label">
                  <label htmlFor="password">
                    Contraseña
                  </label>

                  <button
                    type="button"
                    className="forgot-password"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <div className="input-container">
                  <LockKeyhole size={20} />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Ingrese su contraseña"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="show-password"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="login-error">
                  <span>!</span>
                  {error}
                </div>
              )}

              {/* BOTÓN */}
              <button
                type="submit"
                className="login-submit-button"
              >
                <span>Ingresar al sistema</span>
                <LogIn size={19} />
              </button>
            </form>

            <div className="login-divider">
              <span></span>
              <p>ACCESO INSTITUCIONAL</p>
              <span></span>
            </div>

            <div className="security-message">
              <ShieldCheck size={18} />

              <p>
                Sistema exclusivo para personal autorizado del
                Colegio Don Bosco.
              </p>
            </div>

            <footer className="login-footer">
              © 2026 Colegio Don Bosco · Sistema de Inventario
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LoginForm;