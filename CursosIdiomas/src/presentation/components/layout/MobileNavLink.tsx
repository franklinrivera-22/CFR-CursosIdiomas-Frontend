import { Link } from "react-router";
import type { ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  text: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
}

export const MobileNavLink = ({ icon, text, to, active = false, onClick }: Props) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-2 rounded-md px-3 py-2 text-base ${
      active ? "bg-slate-800 text-white" : "text-blue-100 hover:bg-slate-800"
    }`}
  >
    {icon}
    <span>{text}</span>
  </Link>
);