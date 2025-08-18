"use client";

import { Building2, MapPin } from "lucide-react";
import { Condominium } from "@/services/domains/condominiumService";

interface CondominiumCardProps {
  condominium: Condominium;
}

export function CondominiumCard({ condominium }: CondominiumCardProps) {
  // const router = useRouter();

  const handleCardClick = () => {
    // Futuramente, redirecionar para uma página de detalhes do condomínio
    // router.push(`/condominiums/${condominium.id}`);
    console.log("Card clicado:", condominium.id);
  };

  return (
    <article
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      tabIndex={0}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-3 rounded-xl">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
              {condominium.name}
            </h3>
            <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
              <MapPin size={14} />
              {condominium.city} - {condominium.state}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
