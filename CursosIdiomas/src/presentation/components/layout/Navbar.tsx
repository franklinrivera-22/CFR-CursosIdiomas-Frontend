import { BookOpen, History, Home, LogIn, LogOut, Menu, Settings, ShoppingCart, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "./NavLink";
import { MobileNavLink } from "./MobileNavLink";
import { useAuth, useCart } from "../../hooks";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { isAuthenticated, isAdmin, fullName, logout } = useAuth();

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const scaleWrapper = "inline-block transition-transform duration-200 hover:scale-110 ";

  return (
    <nav className="bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen size={24} />
            <span className="text-xl font-bold">Cursos de Idiomas</span>
          </Link>

          {/* Navegación escritorio */}
          <div className="hidden items-center space-x-2 md:flex">
            
            <span className={scaleWrapper}>
              <NavLink icon={<Home size={18} />} text="Inicio" to="/" active={isActive("/")} />
            </span>

            <span className={scaleWrapper}>
              <NavLink icon={<BookOpen size={18} />} text="Catálogo" to="/catalogo" active={isActive("/catalogo")} />
            </span>

            {isAuthenticated && (
              <span className={scaleWrapper}>
                <NavLink
                  icon={<History size={18} />}
                  text={isAdmin ? "Todas las transacciones" : "Mis compras"}
                  to="/historial"
                  active={isActive("/historial")}
                />
              </span>
            )}

            {isAdmin && (
              <span className={scaleWrapper}>
                <NavLink icon={<Settings size={18} />} text="Admin" to="/admin/cursos" active={isActive("/admin")} />
              </span>
            )}

            {!isAdmin && (
              <span className={scaleWrapper}>
                <Link
                  to="/carrito"
                  className="relative flex items-center gap-1 rounded-md px-3 py-2 text-sm hover:bg-slate-800"
                >
                  <ShoppingCart size={18} />
                  <span>Carrito</span>
                  {totalItems > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </span>
            )}

            {isAuthenticated ? (
              <span className={scaleWrapper}>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-sm hover:bg-slate-800"
                >
                  <LogOut size={18} /> Salir ({fullName?.split(" ")[0]})
                </button>
              </span>
            ) : (
              <>
                {/* INGRESAR */}
                <span className={scaleWrapper}>
                  <NavLink icon={<LogIn size={18} />} text="Ingresar" to="/login" active={isActive("/login")} />
                </span>

                {/* REGISTRO */}
                <span className={scaleWrapper}>
                  <NavLink icon={<UserPlus size={18} />} text="Registro" to="/registro" active={isActive("/registro")} />
                </span>
              </>
            )}
          </div>

          {/* Botón mobile */}
          <div className="flex items-center md:hidden">
            {!isAdmin && (
              <Link to="/carrito" className="relative mr-2 p-2 transition-transform duration-200 hover:scale-110">
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú mobile */}
      {isMenuOpen && (
        <div className="space-y-1 px-2 pb-3 pt-2 md:hidden">
          <MobileNavLink icon={<Home size={18} />} text="Inicio" to="/" active={isActive("/")} onClick={() => setIsMenuOpen(false)} />
          <MobileNavLink icon={<BookOpen size={18} />} text="Catálogo" to="/catalogo" active={isActive("/catalogo")} onClick={() => setIsMenuOpen(false)} />
          
          {isAuthenticated && (
            <MobileNavLink
              icon={<History size={18} />}
              text={isAdmin ? "Todas las transacciones" : "Mis compras"}
              to="/historial"
              active={isActive("/historial")}
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          {isAdmin && (
            <MobileNavLink icon={<Settings size={18} />} text="Admin" to="/admin/cursos" active={isActive("/admin")} onClick={() => setIsMenuOpen(false)} />
          )}

          {isAuthenticated ? (
            <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base text-blue-100 hover:bg-slate-800">
              <LogOut size={18} /> Salir ({fullName?.split(" ")[0]})
            </button>
          ) : (
            <>
              <MobileNavLink icon={<LogIn size={18} />} text="Ingresar" to="/login" active={isActive("/login")} onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink icon={<UserPlus size={18} />} text="Registro" to="/registro" active={isActive("/registro")} onClick={() => setIsMenuOpen(false)} />
            </>
          )}
        </div>
      )}
    </nav>
  );
};