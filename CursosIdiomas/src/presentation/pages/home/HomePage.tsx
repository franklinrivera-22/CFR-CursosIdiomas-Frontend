import { BookOpen, DollarSign, Languages, Receipt } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getStatisticsAction } from "../../../core/actions";
import type { Statistics } from "../../../core/models";
import { Spinner } from "../../components/common/Spinner";


export const HomePage = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStatisticsAction()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { title: "Cursos", value: stats?.coursesCount ?? 0, icon: <BookOpen size={32} /> },
    { title: "Idiomas", value: stats?.categoriesCount ?? 0, icon: <Languages size={32} /> },
    { title: "Transacciones", value: stats?.transactionsCount ?? 0, icon: <Receipt size={32} /> },
    { title: "Ingresos (Lps)", value: (stats?.totalRevenue ?? 0).toFixed(2), icon: <DollarSign size={32} /> },
  ];

  const scaleWrapper = "inline-block transition-transform duration-200 hover:scale-105";

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8 overflow-hidden rounded-2xl bg-linear-to-r from-[#9a0002] via-[#800002] to-[#4a0001] p-10 text-white shadow-xl">
        <div className="max-w-xl">
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight">
            Aprende un nuevo idioma
          </h1>
          <p className="mb-6 text-lg text-red-100/90 font-light">
            Cursos de inglés, francés y alemán en todos los niveles. Impulsa tu futuro hoy mismo.
          </p>
          <span className={scaleWrapper}>
            <Link 
              to="/catalogo" 
              className="rounded-xl bg-amber-500 px-6 py-3.5 text-base font-bold text-slate-900 shadow-lg transition-all hover:bg-amber-400 hover:shadow-amber-500/30"
            >
              Ver catálogo
            </Link>
          </span>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div 
              key={c.title} 
              className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                {c.icon}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-green-800">
                  {c.title}
                </p>
                <p className="text-2xl font-black text-green-600">
                  {c.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};