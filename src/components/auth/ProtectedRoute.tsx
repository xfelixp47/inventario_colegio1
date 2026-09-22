import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { authRepository } from "../../repositories/authRepository";
import type { UserRole } from "../../types/auth";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: UserRole[];
};

function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const user = authRepository.getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;