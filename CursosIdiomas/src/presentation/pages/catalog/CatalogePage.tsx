import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getCategoriesAction, getCoursesAction } from "../../../core/actions";
import type { Category, Course, Page } from "../../../core/models";
import { CourseCard, Spinner } from "../../components";
import { useCart } from "../../hooks";

export const CatalogPage = () => {
  const { addToCart } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState<Page<Course[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros controlados por el usuario
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getCategoriesAction().then(setCategories).catch(() => setCategories([]));
  }, []);


  useEffect(() => {
    let isActive = true;

    const loadCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        const coursesPage = await getCoursesAction(search, categoryId, currentPage);
        if (isActive) {
          setPage(coursesPage);
        }
      } catch {
        if (isActive) {
          setError("No se pudieron cargar los cursos.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadCourses();

    return () => {
      isActive = false;
    };
  }, [search, categoryId, currentPage]);

  return (
    <div className="mx-auto max-w-7xl p-4">
      <h1 className="mb-4 text-2xl font-bold text-blue-950">Catálogo de cursos</h1>

      {/* Filtros */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por título o nivel..."
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">TODOS LOS IDIOMAS</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Spinner label="Cargando cursos..." />
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4 text-red-700">{error}</div>
      ) : page && page.items.length === 0 ? (
        <div className="rounded-md bg-yellow-50 p-4 text-yellow-800">
          No se encontraron cursos con esos filtros.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {page?.items.map((course) => (
              <CourseCard key={course.id} course={course} onAdd={addToCart} />
            ))}
          </div>

          {/* Paginación */}
          {page && page.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                disabled={!page.hasPreviousPage}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="rounded-md bg-blue-800 px-4 py-2 text-white disabled:opacity-40"
              >
                Anterior
              </button>
              <span className="text-gray-600">
                Página {page.currentPage} de {page.totalPages}
              </span>
              <button
                disabled={!page.hasNextPage}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="rounded-md bg-blue-800 px-4 py-2 text-white disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};