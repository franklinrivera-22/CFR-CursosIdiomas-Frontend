import { BookOpen, DollarSign, Languages, Receipt } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getStatisticsAction } from "../../../core/actions/statistics.action";
import type { Statistics } from "../../../models";
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
    { title: "Cursos", value: stats?.coursesCount ?? 0, icon: <BookOpen size={40} /> },
    { title: "Idiomas", value: stats?.categoriesCount ?? 0, icon: <Languages size={40} /> },
    { title: "Transacciones", value: stats?.transactionsCount ?? 0, icon: <Receipt size={40} /> },
    { title: "Ingresos (Lps)", value: (stats?.totalRevenue ?? 0).toFixed(2), icon: <DollarSign size={40} /> },
  ];

  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="mb-6 rounded-lg bg-blue-900 p-8 text-white">
        <h1 className="mb-2 text-3xl font-bold">Aprende un nuevo idioma</h1>
        <p className="mb-4 text-blue-100">
          Cursos de inglés, francés y alemán en todos los niveles.
        </p>
        <Link to="/catalogo" className="inline-block rounded-md bg-green-500 px-4 py-2 font-semibold text-black hover:bg-blue-100">
          Ver catálogo
        </Link>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.title} className="flex items-center gap-4 rounded-lg bg-white p-5 shadow-md">
              <span className="text-green-500">{c.icon}</span>
              <div>
                <p className="text-sm text-gray-500">{c.title}</p>
                <p className="text-2xl font-bold text-green-500">{c.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};