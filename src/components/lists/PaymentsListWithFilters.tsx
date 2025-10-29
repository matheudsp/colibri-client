"use client";

import React, { useMemo, useState, useEffect } from "react";

import { toast } from "sonner";
import { PaymentResponse } from "@/interfaces/payment";
import { PaymentStatus } from "@/constants";
import {
  PaymentService,
  PaymentFilters,
} from "@/services/domains/paymentService";
import { ChargeService } from "@/services/domains/chargeService";
import { extractAxiosError } from "@/services/api";
import { formatDateForDisplay } from "@/utils/formatters/formatDate";
import { formatDecimalValue } from "@/utils/formatters/formatDecimal";
import { statusMap } from "@/constants/paymentStatusMap";
import {
  Loader2,
  FileText,
  ArrowUpDown,
  Filter,
  XCircle,
  Calendar as CalendarIcon,
  User,
  Building2,
  SquareArrowOutUpRight,
} from "lucide-react";
import { CustomButton } from "@/components/forms/CustomButton";
import { CustomInput } from "@/components/forms/CustomInput";
import { CustomDropdownInput } from "@/components/forms/CustomDropdownInput";

import { EmptyCard } from "@/components/common/EmptyCard";
import { RegisterPaymentModal } from "@/components/modals/paymentModals/RegisterPaymentModal";
import { PaymentActionsDropdown } from "../dropdownMenus/PaymentActionsDropdown";
import Link from "next/link";

type SortKey = "dueDate" | "amountDue" | "property" | "status" | "tenant";

interface Props {
  payments?: PaymentResponse[];
  loading?: boolean;
  fetchOnMount?: boolean;
  showFilters?: boolean; // Nova propriedade para controlar a exibição dos filtros
  onRefresh?: () => Promise<void>;
  onOpenUrl?: (url: string) => void;
}

export function PaymentListWithFilters({
  payments: paymentsProp,
  loading: loadingProp = false,
  fetchOnMount = true,
  showFilters = true, // Valor padrão é true
  onRefresh,
  onOpenUrl,
}: Props) {
  const [payments, setPayments] = useState<PaymentResponse[]>(
    paymentsProp ?? []
  );
  const [loading, setLoading] = useState<boolean>(loadingProp);

  const [filters, setFilters] = useState<PaymentFilters>({});
  const [localFilters, setLocalFilters] = useState<PaymentFilters>({});

  const [sortBy, setSortBy] = useState<SortKey>("dueDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null
  );
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [showRegisterPaymentModal, setShowRegisterPaymentModal] =
    useState<boolean>(false);

  useEffect(() => {
    // Se dados são passados via props, atualiza o estado interno
    if (Array.isArray(paymentsProp)) {
      setPayments(paymentsProp);
    }
    // Atualiza o estado de loading conforme a prop
    setLoading(loadingProp);

    // Se a busca automática está desativada ou os dados já foram fornecidos, não faz nada
    if (!fetchOnMount || paymentsProp) return;

    // Busca os pagamentos apenas se fetchOnMount for true e nenhum dado foi passado
    fetchPayments(filters);
  }, [paymentsProp, loadingProp, fetchOnMount, filters]);

  const fetchPayments = async (currentFilters: PaymentFilters) => {
    setLoading(true);

    try {
      const response = await PaymentService.findUserPayments(currentFilters);
      const paymentsList = Array.isArray(response?.data) ? response.data : [];
      setPayments(paymentsList);
    } catch (error) {
      const errorMessage = extractAxiosError(error);
      toast.error("Falha ao buscar faturas", {
        description: errorMessage,
      });
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const uniqueProperties = useMemo(() => {
    const propertyMap = new Map<string, { id: string; title: string }>();
    payments.forEach((p) => {
      if (p.contract?.property?.id && p.contract.property.title) {
        propertyMap.set(p.contract.property.id, p.contract.property);
      }
    });
    return Array.from(propertyMap.values()).sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }, [payments]);

  const uniqueTenants = useMemo(() => {
    const tenantMap = new Map<string, { id: string; name: string }>();
    payments.forEach((p) => {
      if (p.contract?.tenant?.id && p.contract.tenant.name) {
        tenantMap.set(p.contract.tenant.id, p.contract.tenant);
      }
    });
    return Array.from(tenantMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [payments]);

  const updateLocalAndApply = (
    updater:
      | Partial<PaymentFilters>
      | ((prev: PaymentFilters) => PaymentFilters)
  ) => {
    setLocalFilters((prev) => {
      const next =
        typeof updater === "function"
          ? (updater as (prev: PaymentFilters) => PaymentFilters)(prev)
          : { ...prev, ...updater };
      setFilters(next);
      return next;
    });
  };

  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string }[] = [];
    if (localFilters.propertyId) {
      const p = uniqueProperties.find((x) => x.id === localFilters.propertyId);
      chips.push({
        key: "propertyId",
        label: p ? `Imóvel: ${p.title}` : "Imóvel selecionado",
      });
    }
    if (localFilters.tenantId) {
      const t = uniqueTenants.find((x) => x.id === localFilters.tenantId);
      chips.push({
        key: "tenantId",
        label: t ? `Inquilino: ${t.name}` : "Inquilino selecionado",
      });
    }
    if (localFilters.status) {
      chips.push({
        key: "status",
        label: `Status: ${
          statusMap[localFilters.status!]?.label ?? localFilters.status
        }`,
      });
    }
    if (localFilters.startDate)
      chips.push({ key: "startDate", label: `De: ${localFilters.startDate}` });
    if (localFilters.endDate)
      chips.push({ key: "endDate", label: `Até: ${localFilters.endDate}` });
    return chips;
  }, [localFilters, uniqueProperties, uniqueTenants]);

  const sorted = useMemo(() => {
    const list = Array.isArray(payments) ? [...payments] : [];
    const dir = sortDir === "asc" ? 1 : -1;

    const safeString = (v: string | undefined) =>
      v ? String(v).toLowerCase() : "";

    list.sort((a, b) => {
      switch (sortBy) {
        case "dueDate": {
          const da = a.dueDate ? Date.parse(String(a.dueDate)) : 0;
          const db = b.dueDate ? Date.parse(String(b.dueDate)) : 0;
          return (da - db) * dir;
        }
        case "amountDue": {
          const va = Number(a.amountDue ?? 0);
          const vb = Number(b.amountDue ?? 0);
          return (va - vb) * dir;
        }
        case "property": {
          return (
            safeString(a.contract?.property?.title).localeCompare(
              safeString(b.contract?.property?.title)
            ) * dir
          );
        }
        case "tenant": {
          return (
            safeString(a.contract?.tenant?.name).localeCompare(
              safeString(b.contract?.tenant?.name)
            ) * dir
          );
        }
        case "status": {
          const la = statusMap[a.status]?.label ?? a.status;
          const lb = statusMap[b.status]?.label ?? b.status;
          return safeString(la).localeCompare(safeString(lb)) * dir;
        }
        default:
          return 0;
      }
    });

    return list;
  }, [payments, sortBy, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (key === sortBy) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  const openUrl = (url: string) => {
    if (!url) return;
    if (onOpenUrl) {
      try {
        onOpenUrl(url);
        return;
      } catch {
        // fallback to window.open if onOpenUrl throws
      }
    }
    window.open(url, "_blank");
  };

  const handleGenerateSlip = async (paymentOrderId: string) => {
    setIsActionLoading(true);
    try {
      await ChargeService.generate(paymentOrderId);
      toast.success("Boleto gerado com sucesso!", {
        description: "A lista foi atualizada.",
      });
      // Prioriza a função onRefresh do pai, se existir
      if (onRefresh) {
        await onRefresh();
      } else {
        await fetchPayments(filters);
      }
    } catch (error: unknown) {
      const message = extractAxiosError(error);
      toast.error("Falha ao gerar boleto", { description: message });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRegisterPayment = async () => {
    if (!selectedPaymentId) return;

    setIsActionLoading(true);
    try {
      await PaymentService.confirmCashPayment(selectedPaymentId, {});
      toast.success("Pagamento registado com sucesso!");
      setShowRegisterPaymentModal(false);
      // Prioriza a função onRefresh do pai, se existir
      if (onRefresh) {
        await onRefresh();
      } else {
        await fetchPayments(filters);
      }
    } catch (_error) {
      const errorMessage = extractAxiosError(_error);
      toast.error("Não foi possivel registrar pagamento", {
        description: errorMessage,
      });
    } finally {
      setIsActionLoading(false);
      setSelectedPaymentId(null);
    }
  };

  const renderFilters = () => (
    <div className="bg-card p-4 rounded-xl shadow-xs border border-border mb-6">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-600" />
          <h3 className="font-semibold text-gray-700">Filtros</h3>
        </div>
      </div>

      {activeFilterChips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilterChips.map((chip) => (
            <button
              key={chip.key}
              onClick={() =>
                updateLocalAndApply((prev) => {
                  const copy = { ...prev };
                  if (chip.key in copy) {
                    delete copy[chip.key as keyof PaymentFilters];
                  }
                  return copy;
                })
              }
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border border-border bg-background"
              aria-label={`Remover filtro ${chip.label}`}
            >
              <span className="text-xs text-gray-700">{chip.label}</span>
              <XCircle size={14} className="text-gray-400" />
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CustomDropdownInput
          id="property-filter"
          icon={<Building2 size={18} />}
          placeholder="Todos os Imóveis"
          options={uniqueProperties.map((p) => ({
            id: p.id,
            value: p.id,
            label: p.title,
          }))}
          selectedOptionValue={localFilters.propertyId}
          onOptionSelected={(value) =>
            updateLocalAndApply({ propertyId: value || undefined })
          }
        />
        <CustomDropdownInput
          id="tenant-filter"
          icon={<User size={18} />}
          placeholder="Todos os Inquilinos"
          options={uniqueTenants.map((t) => ({
            id: t.id,
            value: t.id,
            label: t.name,
          }))}
          selectedOptionValue={localFilters.tenantId}
          onOptionSelected={(value) =>
            updateLocalAndApply({ tenantId: value || undefined })
          }
        />
        <CustomDropdownInput
          id="status-filter"
          icon={<FileText size={18} />}
          placeholder="Todos os Status"
          options={Object.entries(statusMap).map(([status, { label }]) => ({
            id: status,
            value: status,
            label,
          }))}
          selectedOptionValue={localFilters.status}
          onOptionSelected={(value) =>
            updateLocalAndApply({
              status: (value as PaymentStatus) || undefined,
            })
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <CustomInput
          id="startDate"
          label="Vencimento De"
          type="date"
          icon={<CalendarIcon size={20} />}
          value={localFilters.startDate || ""}
          placeholder="dd/mm/yyyy"
          onChange={(value) => updateLocalAndApply({ startDate: value })}
        />
        <CustomInput
          id="endDate"
          label="Vencimento Até"
          type="date"
          icon={<CalendarIcon size={20} />}
          value={localFilters.endDate || ""}
          placeholder="dd/mm/yyyy"
          onChange={(value) => updateLocalAndApply({ endDate: value })}
        />
      </div>
      <div className="flex flex-col sm:flex-row items-end gap-2 mt-4">
        <CustomButton
          onClick={() => fetchPayments(localFilters)}
          className="w-full sm:w-auto"
        >
          Aplicar Filtros
        </CustomButton>
        <CustomButton
          onClick={() => {
            setLocalFilters({});
            setFilters({});
            fetchPayments({});
          }}
          ghost
          className="w-full sm:w-auto"
        >
          Limpar
        </CustomButton>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  if (!loading && sorted.length === 0) {
    return (
      <div>
        {showFilters && renderFilters()}
        <EmptyCard
          icon={<FileText size={48} />}
          title="Nenhuma fatura encontrada"
          subtitle={
            showFilters
              ? "Tente ajustar os filtros ou verifique mais tarde."
              : "Não há faturas para este contrato ainda."
          }
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      {showFilters && renderFilters()}

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {sorted.map((payment) => (
          <div
            key={payment.id}
            className="bg-gradient-to-t from-card/40 to-card border border-border rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-800 truncate max-w-[200px]">
                  {payment.contract.property?.title}
                </p>
                <p className="text-xs text-gray-500">
                  {payment.contract.tenant?.name}
                </p>
              </div>

              <PaymentActionsDropdown
                payment={payment}
                loading={isActionLoading}
                onOpenUrl={openUrl}
                onGenerateSlip={handleGenerateSlip}
                onRegister={(id) => {
                  setSelectedPaymentId(id);
                  setShowRegisterPaymentModal(true);
                }}
              />
            </div>
            <div className="flex justify-between items-end mt-4">
              <div>
                <p className="text-xs text-gray-500">Vencimento</p>
                <p className="text-sm font-medium text-gray-700">
                  {formatDateForDisplay(payment.dueDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 text-right">Valor</p>
                <p className="text-lg font-bold text-gray-900 text-right">
                  R$ {formatDecimalValue(payment.amountDue)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium gap-1.5 border ${
                  statusMap[payment.status]?.color
                }`}
              >
                {statusMap[payment.status]?.icon}
                {statusMap[payment.status]?.label || payment.status}
              </span>
              <Link target="_blank" href={`/faturas/${payment.id}`}>
                <CustomButton
                  aria-label="Abrir página da fatura"
                  title="Abrir página da fatura"
                  ghost
                  className="text-sm h-9 "
                  icon={<SquareArrowOutUpRight className="" size={16} />}
                >
                  Ver fatura
                </CustomButton>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto border border-border rounded-lg ">
        <table className="min-w-full ">
          <thead className="border-b border-border bg-gradient-to-t from-card/40 to-card">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort("property")}
                aria-sort={
                  sortBy === "property"
                    ? sortDir === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                Imóvel <ArrowUpDown size={14} className="inline-block ml-2" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort("dueDate")}
                aria-sort={
                  sortBy === "dueDate"
                    ? sortDir === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                Vencimento{" "}
                <ArrowUpDown size={14} className="inline-block ml-2" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort("amountDue")}
                aria-sort={
                  sortBy === "amountDue"
                    ? sortDir === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                Valor <ArrowUpDown size={14} className="inline-block ml-2" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort("status")}
                aria-sort={
                  sortBy === "status"
                    ? sortDir === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                Status <ArrowUpDown size={14} className="inline-block ml-2" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort("tenant")}
                aria-sort={
                  sortBy === "tenant"
                    ? sortDir === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                Pagador <ArrowUpDown size={14} className="inline-block ml-2" />
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-28"
              >
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="bg-card divide-y divide-border">
            {sorted.map((payment) => {
              return (
                <tr key={payment.id}>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 max-w-xs truncate">
                    {payment.contract.property?.title || "Sem título"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDateForDisplay(payment.dueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    R$ {formatDecimalValue(payment.amountDue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium gap-1.5 border border-border ${
                        statusMap[payment.status]?.color
                      }`}
                    >
                      {statusMap[payment.status]?.icon}
                      {statusMap[payment.status]?.label || payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {payment.contract.tenant?.name || "N/A"}
                  </td>

                  <td className="px-6 py-4 items-center flex justify-center whitespace-nowrap text-right text-sm font-medium gap-2">
                    <Link target="_blank" href={`/faturas/${payment.id}`}>
                      <CustomButton
                        aria-label="Abrir página da fatura"
                        title="Abrir página da fatura"
                        ghost
                        className="h-9 w-9 p-2"
                        icon={<SquareArrowOutUpRight className="" size={16} />}
                      />
                    </Link>
                    <PaymentActionsDropdown
                      payment={payment}
                      loading={isActionLoading}
                      onOpenUrl={openUrl}
                      onGenerateSlip={handleGenerateSlip}
                      onRegister={(id) => {
                        setSelectedPaymentId(id);
                        setShowRegisterPaymentModal(true);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <RegisterPaymentModal
        isOpen={showRegisterPaymentModal}
        onClose={() => {
          setShowRegisterPaymentModal(false);
          setSelectedPaymentId(null);
        }}
        onConfirm={handleRegisterPayment}
        isLoading={isActionLoading}
      />
    </div>
  );
}
