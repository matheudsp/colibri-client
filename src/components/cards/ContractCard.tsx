"use client";

import { useRouter } from "next/navigation";
import { Contract } from "@/interfaces/contract";
import { contractStatus } from "@/constants/contractStatus";
import { formatDateForDisplay } from "@/utils/formatters/formatDate";
import { Building, User, Calendar, DollarSign } from "lucide-react";
import { formatDecimalValue } from "@/utils/formatters/formatDecimal";

export function ContractCard({ contract }: { contract: Contract }) {
  const router = useRouter();
  const defaultStatus = {
    value: "UNKNOWN",
    label: "Status Desconhecido",
    class: "bg-gray-100 text-gray-800",
  };
  const statusInfo =
    contractStatus.find((s) => s.value === contract.status) || defaultStatus;

  const handleCardClick = () => {
    router.push(`/properties/${contract.propertyId}/contracts/${contract.id}`);
  };

  return (
    <article
      role="button"
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      tabIndex={0}
      aria-label={`Ver detalhes do contrato do imóvel ${contract.property.title}`}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
    >
      {/* Header - Imóvel */}
      <header className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-3 rounded-xl">
              <Building className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              {contract.property.title}
            </h3>
          </div>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${statusInfo.class}`}
            aria-label={`Status: ${statusInfo.label}`}
          >
            {statusInfo.label}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">Contrato de Aluguel</p>
      </header>

      {/* Detalhes */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" aria-hidden="true" />
          <span className="font-medium text-gray-600">Locador:</span>
          <span className="text-gray-900">{contract.landlord.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" aria-hidden="true" />
          <span className="font-medium text-gray-600">Inquilino:</span>
          <span className="text-gray-900">{contract.tenant.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" aria-hidden="true" />
          <span className="font-medium text-gray-600">Início:</span>
          <time dateTime={contract.startDate} className="text-gray-900">
            {formatDateForDisplay(contract.startDate)}
          </time>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-500" aria-hidden="true" />
          <span className="font-medium text-gray-600">Aluguel:</span>
          <span className="font-bold text-gray-900">
            {formatDecimalValue(contract.rentAmount)}
          </span>
        </div>
      </div>
    </article>
  );
}
