import { LogIn } from "lucide-react";
import { type SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("cfr@cursos.com");
  const [password, setPassword] = useState("Cfr1234*");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: SyntheticEvent) => {
    if (e) e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const res = await login(email, password);
      setLoading(false);

      if (res.ok) {
        const savedRoles: string[] = JSON.parse(
          localStorage.getItem("roles") || "[]",
        );

        if (savedRoles.includes("ADMIN")) {
          navigate("/admin/cursos", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        setError(
          res.message ||
            "Correo o contraseña incorrectos. Por favor, verifica tus datos.",
        );
      }
    } catch {
      setLoading(false);
      setError("Ocurrió un error inesperado al intentar iniciar sesión.");
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md p-4">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <LogIn className="mx-auto mb-2 text-blue-800" size={40} />
          <h1 className="text-2xl font-bold text-blue-950">Ingresar</h1>
          <p className="text-sm text-gray-500">Acceso para administradores</p>
        </div>

        {/* Mensaje de error dinámico */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input de Correo */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          {/* Input de Contraseña */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          {/* Botón de Ingresar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-slate-800 py-2 font-semibold text-white hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-400">
          Demo: admin@cursos.com / admin123
        </p>
      </div>
    </div>
  );
};
