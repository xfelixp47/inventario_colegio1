
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginForm from "../../components/auth/LoginForm";
import { authRepository } from "../../repositories/authRepository";

import type { LoginCredentials } from "../../types/auth";

import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (credentials: LoginCredentials) => {
    setError("");

    try {
      const user = await authRepository.login(credentials);

      if (!user) {
        setError("El carnet o la contraseña son incorrectos.");
        return;
      }

      navigate("/", { replace: true });
    } catch {
      setError("Ocurrió un error al iniciar sesión.");
    }
  };

  return (
    <main className="login-page">
      <LoginForm error={error} onSubmit={handleLogin} />
    </main>
  );
}

export default LoginPage;
