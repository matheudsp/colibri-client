"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  ArrowDownUp,
  AlertCircle,
  ArrowLeftRight,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import {
  TransfersService,
  Transfer,
} from "@/services/domains/transfersService";
import { BankAccountService } from "@/services/domains/bankAccountService";
import { extractAxiosError } from "@/services/api";
import { CustomButton } from "@/components/forms/CustomButton";
import { formatDecimalValue } from "@/utils/formatters/formatDecimal";
import { EmptyCard } from "@/components/common/EmptyCard";

const statusMap = {
  DONE: {
    label: "Concluída",
    className: "bg-green-100 text-green-800 border border-green-800",
    icon: <CheckCircle size={14} />,
  },
  PENDING: {
    label: "Pendente",
    className: "bg-yellow-100 text-yellow-800 border border-yellow-800",
    icon: <Clock size={14} />,
  },
  FAILED: {
    label: "Falhou",
    className: "bg-red-100 text-red-800 border border-red-800",
    icon: <XCircle size={14} />,
  },
  CANCELLED: {
    label: "Cancelado",
    className: "bg-gray-100 text-gray-700 border border-gray-700",
    icon: <XCircle size={14} />,
  },
};

// Componente da Lista de Transferências
const TransfersList = ({ transfers }: { transfers: Transfer[] }) => {
  if (transfers.length === 0) {
    return (
      <EmptyCard icon={<ArrowDownUp />} title="Nenhum repasse encontrado" />
    );
  }
  return (
    <div className="mt-4 border rounded-lg overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {transfers.map((transfer) => {
          // Busca a configuração do status ou usa um padrão
          const statusInfo = statusMap[transfer.status] || {
            label: transfer.status,
            className: "bg-gray-100 text-gray-800 ",
            icon: <Clock size={14} />,
          };

          return (
            <li
              key={transfer.id}
              className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex-col">
                <p
                  className={`font-bold text-lg ${
                    transfer.status === "DONE"
                      ? "text-green-600"
                      : "text-gray-800"
                  }`}
                >
                  R$ {formatDecimalValue(transfer.value)}
                </p>
                <p className="text-sm text-gray-500">
                  {transfer.paymentOrderId
                    ? `Repasse Automático`
                    : `Saque Manual`}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Realizado em: {transfer.createdAt}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-xs gap-1 font-semibold rounded-full flex items-center  ${statusInfo.className}`}
              >
                {statusInfo.icon}
                {statusInfo.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export function TransfersTab() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [transfersRes, balanceRes] = await Promise.all([
        TransfersService.findMyTransfers(),
        BankAccountService.getBalance(),
      ]);
      setTransfers(transfersRes.data as unknown as Transfer[]);
      setBalance(balanceRes.data.balance);
    } catch (error) {
      toast.error("Erro ao carregar dados de repasses.", {
        description: extractAxiosError(error),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleManualWithdraw = async () => {
    if (balance <= 0) {
      toast.error("Você não possui saldo para sacar.");
      return;
    }

    setIsWithdrawing(true);
    try {
      await TransfersService.createManualTransfer({});
      toast.success("Solicitação de saque enviada!", {
        description: "O valor estará na sua conta em breve.",
      });
      await fetchData(); // Recarrega os dados para atualizar o saldo e a lista
    } catch (error) {
      toast.error("Falha ao solicitar saque.", {
        description: extractAxiosError(error),
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Card de Saldo e Saque */}
      <div className="bg-gray-50 p-4 rounded-xl border">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-500">
              Saldo Disponível
            </h2>
            <p className="text-3xl font-bold text-green-600">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(balance)}
            </p>
          </div>
          <CustomButton
            onClick={handleManualWithdraw}
            disabled={isWithdrawing || loading || balance <= 0}
            className="h-10"
          >
            {isWithdrawing ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <ArrowLeftRight size={18} className="mr-2" />
            )}
            {isWithdrawing ? "Processando..." : "Solicitar Saque"}
          </CustomButton>
        </div>
        <div className="mt-4 text-xs text-gray-500 p-3 rounded-lg flex sm:flex-row flex-col items-center gap-2">
          <AlertCircle className="text-gray-400" size={20} />
          <span>
            O saque manual solicita a transferência do valor total disponível na
            sua conta para a chave PIX cadastrada.
          </span>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800">
          Histórico de Repasses
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <TransfersList transfers={transfers} />
        )}
      </div>
    </div>
  );
}
