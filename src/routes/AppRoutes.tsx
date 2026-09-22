import { Routes, Route } from "react-router-dom";

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
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<HomePage />} />

      <Route path="/inventario" element={<InventoryPage />} />

      <Route path="/prestamos" element={<LoansPage />} />

      <Route path="/categorias" element={<CategoriesPage />} />

      <Route path="/reportes" element={<ReportsPage />} />

      <Route path="/usuarios" element={<UsersPage />} />

      <Route path="/configuracion" element={<SettingsPage />} />

      <Route path="/nuevo-objeto" element={<NewObjectPage />} />

      <Route path="/nuevo-prestamo" element={<NewLoanPage />} />
    </Routes>
  );
}

export default AppRoutes;