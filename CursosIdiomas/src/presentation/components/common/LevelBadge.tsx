const colors: Record<string, string> = {
  A1: "bg-green-100 text-green-800",
  A2: "bg-green-100 text-green-800",
  B1: "bg-yellow-100 text-yellow-800",
  B2: "bg-yellow-100 text-yellow-800",
  C1: "bg-red-100 text-red-800",
  C2: "bg-red-100 text-red-800",
};

export const LevelBadge = ({ level }: { level: string }) => (
  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${colors[level] ?? "bg-gray-100 text-gray-700"}`}>
    {level}
  </span>
);