import { Routes, Route } from "react-router-dom";

import LoginForm from "../components/auth/LoginForm";

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
      <Route path="/login" element={<LoginForm />} />

      <Route path="/" element={<HomePage />} />

      <Route
        path="/inventario"
        element={<InventoryPage />}
      />

      <Route
        path="/inventario/nuevo"
        element={<NewObjectPage />}
      />

      <Route
        path="/prestamos"
        element={<LoansPage />}
      />

      <Route
        path="/prestamos/nuevo"
        element={<NewLoanPage />}
      />

      <Route
        path="/categorias"
        element={<CategoriesPage />}
      />

      <Route
        path="/reportes"
        element={<ReportsPage />}
      />

      <Route
        path="/usuarios"
        element={<UsersPage />}
      />

      <Route
        path="/configuracion"
        element={<SettingsPage />}
      />
    </Routes>
  );
}

export default AppRoutes;