import { Link } from "react-router";
import type { ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  text: string;
  to: string;
  active?: boolean;
}

export const NavLink = ({ icon, text, to, active = false }: Props) => (
  <Link
    to={to}
    className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm ${
      active ? "bg-slate-800 text-white" : "text-blue-100 hover:bg-slate-800"
    }`}
  >
    {icon}
    <span>{text}</span>
  </Link>
);
