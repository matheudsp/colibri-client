"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  ArrowLeftRight,
  AlertCircle,
  ArrowDownUp,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import {
  TransfersService,
  Transfer,
} from "@/services/domains/transfersService";
import { BankAccountService } from "@/services/domains/bankAccountService";
import { extractAxiosError } from "@/services/api";
import { CustomButton } from "@/components/forms/CustomButton";

import { EmptyCard } from "@/components/common/EmptyCard";
import clsx from "clsx";

const STATUS = {
  DONE: {
    label: "Concluída",
    badge: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100",
    icon: <CheckCircle size={16} className="text-emerald-600" />,
  },
  PENDING: {
    label: "Pendente",
    badge: "bg-yellow-50 text-yellow-800 ring-1 ring-yellow-100",
    icon: <Clock size={16} className="text-yellow-600" />,
  },
  FAILED: {
    label: "Falhou",
    badge: "bg-rose-50 text-rose-800 ring-1 ring-rose-100",
    icon: <XCircle size={16} className="text-rose-600" />,
  },
  CANCELLED: {
    label: "Cancelado",
    badge: "bg-gray-50 text-gray-700 ring-1 ring-gray-100",
    icon: <XCircle size={16} className="text-gray-500" />,
  },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDateShort(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function timeAgo(iso?: string) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "há segundos";
  const min = Math.floor(sec / 60);
  if (min < 60) return `há ${min} min`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `há ${days}d`;
}

const TransferCard = ({ transfer }: { transfer: Transfer }) => {
  const status = STATUS[transfer.status as keyof typeof STATUS] ?? {
    label: transfer.status ?? "Desconhecido",
    badge: "bg-gray-50 text-gray-700 ring-1 ring-gray-100",
    icon: <FileText size={16} className="text-gray-500" />,
  };

  const isAuto = Boolean(transfer.paymentOrderId);

  return (
    <li className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 hover:bg-gray-300/30 transition">
      <div className="flex items-center  gap-3 w-full ">
        <div
          className={clsx(
            "flex items-center justify-center w-12 h-12 rounded-lg shadow-sm ",
            transfer.status === "DONE" ? "bg-emerald-50" : "bg-white"
          )}
        >
          <ArrowDownUp className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <div
            className={clsx(
              "text-lg font-semibold",
              transfer.status === "DONE" ? "text-emerald-600" : "text-gray-800"
            )}
          >
            {formatCurrency(transfer.value ?? 0)}
          </div>
          <div className="text-sm text-gray-500">
            {isAuto ? "Repasse Automático" : "Saque Manual"}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {formatDateShort(transfer.createdAt)} •{" "}
            {timeAgo(transfer.createdAt)}
          </div>
        </div>
      </div>

      {/* <div className="mt-3 md:mt-0">
          <div className="text-xs text-gray-700">
            <span className="inline-flex items-center gap-2 text-xs text-gray-500">
              <span className="font-medium text-gray-700">
                {transfer.paymentOrderId}
              </span>
            </span>
          </div>

          {transfer.description && (
            <div className="text-sm text-gray-600 mt-1">
              {transfer.description}
            </div>
          )} 
        </div> */}

      <div className="flex items-center gap-3 mt-3 md:mt-0">
        <span
          className={clsx(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold",
            status.badge
          )}
        >
          {status.icon}
          {status.label}
        </span>
      </div>
    </li>
  );
};

/* Transfers list group */
const TransfersList = ({ transfers }: { transfers: Transfer[] }) => {
  if (!transfers || transfers.length === 0) {
    return (
      <EmptyCard
        icon={<ArrowDownUp />}
        title="Nenhum repasse encontrado"
        subtitle="Ainda não há registros de repasses para esta conta."
      />
    );
  }

  return (
    <ul className=" divide-y divide-gray-300/50">
      {transfers.map((t) => (
        <TransferCard key={t.id} transfer={t} />
      ))}
    </ul>
  );
};

export function TransfersTab() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [balance, setBalance] = useState<number>(0);
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
      setBalance(balanceRes.data.balance ?? 0);
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
      await fetchData();
    } catch (error) {
      toast.error("Falha ao solicitar saque.", {
        description: extractAxiosError(error),
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="border rounded-xl p-4 ">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-sm text-gray-500">Saldo disponível</h3>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-gray-900">
                {formatCurrency(balance)}
              </span>
              <span className="text-sm text-gray-500">Saldo líquido</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CustomButton
              onClick={handleManualWithdraw}
              disabled={isWithdrawing || loading || balance <= 0}
              className="h-10 px-4"
              aria-label="Solicitar saque"
            >
              {isWithdrawing ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Processando...
                </>
              ) : (
                <>
                  <ArrowLeftRight size={16} className="mr-2" /> Solicitar Saque
                </>
              )}
            </CustomButton>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3 text-sm text-gray-500">
          <AlertCircle className="w-5 h-5 text-gray-400" />
          <div>
            O saque manual solicita a transferência do valor disponível na sua
            conta para a chave PIX cadastrada.
            {/* <div className="mt-1 text-xs text-gray-400">
              Taxas e prazos podem ser aplicados conforme sua instituição.
            </div> */}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Histórico de Repasses
          </h2>
          <div className="text-sm text-gray-500">
            {transfers.length} registros
          </div>
        </div>

        {loading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse  border  p-4 h-24" />
            ))}
          </div>
        ) : (
          <TransfersList transfers={transfers} />
        )}
      </div>
    </section>
  );
}

export default TransfersTab;
