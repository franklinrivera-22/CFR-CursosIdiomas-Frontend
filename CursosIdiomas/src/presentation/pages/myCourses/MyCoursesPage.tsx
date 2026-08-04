import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, PlayCircle, CheckCircle, Clock } from "lucide-react";
import type { Enrollment } from "../../../core/models";
import { Spinner } from "../../components/common/Spinner";
import { getMyCoursesAction } from "../../../core/actions";

export const MyCoursesPage = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMyCoursesAction();
        setEnrollments(data);
      } catch {
        setError("No se pudieron cargar tus cursos.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl p-8">
        <Spinner label="Cargando tus cursos..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="mb-6 flex items-center gap-3">
        <GraduationCap className="text-blue-800" size={28} />
        <h1 className="text-2xl font-bold text-blue-950">Mis Cursos</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-red-700">{error}</div>
      )}

      {enrollments && enrollments.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
          <GraduationCap className="mx-auto mb-4 text-gray-300" size={64} />
          <h2 className="text-xl font-semibold text-gray-700">
            Aún no tienes cursos
          </h2>
          <p className="mt-1 text-gray-500">
            Cuando compres un curso aparecerá aquí para que puedas comenzarlo.
          </p>
          <button
            onClick={() => navigate("/catalogo")}
            className="mt-4 rounded-md bg-blue-800 px-4 py-2 text-white hover:bg-blue-900"
          >
            Ir al catálogo
          </button>
        </div>
      ) : (
        enrollments && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((e) => {
              const completed = e.progress >= 100;
              return (
                <div
                  key={e.id}
                  className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm"
                >
                  <img
                    src={e.course.imageUrl || "https://placehold.co/400x200"}
                    alt={e.course.title}
                    className="h-40 w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                        Nivel {e.course.level}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={14} /> {e.course.durationHours}h
                      </span>
                    </div>

                    <h3 className="mb-1 font-semibold text-blue-950">
                      {e.course.title}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-sm text-gray-500">
                      {e.course.description}
                    </p>

                    {/* Barra de progreso */}
                    <div className="mt-auto">
                      <div className="mb-1 flex justify-between text-xs text-gray-500">
                        <span>Progreso</span>
                        <span>{e.progress}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full ${
                            completed ? "bg-green-500" : "bg-blue-700"
                          }`}
                          style={{ width: `${e.progress}%` }}
                        />
                      </div>

                      <button
                        disabled={completed}
                        className={`mt-3 flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white ${
                          completed
                            ? "cursor-default bg-green-600"
                            : "bg-blue-800 hover:bg-blue-900"
                        }`}
                      >
                        {completed ? (
                          <>
                            <CheckCircle size={16} /> Completado
                          </>
                        ) : (
                          <>
                            <PlayCircle size={16} /> Comenzar curso
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};