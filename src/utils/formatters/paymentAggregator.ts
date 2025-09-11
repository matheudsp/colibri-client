import { PaymentResponse } from "@/interfaces/payment";
import { PaymentStatus } from "@/constants";

// Helper para converter string monetária para número
function parseCurrency(s: string | null): number {
  if (!s) return 0;
  // Remove símbolos e espaços, lida com "1.234,56" e "1234.56"
  const cleaned = s
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  return Number.parseFloat(cleaned) || 0;
}

// Função principal para agregar os dados por imóvel
export function aggregateByProperty(payments: PaymentResponse[]) {
  const map = new Map<
    string,
    {
      propertyId: string;
      title: string;
      totals: { paid: number; pending: number; overdue: number };
      tenants: Set<string>;
      items: PaymentResponse[];
    }
  >();

  for (const p of payments) {
    const propId = p.contract.property.id;
    const title = p.contract.property.title || "Sem título";

    if (!map.has(propId)) {
      map.set(propId, {
        propertyId: propId,
        title,
        totals: { paid: 0, pending: 0, overdue: 0 },
        tenants: new Set(),
        items: [],
      });
    }

    const entry = map.get(propId)!;
    entry.items.push(p);
    if (p.contract.tenant?.name) entry.tenants.add(p.contract.tenant.name);

    const amountDue = parseCurrency(p.amountDue);

    // Mapeia os status do seu projeto para os buckets do gráfico
    switch (p.status) {
      case PaymentStatus.PAGO:
      case PaymentStatus.CONFIRMADO:
        entry.totals.paid += amountDue;
        break;
      case PaymentStatus.ATRASADO:
        entry.totals.overdue += amountDue;
        break;
      case PaymentStatus.PENDENTE:
        entry.totals.pending += amountDue;
        break;
    }
  }

  // Transforma o Map em um array e ordena pelo total de valores (descendente)
  const result = Array.from(map.values()).map((r) => ({
    propertyId: r.propertyId,
    title: r.title,
    paid: r.totals.paid,
    pending: r.totals.pending,
    overdue: r.totals.overdue,
    tenants: Array.from(r.tenants),
    items: r.items,
  }));

  result.sort(
    (a, b) => b.paid + b.pending + b.overdue - (a.paid + a.pending + a.overdue)
  );

  return result;
}
