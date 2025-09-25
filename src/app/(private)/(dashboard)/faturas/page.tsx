"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { PaymentResponse } from "@/interfaces/payment";
import { PaymentStatus } from "@/constants";
import {
  PaymentService,
  PaymentFilters,
} from "@/services/domains/paymentService";
import { BankSlipService } from "@/services/domains/bankSlipService";
import {
  Loader2,
  FileText,
  Filter,
  Eye,
  DownloadCloud,
  XCircle,
  Calendar as CalendarIcon,
  CalendarArrowDown,
  User,
  Building2,
} from "lucide-react";
import { CustomButton } from "@/components/forms/CustomButton";
import { formatDateForDisplay } from "@/utils/formatters/formatDate";
import { formatDecimalValue } from "@/utils/formatters/formatDecimal";
import { extractAxiosError } from "@/services/api";
import { EmptyCard } from "@/components/common/EmptyCard";
import { CustomInput } from "@/components/forms/CustomInput";
import PageHeader from "@/components/common/PageHeader";
import { PaymentCard, statusMap } from "@/components/cards/PaymentCard";
import { CustomDropdownInput } from "@/components/forms/CustomDropdownInput";

export default function MyPaymentsPage() {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingSlipId, setGeneratingSlipId] = useState<string | null>(null);

  const [filters, setFilters] = useState<PaymentFilters>({});
  const [localFilters, setLocalFilters] = useState<PaymentFilters>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

  useEffect(() => {
    fetchPayments(filters);
  }, [filters]);

  const handleGenerateSlip = async (paymentOrderId: string) => {
    setGeneratingSlipId(paymentOrderId);
    try {
      await BankSlipService.generate(paymentOrderId);
      toast.success("Boleto gerado com sucesso!", {
        description: "A sua lista de faturas foi atualizada.",
      });
      await fetchPayments(filters);
    } catch (error: unknown) {
      const errorMessage = extractAxiosError(error);
      toast.error("Falha ao gerar boleto", {
        description: errorMessage,
      });
    } finally {
      setGeneratingSlipId(null);
    }
  };

  const uniqueProperties = useMemo(() => {
    const propertyMap = new Map<string, { id: string; title: string }>();
    payments.forEach((p) => {
      if (p.contract.property?.id && p.contract.property?.title) {
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
      if (p.contract.tenant?.id && p.contract.tenant?.name) {
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
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      const next =
        typeof updater === "function"
          ? (updater as any)(prev)
          : { ...prev, ...(updater as any) };
      setFilters(next);
      return next;
    });
  };

  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string }[] = [];
    if (localFilters.propertyId) {
      const p = uniqueProperties.find(
        (x: { id: string; title: string }) => x.id === localFilters.propertyId
      );
      chips.push({
        key: "propertyId",
        label: p ? `Imóvel: ${p.title}` : "Imóvel selecionado",
      });
    }
    if (localFilters.tenantId) {
      const t = uniqueTenants.find(
        (x: { id: string; name: string }) => x.id === localFilters.tenantId
      );
      chips.push({
        key: "tenantId",
        label: t ? `Inquilino: ${t.name}` : "Inquilino selecionado",
      });
    }
    if (localFilters.status) {
      chips.push({
        key: "status",
        label: `Status: ${
          statusMap[localFilters.status]?.label ?? localFilters.status
        }`,
      });
    }
    if (localFilters.startDate)
      chips.push({ key: "startDate", label: `De: ${localFilters.startDate}` });
    if (localFilters.endDate)
      chips.push({ key: "endDate", label: `Até: ${localFilters.endDate}` });
    return chips;
  }, [localFilters, uniqueProperties, uniqueTenants]);

  return (
    <div className="min-h-svh flex flex-col items-center pt-8 md:pt-14 px-4 pb-24 ">
      <div className="w-full max-w-7xl mx-auto">
        <PageHeader
          className="mb-8"
          title="Minhas Faturas"
          subtitle="Consulte o seu histórico de faturas e acompanhe seus boletos."
          icon={CalendarArrowDown}
        />
        <div className="bg-background p-4 rounded-xl shadow-xs border border-border mb-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-600" />
              <h3 className="font-semibold text-gray-700">Filtros</h3>
            </div>

            <div className="md:hidden">
              <button
                aria-label="Abrir filtros"
                onClick={() => setShowMobileFilters(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-background"
              >
                <Filter size={16} />
                Filtrar
              </button>
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

          <div className="hidden md:block">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                options={Object.entries(statusMap).map(
                  ([status, { label }]) => ({
                    id: status,
                    value: status,
                    label,
                  })
                )}
                selectedOptionValue={localFilters.status}
                onOptionSelected={(value) =>
                  updateLocalAndApply({
                    status: (value as PaymentStatus) || undefined,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
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

              <div className="flex items-end gap-2 col-span-1 sm:col-span-2 lg:col-span-2">
                {/* Mantive os botões de desktop—mas as mudanças já aplicam imediatamente */}
                <CustomButton
                  onClick={() => setFilters(localFilters)}
                  className="w-full"
                >
                  Aplicar Filtros
                </CustomButton>
                <CustomButton
                  onClick={() => {
                    setLocalFilters({});
                    setFilters({});
                  }}
                  ghost
                  className="w-full"
                >
                  Limpar
                </CustomButton>
              </div>
            </div>
          </div>

          {/* Mobile: resumo rápido */}
          <div className="md:hidden mt-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-600">
                {activeFilterChips.length > 0
                  ? `${activeFilterChips.length} filtro(s) ativo(s)`
                  : "Nenhum filtro ativo"}
              </span>
              <button
                onClick={() => setShowMobileFilters(true)}
                className="text-sm font-medium underline"
                aria-label="Abrir painel de filtros"
              >
                Editar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Mobile bottom-sheet (slide-up) */}
        {showMobileFilters && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-end md:hidden"
            onClick={() => setShowMobileFilters(false)}
          >
            {/* backdrop */}
            <div className="absolute inset-0 bg-black/40" />

            {/* panel */}
            <div
              className="relative w-full bg-background rounded-t-xl p-4 max-h-[85vh] overflow-auto  transition-transform translate-y-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-lg">Filtros</h4>
                <button
                  aria-label="Fechar filtros"
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <CustomDropdownInput
                  id="m-property-filter"
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
                  id="m-tenant-filter"
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
                  id="m-status-filter"
                  icon={<FileText size={18} />}
                  placeholder="Todos os Status"
                  options={Object.entries(statusMap).map(
                    ([status, { label }]) => ({
                      id: status,
                      value: status,
                      label,
                    })
                  )}
                  selectedOptionValue={localFilters.status}
                  onOptionSelected={(value) =>
                    updateLocalAndApply({
                      status: (value as PaymentStatus) || undefined,
                    })
                  }
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CustomInput
                    id="m-startDate"
                    label="Vencimento De"
                    type="date"
                    icon={<CalendarIcon size={20} />}
                    value={localFilters.startDate || ""}
                    placeholder="dd/mm/yyyy"
                    onChange={(value) =>
                      updateLocalAndApply({ startDate: value })
                    }
                  />
                  <CustomInput
                    id="m-endDate"
                    label="Vencimento Até"
                    type="date"
                    icon={<CalendarIcon size={20} />}
                    value={localFilters.endDate || ""}
                    placeholder="dd/mm/yyyy"
                    onChange={(value) =>
                      updateLocalAndApply({ endDate: value })
                    }
                  />
                </div>

                <div className="mt-2 flex gap-3">
                  <CustomButton
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1"
                  >
                    Fechar
                  </CustomButton>
                  <CustomButton
                    onClick={() => {
                      setLocalFilters({});
                      setFilters({});
                      setShowMobileFilters(false);
                    }}
                    ghost
                    className="flex-1"
                  >
                    Limpar
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="w-full grid gap-4 pb-10">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : payments.length === 0 ? (
            <EmptyCard
              icon={<FileText size={48} />}
              title="Nenhuma fatura encontrada"
              subtitle="Tente ajustar os filtros ou verifique mais tarde."
            />
          ) : (
            <>
              {/* */}
              <div className="overflow-x-auto border border-border rounded-lg hidden md:block">
                <table className="min-w-full ">
                  <thead className="border-b border-border bg-background">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-wrap"
                      >
                        Imóvel
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Vencimento
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Valor
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Pagador
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {payments.map((payment) => {
                      const isPaid = new Set([
                        "PAGO",
                        "RECEBIDO",
                        "EM_REPASSE",
                        "CONFIRMADO",
                      ]).has(payment.status);
                      const isPayable = new Set([
                        "PENDENTE",
                        "ATRASADO",
                        "FALHOU",
                      ]).has(payment.status);

                      return (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
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
                              {statusMap[payment.status]?.label ||
                                payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {payment.contract.tenant?.name || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              {isPaid &&
                              payment.bankSlip?.transactionReceiptUrl ? (
                                <CustomButton
                                  onClick={() =>
                                    window.open(
                                      payment.bankSlip.transactionReceiptUrl,
                                      "_blank"
                                    )
                                  }
                                  color="bg-blue-100"
                                  textColor="text-blue-800"
                                >
                                  <Eye size={16} className="mr-1" /> Visualizar
                                  Comprovante
                                </CustomButton>
                              ) : payment.bankSlip ? (
                                <CustomButton
                                  onClick={() =>
                                    window.open(
                                      payment.bankSlip.bankSlipUrl,
                                      "_blank"
                                    )
                                  }
                                  color="bg-gray-200"
                                  textColor="text-black"
                                >
                                  <Eye size={16} className="mr-1" /> Visualizar
                                  Boleto
                                </CustomButton>
                              ) : isPayable ? (
                                <CustomButton
                                  onClick={() => handleGenerateSlip(payment.id)}
                                  color="bg-orange-500"
                                  textColor="text-white"
                                  disabled={generatingSlipId === payment.id}
                                >
                                  {generatingSlipId === payment.id ? (
                                    <Loader2
                                      className="animate-spin"
                                      size={16}
                                    />
                                  ) : (
                                    <DownloadCloud size={16} className="mr-1" />
                                  )}
                                  Gerar Boleto
                                </CustomButton>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden">
                {payments.map((payment) => (
                  <PaymentCard
                    key={payment.id}
                    payment={payment}
                    generatingSlipId={generatingSlipId}
                    handleGenerateSlip={handleGenerateSlip}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
