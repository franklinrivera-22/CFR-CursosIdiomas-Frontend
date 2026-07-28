import { Clock, ShoppingCart, Tag } from "lucide-react";
import type { Course } from "../../../core/models";
import { LevelBadge } from "../common/LevelBadge";
import { useAuth } from "../../hooks"; 

interface Props {
  course: Course;
  onAdd: (course: Course) => void;
}

export const CourseCard = ({ course, onAdd }: Props) => {
  const { isAdmin } = useAuth(); 

  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-lg">
      <img
        src={course.imageUrl || "https://img.freepik.com/vector-premium/concepto-cursos-idiomas-personas-computadoras-aprenden-idiomas-ilustracion-vectorial_357257-1385.jpg?w=2000"}
        alt={course.title}
        className="h-40 w-full object-cover"
      />
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1 text-sm text-blue-800">
            <Tag size={14} /> {course.category?.name ?? "General"}
          </span>
          <LevelBadge level={course.level} />
        </div>

        <h3 className="mb-1 text-lg font-bold text-blue-950">{course.title}</h3>
        <p className="mb-3 flex-1 text-sm text-gray-600 line-clamp-3">
          {course.description}
        </p>

        <div className="mb-3 flex items-center gap-1 text-sm text-gray-500">
          <Clock size={14} /> {course.durationHours} horas
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-blue-950">
            Lps.{course.price.toFixed(2)}
          </span>

          {!isAdmin && (
            <button
              onClick={() => onAdd(course)}
              className="flex items-center gap-1 rounded-md bg-blue-800 px-3 py-2 text-sm text-white transition hover:bg-blue-900"
            >
              <ShoppingCart size={16} /> AGREGAR
            </button>
          )}
        </div>
      </div>
    </div>
  );
};