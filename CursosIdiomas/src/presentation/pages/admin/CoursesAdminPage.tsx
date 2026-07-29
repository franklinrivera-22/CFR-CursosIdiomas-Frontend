import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createCourseAction,
  deleteCourseAction,
  getCategoriesAction,
  getCoursesAction,
  updateCourseAction,
} from "../../../core/actions";
import type { Category, Course } from "../../../core/models";

import { useAuth } from "../../hooks";
import { Spinner } from "../../components/common/Spinner";

const empty = {
  title: "",
  description: "",
  level: "A1",
  price: 0,
  durationHours: 10,
  imageUrl: "",
  categoryId: "",
};

export const CoursesAdminPage = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<typeof empty>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    const localRoles = JSON.parse(localStorage.getItem("roles") || "[]");
    const localIsAdmin = localRoles.includes("Admin");

    if (!isAdmin && !localIsAdmin && !localToken) {
      navigate("/login");
    }
  }, [isAdmin, navigate]);

  const load = async () => {
    const p = await getCoursesAction("", "", 1, 100);
    setCourses(p.items);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await load();
      } finally {
        setLoading(false);
      }
    };

    void init();
    getCategoriesAction()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]:
        name === "price" || name === "durationHours" ? Number(value) : value,
    });
  };

  const resetForm = () => {
    setForm(empty);
    setEditId(null);
    setError(null);
  };

  const submit = async () => {
    setError(null);
    if (!form.title || !form.categoryId || form.price <= 0) {
      setError("Título, idioma y un precio mayor a 0 son obligatorios.");
      return;
    }
    try {
      if (editId) {
        await updateCourseAction(editId, form);
      } else {
        await createCourseAction(form);
      }
      resetForm();
      load();
    } catch {
      setError("No se pudo guardar. Verifica tu sesión de administrador.");
    }
  };

  const edit = (c: Course) => {
    setEditId(c.id);
    setForm({
      title: c.title,
      description: c.description,
      level: c.level,
      price: c.price,
      durationHours: c.durationHours,
      imageUrl: c.imageUrl,
      categoryId: c.category?.id ?? "",
    });
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este curso?")) return;
    try {
      await deleteCourseAction(id);
      load();
    } catch {
      setError("No se pudo eliminar.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold text-slate-800">
        Administrar cursos
      </h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow-md">
          <h2 className="mb-3 flex items-center gap-2 font-bold text-blue-950">
            {editId ? <Pencil size={18} /> : <Plus size={18} />}
            {editId ? "Editar curso" : "Nuevo curso"}
          </h2>

          {error && (
            <div className="mb-3 rounded-md bg-red-50 p-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="Título"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Descripción"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={onChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Selecciona idioma</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <select
                name="level"
                value={form.level}
                onChange={onChange}
                className="w-1/2 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {["A1", "A2", "B1", "B2", "C1", "C2"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <input
                name="durationHours"
                type="number"
                value={form.durationHours}
                onChange={onChange}
                placeholder="Horas"
                className="w-1/2 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <input
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={onChange}
              placeholder="Precio"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={onChange}
              placeholder="URL de imagen"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <div className="flex gap-2">
              <button
                onClick={submit}
                className="flex-1 rounded-md bg-blue-800 py-2 text-sm font-semibold text-white hover:bg-blue-900"
              >
                {editId ? "Actualizar" : "Crear"}
              </button>
              {editId && (
                <button
                  onClick={resetForm}
                  className="rounded-md bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {loading ? (
            <Spinner />
          ) : (
            <div className="overflow-hidden rounded-lg bg-white shadow-md">
              <table className="w-full text-left text-sm">
                <thead className="bg-blue-950 text-white">
                  <tr>
                    <th className="px-4 py-3">Curso</th>
                    <th className="px-4 py-3">Nivel</th>
                    <th className="px-4 py-3">Precio</th>
                    <th className="px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <p className="font-semibold text-blue-950">{c.title}</p>
                        <p className="text-xs text-gray-500">
                          {c.category?.name}
                        </p>
                      </td>
                      <td className="px-4 py-3">{c.level}</td>
                      <td className="px-4 py-3">Lps.{c.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => edit(c)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => remove(c.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
