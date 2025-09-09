import { CheckCircle, XCircle } from "lucide-react";
import clsx from "clsx";
export const StatusBadge = ({
  isActive,
  activeText = "Ativado",
  inactiveText = "Desativado",
}: {
  isActive: boolean;
  activeText?: string;
  inactiveText?: string;
}) => {
  return (
    <span
      className={clsx(
        "flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full",
        isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
      )}
    >
      {isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
      {isActive ? activeText : inactiveText}
    </span>
  );
};
