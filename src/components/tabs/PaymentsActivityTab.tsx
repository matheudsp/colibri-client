"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import { CheckCircle, AlertTriangle, Receipt, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PaymentService } from "@/services/domains/paymentService";
import { PaymentResponse } from "@/interfaces/payment";
import { PaymentStatus } from "@/constants/payment";
import { toast } from "react-toastify";
import { Pagination } from "@/components/layout/Pagination";

export type PaymentEvent = {
  id: string;
  userName: string;
  action: string;
  contractLabel: string;
  propertyLabel?: string;
  amount: number;
  dateISO: string;
  status: "PAID" | "LATE" | "CANCELED" | "PENDING" | string;
  note?: string;
};

const statusMap: Record<PaymentStatus, PaymentEvent["status"]> = {
  [PaymentStatus.PAGO]: "PAID",
  [PaymentStatus.ATRASADO]: "LATE",
  [PaymentStatus.CANCELADO]: "CANCELED",
  [PaymentStatus.PENDENTE]: "PENDING",
  [PaymentStatus.ISENTO]: "ISENTO",
  [PaymentStatus.CONFIRMADO]: "CONFIRMADO",
  [PaymentStatus.FALHOU]: "FALHOU",
  [PaymentStatus.EM_REPASSE]: "EM_REPASSE",
  [PaymentStatus.RECEBIDO]: "RECEBIDO",
};

const STATUS_CONFIG: Record<
  string,
  { label: string; badge: string; color: string; icon: React.ReactNode }
> = {
  PAID: {
    label: "Pago",
    badge: "bg-emerald-100 text-emerald-800",
    color: "emerald",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  LATE: {
    label: "Vencido",
    badge: "bg-rose-100 text-rose-800",
    color: "rose",
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  CANCELED: {
    label: "Cancelado",
    badge: "bg-gray-100 text-gray-800",
    color: "gray",
    icon: <X className="w-4 h-4" />,
  },
  PENDING: {
    label: "Pendente",
    badge: "bg-yellow-100 text-yellow-800",
    color: "yellow",
    icon: <Receipt className="w-4 h-4" />,
  },
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDateLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "há poucos segundos";
  const min = Math.floor(sec / 60);
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  return `há ${d} d`;
}

function transformPaymentResponseToEvent(
  payment: PaymentResponse
): PaymentEvent {
  let action = "registrou";
  switch (payment.status) {
    case PaymentStatus.PAGO:
      action = "pagou";
      break;
    case PaymentStatus.ATRASADO:
      action = "atrasou";
      break;
    case PaymentStatus.CANCELADO:
      action = "cancelou";
      break;
  }

  const amount = parseFloat(payment.amountDue) || 0;

  return {
    id: payment.id,
    userName: payment.contract.tenant?.name ?? "Inquilino não informado",
    action,
    contractLabel: `Contrato #${payment.contractId.substring(0, 8)}`,
    propertyLabel: payment.contract.property?.title,
    amount,
    dateISO: payment.paidAt || payment.dueDate,
    status: statusMap[payment.status] || payment.status,
    note: `Fatura referente ao contrato ${payment.contractId.substring(0, 8)}`,
  };
}

export function PaymentsActivityTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageFromUrl = Number(searchParams?.get("page") ?? 1) || 1;
  const limitFromUrl = Number(searchParams?.get("limit") ?? 5) || 5;

  const [events, setEvents] = useState<PaymentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PAID" | "LATE" | "CANCELED">(
    "ALL"
  );
  const [totalItems, setTotalItems] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    let mounted = true;
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString();
        // const futureDate = new Date();
        // futureDate.setMonth(futureDate.getMonth() + 6);
        // const endDate = futureDate.toISOString();
        const response = await PaymentService.findUserPayments({
          endDate: today,
          limit: limitFromUrl,
          page: pageFromUrl,
        });

        const data = response?.data ?? [];
        const totalFromResponse = response?.meta?.resource?.total;

        if (!mounted) return;

        if (Array.isArray(data)) {
          const transformed = data.map(transformPaymentResponseToEvent);
          transformed.sort(
            (a, b) => +new Date(b.dateISO) - +new Date(a.dateISO)
          );
          setEvents(transformed);
        } else setEvents([]);

        if (typeof totalFromResponse === "number") {
          setTotalItems(totalFromResponse);
          setTotalPages(
            Math.max(1, Math.ceil(totalFromResponse / limitFromUrl))
          );
        } else {
          setTotalItems(null);
          setTotalPages(
            Math.max(1, pageFromUrl + (data.length === limitFromUrl ? 1 : 0))
          );
        }
      } catch (err) {
        toast.error("Erro ao carregar o histórico de pagamentos.");
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPayments();
    return () => {
      mounted = false;
    };
  }, [pageFromUrl, limitFromUrl]);

  const handleChangeLimit = useCallback(
    (newLimit: number) => {
      const params = new URLSearchParams(Array.from(searchParams ?? []));
      params.set("limit", String(newLimit));
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, searchParams, pathname]
  );

  const sorted = useMemo(
    () =>
      [...events].sort((a, b) => +new Date(b.dateISO) - +new Date(a.dateISO)),
    [events]
  );
  const filtered = useMemo(
    () =>
      filter === "ALL" ? sorted : sorted.filter((e) => e.status === filter),
    [sorted, filter]
  );
  const grouped = useMemo(() => {
    const map = new Map<string, PaymentEvent[]>();
    for (const ev of filtered) {
      const key = formatDateLabel(ev.dateISO);
      const arr = map.get(key) ?? [];
      arr.push(ev);
      map.set(key, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const statusAccent = (status: string) => {
    if (status === "PAID") return "bg-emerald-500";
    if (status === "LATE") return "bg-rose-500";
    if (status === "CANCELED") return "bg-gray-500";
    return "bg-yellow-500";
  };

  return (
    <section aria-live="polite" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Atividades de Pagamento
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Histórico das ações realizadas pelos locatários. Use os filtros para
            refinar.
          </p>
        </div>

        <div className="flex items-center gap-3 ml-auto flex-wrap">
          <div className="text-sm text-gray-600">Itens por página</div>
          <select
            value={String(limitFromUrl)}
            onChange={(e) => handleChangeLimit(Number(e.target.value))}
            className="border rounded px-3 py-2 bg-white text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* filters */}
      <div className="flex gap-2 flex-wrap items-center overflow-x-auto sm:overflow-visible py-1">
        <button
          onClick={() => setFilter("ALL")}
          className={clsx(
            "px-4 py-2 rounded-full text-sm font-medium flex-shrink-0",
            filter === "ALL"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700"
          )}
          aria-pressed={filter === "ALL"}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter("PAID")}
          className={clsx(
            "px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 flex-shrink-0",
            filter === "PAID"
              ? "bg-emerald-600 text-white"
              : "bg-emerald-100 text-emerald-800"
          )}
          aria-pressed={filter === "PAID"}
        >
          <CheckCircle className="w-4 h-4" />{" "}
          <span className="hidden sm:inline">Pagos</span>
        </button>
        <button
          onClick={() => setFilter("LATE")}
          className={clsx(
            "px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 flex-shrink-0",
            filter === "LATE"
              ? "bg-rose-600 text-white"
              : "bg-rose-100 text-rose-800"
          )}
          aria-pressed={filter === "LATE"}
        >
          <AlertTriangle className="w-4 h-4" />{" "}
          <span className="hidden sm:inline">Vencidos</span>
        </button>
        <button
          onClick={() => setFilter("CANCELED")}
          className={clsx(
            "px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 flex-shrink-0",
            filter === "CANCELED"
              ? "bg-gray-600 text-white"
              : "bg-gray-100 text-gray-800"
          )}
          aria-pressed={filter === "CANCELED"}
        >
          <X className="w-4 h-4" />{" "}
          <span className="hidden sm:inline">Cancelados</span>
        </button>

        <div className="ml-auto text-sm text-gray-500 flex-shrink-0">
          Total na página:{" "}
          <span className="font-medium">{filtered.length}</span>
        </div>
      </div>

      {/* content */}
      <main>
        {loading ? (
          <div aria-busy className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-4 bg-gray-200 rounded" />
                  <div className="w-1/2 h-3 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6 bg-white rounded-lg border text-center text-gray-500">
            <div className="mb-2">Nenhuma ação encontrada.</div>
            <div className="text-sm">
              Tente ajustar os filtros ou aumentar o período de busca.
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {grouped.map(([dateLabel, items]) => (
              <section
                key={dateLabel}
                aria-label={`Atividades em ${dateLabel}`}
              >
                <div className="mb-2 text-sm font-semibold text-gray-600">
                  {dateLabel}
                </div>

                <div className="space-y-3">
                  {items.map((ev) => {
                    const cfg = STATUS_CONFIG[ev.status] ?? {
                      label: ev.status,
                      badge: "bg-gray-100 text-gray-800",
                      color: "gray",
                      icon: <Receipt className="w-4 h-4" />,
                    };
                    return (
                      <div
                        key={ev.id}
                        className="flex flex-col sm:flex-row bg-white border rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
                      >
                        {/* accent bar */}
                        <div
                          className={clsx(
                            "w-full sm:w-2 flex-shrink-0",
                            statusAccent(ev.status)
                          )}
                          aria-hidden
                        />

                        <div className="flex-1 p-3 sm:p-4 flex items-center gap-3">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold">
                            <span className="text-sm">
                              {ev.userName
                                .split(" ")
                                .map((s) => s[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap text-sm">
                                  <span className="font-semibold text-gray-900 truncate">
                                    {ev.userName}
                                  </span>
                                  <span className="text-gray-600">
                                    {ev.action}
                                  </span>
                                  <span className="font-medium text-gray-800">
                                    {ev.contractLabel}
                                  </span>
                                  {ev.propertyLabel && (
                                    <span className="text-gray-500">•</span>
                                  )}
                                  {ev.propertyLabel && (
                                    <span className="text-gray-600 truncate">
                                      {ev.propertyLabel}
                                    </span>
                                  )}
                                </div>

                                <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
                                  <span
                                    className={clsx(
                                      "inline-flex items-center gap-2 px-2 py-1 rounded",
                                      cfg.badge
                                    )}
                                  >
                                    {cfg.icon}
                                    <span className="text-xs">{cfg.label}</span>
                                  </span>

                                  <div className="text-sm">
                                    {formatCurrency(ev.amount)}
                                  </div>
                                </div>
                              </div>

                              <div className="text-sm text-gray-500 text-left sm:text-right min-w-[140px]">
                                <div className="font-medium">
                                  {formatDateLabel(ev.dateISO)}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {timeAgo(ev.dateISO)}
                                </div>
                              </div>
                            </div>

                            {/* details on desktop */}
                            <div className="mt-3 hidden sm:block text-sm text-gray-700">
                              <div>{ev.note}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-gray-600">
          {totalItems !== null ? (
            <>
              Mostrando{" "}
              <span className="font-medium">
                {(pageFromUrl - 1) * limitFromUrl + 1}
              </span>
              –
              <span className="font-medium">
                {Math.min(pageFromUrl * limitFromUrl, totalItems)}
              </span>{" "}
              de <span className="font-medium">{totalItems}</span>
            </>
          ) : (
            <>
              Mostrando página{" "}
              <span className="font-medium">{pageFromUrl}</span>
            </>
          )}
        </div>

        <Pagination
          currentPage={pageFromUrl}
          totalPages={totalPages}
          total={totalItems ?? undefined}
          maxVisiblePages={7}
        />
      </div>
    </section>
  );
}
