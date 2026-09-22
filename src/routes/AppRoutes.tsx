import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";

import LoginPage from "../pages/auth/LoginPage";
import HomePage from "../pages/HomePage";
import InventoryPage from "../pages/InventoryPage";
import LoansPage from "../pages/LoansPage";
import CategoriesPage from "../pages/CategoriesPage";
import ReportsPage from "../pages/ReportsPage";
import UsersPage from "../pages/UsersPage";
import SettingsPage from "../pages/SettingsPage";
import NewObjectPage from "../pages/NewObjectPage";
import NewLoanPage from "../pages/NewLoanPage";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventario"
        element={
          <ProtectedRoute
            allowedRoles={[
              "ADMIN",
              "PROFESOR",
              "ESTUDIANTE",
            ]}
          >
            <InventoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/prestamos"
        element={
          <ProtectedRoute
            allowedRoles={[
              "ADMIN",
              "PROFESOR",
              "ESTUDIANTE",
            ]}
          >
            <LoansPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventario/nuevo"
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
          >
            <NewObjectPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/prestamos/nuevo"
        element={
          <ProtectedRoute
            allowedRoles={[
              "ADMIN",
              "PROFESOR",
            ]}
          >
            <NewLoanPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/categorias"
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
          >
            <CategoriesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reportes"
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
          >
            <ReportsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/usuarios"
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
          >
            <UsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/configuracion"
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
          >
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/nuevo-objeto"
        element={
          <Navigate
            to="/inventario/nuevo"
            replace
          />
        }
      />

      <Route
        path="/nuevo-prestamo"
        element={
          <Navigate
            to="/prestamos/nuevo"
            replace
          />
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;