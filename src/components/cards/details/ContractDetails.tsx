import { Contract } from "@/interfaces/contract";
import { formatDateForDisplay } from "@/utils/formatters/formatDate";
import { formatDecimalValue } from "@/utils/formatters/formatDecimal";
import { Building, Calendar, DollarSign, Shield, Clock } from "lucide-react";
import type { ReactNode } from "react";

interface DetailItemProps {
  icon: ReactNode;
  label: string;
  value: string;
}
const DetailItem = ({ icon, label, value }: DetailItemProps) => (
  <div className="flex items-start gap-3">
    <div className="text-primary mt-1">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export function ContractDetails({ contract }: { contract: Contract }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-xs border">
      <h2 className="font-bold text-xl mb-4 border-b pb-2">
        Detalhes do Contrato
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailItem
          icon={<Building size={20} />}
          label="Imóvel"
          value={contract.property.title}
        />
        <DetailItem
          icon={<DollarSign size={20} />}
          label="Valor do Aluguel"
          value={`R$ ${formatDecimalValue(contract.rentAmount)}`}
        />
        <DetailItem
          icon={<Calendar size={20} />}
          label="Data de Início"
          value={formatDateForDisplay(contract.startDate)}
        />
        <DetailItem
          icon={<Calendar size={20} />}
          label="Data de Término"
          value={formatDateForDisplay(contract.endDate)}
        />
        <DetailItem
          icon={<Clock size={20} />}
          label="Duração"
          value={`${contract.durationInMonths} meses`}
        />
        <DetailItem
          icon={<Shield size={20} />}
          label="Tipo de Garantia"
          value={contract.guaranteeType.replace("_", " ")}
        />
        {contract.condoFee && parseFloat(contract.condoFee) > 0 && (
          <DetailItem
            icon={<DollarSign size={20} />}
            label="Condomínio"
            value={`R$ ${formatDecimalValue(contract.condoFee)}`}
          />
        )}
        {contract.iptuFee && parseFloat(contract.iptuFee) > 0 && (
          <DetailItem
            icon={<DollarSign size={20} />}
            label="IPTU"
            value={`R$ ${formatDecimalValue(contract.iptuFee)}`}
          />
        )}
      </div>
    </div>
  );
}
