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
    
    const res = await login(email, password);
    setLoading(false);
    
if (res.ok) {
  navigate("/", { replace: true });
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

        {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <div className="space-y-4">

          <input 
            type="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Correo"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" 
          />

          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)} 
            placeholder="Contraseña"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" 
          />

          <button 
            onClick={(e) => handleSubmit(e)} 
            disabled={loading}
            className="w-full rounded-md bg-slate-800 py-2 font-semibold text-white hover:bg--900 disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Demo: admin@cursos.com / admin123
        </p>
      </div>
    </div>
  );
};