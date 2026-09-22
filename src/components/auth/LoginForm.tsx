import { useState } from "react";
import type { FormEvent } from "react";
import type { LoginCredentials } from "../../types/auth";
import "./LoginForm.css";

interface LoginFormProps {
  error?: string;
  onSubmit: (credentials: LoginCredentials) => void;
}

function LoginForm({ error, onSubmit }: LoginFormProps) {
  const [carnet, setCarnet] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit({
      carnet,
      password,
    });
  };

  return (
    <div className="login-container">

      <div className="login-left">
        <div className="brand">
          <div className="brand-logo">DB</div>

          <div>
            <h2>Don Bosco</h2>
            <span>Sistema de Inventario</span>
          </div>
        </div>

        <div className="hero-content">
          <span className="hero-tag">GESTIÓN INTELIGENTE</span>

          <h1>
            Administra el inventario
            <span> de forma simple.</span>
          </h1>

          <p>
            Controla objetos, préstamos, usuarios y reportes desde un solo lugar.
          </p>

          <div className="feature-list">

            <div className="feature">
              <div className="feature-icon">✓</div>
              <span>Control de inventario</span>
            </div>

            <div className="feature">
              <div className="feature-icon">✓</div>
              <span>Registro de préstamos</span>
            </div>

            <div className="feature">
              <div className="feature-icon">✓</div>
              <span>Administración de usuarios</span>
            </div>

          </div>
        </div>

        <div className="decor-circle circle-one"></div>
        <div className="decor-circle circle-two"></div>
      </div>

      <div className="login-right">

        <div className="login-card">

          <div className="mobile-logo">DB</div>

          <div className="login-header">
            <span className="small-title">BIENVENIDO</span>

            <h2>Iniciar sesión</h2>

            <p>
              Ingresa tus datos para acceder al sistema
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">

            <div className="input-group">
              <label htmlFor="carnet">Carnet</label>

              <div className="input-box">
                <span className="input-icon">👤</span>

                <input
                  id="carnet"
                  type="text"
                  placeholder="Ingresa tu carnet"
                  value={carnet}
                  onChange={(e) => setCarnet(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>

              <div className="input-box">
                <span className="input-icon">🔒</span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error">
                ⚠ {error}
              </div>
            )}

            <button type="submit" className="login-button">
              <span>Iniciar sesión</span>
              <span className="arrow">→</span>
            </button>

          </form>

          <div className="login-footer">
            Sistema de Inventario • Colegio Don Bosco
          </div>

        </div>
      </div>

    </div>
  );
}

export default LoginForm;