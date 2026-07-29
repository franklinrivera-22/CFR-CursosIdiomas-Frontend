import { Route, Routes } from "react-router-dom";
import {
  CatalogPage,
  CartPage,
  HomePage,
  TransactionsPage,
  LoginPage,
  RegisterPage,
  CoursesAdminPage,
} from "../presentation/pages";
import { ProtectedRoute } from "../presentation/components/ProtectedRoute";
import { Navbar } from "../presentation/components/layout/Navbar";

export const AppRouter = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />

          <Route
            path="/carrito"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/historial"
            element={
              <ProtectedRoute>
                <TransactionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cursos"
            element={
              <ProtectedRoute requireAdmin>
                <CoursesAdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  );
};
