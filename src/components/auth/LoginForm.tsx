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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!carnet.trim() || !password.trim()) {
      return;
    }

    onSubmit({
      carnet,
      password,
    });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="carnet">Carnet</label>

        <input
          id="carnet"
          type="text"
          placeholder="Ingresa tu carnet"
          value={carnet}
          onChange={(e) => setCarnet(e.target.value)}
          autoComplete="username"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Contraseña</label>

        <input
          id="password"
          type="password"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>

      {error && <div className="login-error">{error}</div>}

      <button type="submit" className="login-button">
        Iniciar sesión
      </button>
    </form>
  );
}

export default LoginForm;