import { FaExpeditedssl } from "react-icons/fa";
interface Props {
  withBorder?: boolean;
  className?: string;
}
export const SecuritySeal = ({ withBorder = false, className }: Props) => {
  return (
    <div
      className={`flex items-center justify-center gap-2 rounded-lg  p-2 text-center ${
        withBorder && "bg-emerald-50/70 border border-emerald-200/80"
      } ${className}`}
    >
      <FaExpeditedssl className="h-5 w-5 text-emerald-600 shrink-0" />
      <p className="text-xs font-medium text-emerald-800">
        Ambiente 100% Seguro. Seus dados estão protegidos.
      </p>
    </div>
  );
};
