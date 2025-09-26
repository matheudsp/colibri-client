import { Flame } from "lucide-react";

export const InterestIndicator = ({ count }: { count: number }) => {
  if (!count || count === 0) return null;

  let text = "";
  let colorClasses = "";

  if (count <= 5) {
    text = `${count} pessoa${count > 1 ? "s" : ""} de olho`;
    colorClasses = "text-yellow-800 bg-yellow-100 border-yellow-200";
  } else if (count <= 15) {
    text = `Alta procura: ${count} interessados`;
    colorClasses = "text-orange-800 bg-orange-100 border-orange-200";
  } else {
    text = "Imóvel em Destaque!";
    colorClasses = "text-red-800 bg-red-100 border-red-200";
  }

  return (
    <div
      className={`shrink-0 flex items-center font-bold text-xs px-2.5 py-1 rounded-full border ${colorClasses}`}
    >
      <Flame size={14} className="mr-1.5" /> {text}
    </div>
  );
};
