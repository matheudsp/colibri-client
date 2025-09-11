"use client";

import { useRouter } from "next/navigation";
import { Contract } from "@/interfaces/contract";
import { contractStatus } from "@/constants/contractStatus";
import { formatDateForDisplay } from "@/utils/formatters/formatDate";
import { Building, User, Calendar, DollarSign, ArrowRight } from "lucide-react";
import { formatDecimalValue } from "@/utils/formatters/formatDecimal";

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center gap-2 text-sm text-gray-600">
    <div className="flex-shrink-0 text-gray-400">{icon}</div>
    <div>
      <span className="font-medium">{label}:</span> {value}
    </div>
  </div>
);

export function ContractCard({ contract }: { contract: Contract }) {
  const router = useRouter();

  // Lógica original mantida para encontrar o status, usando sua estrutura de arquivo
  const defaultStatus = {
    value: "UNKNOWN",
    label: "Status Desconhecido",
    class: "bg-gray-100 text-gray-800",
  };
  const statusInfo =
    contractStatus.find((s) => s.value === contract.status) || defaultStatus;

  const handleCardClick = () => {
    router.push(`/contrato/${contract.id}`);
  };

  return (
    <article
      role="button"
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      tabIndex={0}
      aria-label={`Ver detalhes do contrato do imóvel ${contract.property.title}`}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-300 transition-all duration-300 hover:shadow-lg hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer group"
    >
      {/* Cabeçalho */}
      <header className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-primary/10 p-3 rounded-lg text-primary flex-shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h3
              className="text-lg font-bold text-gray-800 truncate"
              title={contract.property.title}
            >
              {contract.property.title}
            </h3>
            <p className="text-xs text-gray-500">Contrato de Aluguel</p>
          </div>
        </div>
        <div
          className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap flex items-center gap-1.5 ${statusInfo.class}`}
          aria-label={`Status: ${statusInfo.label}`}
        >
          {statusInfo.label}
        </div>
      </header>

      {/* Corpo com Detalhes */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
        <DetailItem
          icon={<User size={16} />}
          label="Inquilino"
          value={contract.tenant.name}
        />
        <DetailItem
          icon={<DollarSign size={16} />}
          label="Aluguel"
          value={`R$ ${formatDecimalValue(contract.rentAmount)}`}
        />
        <DetailItem
          icon={<Calendar size={16} />}
          label="Início"
          value={formatDateForDisplay(contract.startDate)}
        />
        <DetailItem
          icon={<User size={16} />}
          label="Locador"
          value={contract.landlord.name}
        />
      </div>

      {/* Rodapé com Ação */}
      <footer className="px-4 py-3 bg-gray-50/50 border-t border-gray-200 text-right">
        <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:underline">
          Ver Detalhes
          <ArrowRight
            size={16}
            className="ml-1 transition-transform group-hover:translate-x-1"
          />
        </span>
      </footer>
    </article>
  );
}
