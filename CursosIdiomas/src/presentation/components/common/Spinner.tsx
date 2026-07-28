export const Spinner = ({ label = "Cargando..." }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-800" />
    <span className="text-gray-600">{label}</span>
  </div>
);