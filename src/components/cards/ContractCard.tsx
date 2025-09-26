"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Contract } from "@/interfaces/contract";
import { contractStatus } from "@/constants/contractStatus";
import { formatDateForDisplay } from "@/utils/formatters/formatDate";
import { formatDecimalValue } from "@/utils/formatters/formatDecimal";
import {
  User,
  Calendar,
  DollarSign,
  ArrowRight,
  FileText,
  AlertCircle,
} from "lucide-react";

const DetailItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
      <Icon size={14} />
      <span>{label}</span>
    </div>
    <span className="font-semibold text-zinc-800 text-sm mt-0.5">{value}</span>
  </div>
);

export function ContractCard({ contract }: { contract: Contract }) {
  const router = useRouter();
  // console.log(contract, "OIASODAID");
  const statusInfo = useMemo(() => {
    return (
      contractStatus.find((s) => s.value === contract.status) || {
        value: "UNKNOWN",
        label: "Desconhecido",
        class: "",
      }
    );
  }, [contract.status]);

  const coverPhoto = useMemo(() => {
    if (!contract.property?.photos || contract.property.photos.length === 0) {
      return null;
    }
    return (
      contract.property.photos.find((p) => p.isCover) ||
      contract.property.photos[0]
    );
  }, [contract.property?.photos]);

  // Lógica para encontrar o próximo pagamento pendente
  const nextPayment = useMemo(() => {
    if (!contract.paymentsOrders || contract.paymentsOrders.length === 0) {
      return null;
    }
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas a data

    const pendingPayments = contract.paymentsOrders
      .filter(
        (p) =>
          (p.status === "PENDENTE" || p.status === "ATRASADO") &&
          new Date(p.dueDate) >= now
      )
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );

    return pendingPayments[0] || null;
  }, [contract.paymentsOrders]);

  const totalMonthlyCost = useMemo(() => {
    const rent = parseFloat(contract.rentAmount) || 0;
    const condo = parseFloat(contract.condoFee) || 0;
    const iptu = parseFloat(contract.iptuFee) || 0;
    return rent + condo + iptu;
  }, [contract.rentAmount, contract.condoFee, contract.iptuFee]);

  const handleCardClick = () => {
    router.push(`/contrato/${contract.id}`);
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      aria-label={`Ver detalhes do contrato do imóvel ${contract.property.title}`}
      className="bg-background rounded-2xl border border-border cursor-pointer transition-all duration-300   group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      <div className="p-4">
        <header className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0 w-full">
            <div className="relative w-16 h-16 rounded-lg bg-zinc-100 shrink-0 overflow-hidden border border-border">
              {coverPhoto ? (
                <Image
                  src={coverPhoto.url}
                  alt={`Foto de ${contract.property.title}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                  <FileText size={24} />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className="text-base font-bold text-zinc-900 truncate"
                title={contract.property.title}
              >
                {contract.property.title}
              </h3>
              <p className="text-xs text-zinc-500 truncate">
                Contrato #{contract.id.substring(0, 8)}
              </p>
            </div>
          </div>
          <div
            className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap flex items-center gap-1.5 self-end sm:self-auto ${statusInfo.class}`}
            aria-label={`Status: ${statusInfo.label}`}
          >
            {statusInfo.label}
          </div>
        </header>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          <DetailItem
            icon={User}
            label="Inquilino"
            value={contract.tenant.name}
          />
          <DetailItem
            icon={Calendar}
            label="Início"
            value={formatDateForDisplay(contract.startDate)}
          />
          <DetailItem
            icon={Calendar}
            label="Término"
            value={formatDateForDisplay(contract.endDate)}
          />
          <DetailItem
            icon={FileText}
            label="Duração"
            value={`${contract.durationInMonths} meses`}
          />
        </div>

        {nextPayment ? (
          <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-primary">
                Próximo Pagamento
              </p>
              <p className="text-sm text-zinc-700">
                Vence em{" "}
                <span className="font-bold">
                  {formatDateForDisplay(nextPayment.dueDate)}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-zinc-800">
                R$ {formatDecimalValue(nextPayment.amountDue)}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 rounded-lg bg-zinc-100 border border-border flex items-center gap-2 text-sm text-zinc-500">
            <AlertCircle size={16} />
            <span>Não há pagamentos pendentes.</span>
          </div>
        )}
      </div>

      <footer className="px-4 py-3 bg-zinc-50/70 border-t border-border rounded-b-2xl flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
        <div>
          <span className="text-xs text-zinc-500">Valor do Aluguel</span>
          <p className="flex items-center gap-1 text-base font-bold text-zinc-800">
            <DollarSign size={16} />
            {formatDecimalValue(totalMonthlyCost)}
          </p>
        </div>
        <span className="inline-flex items-center text-sm font-semibold text-primary transition-transform duration-300 ">
          Ver Detalhes
          <ArrowRight size={16} className="ml-1" />
        </span>
      </footer>
    </article>
  );
}
