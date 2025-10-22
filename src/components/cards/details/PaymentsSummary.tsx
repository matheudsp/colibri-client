import { formatCurrency } from "@/utils/formatters/formatCurrency";

interface PaymentsSummaryProps {
  data: {
    period: string;
    received: number;
    pending: number;
  };
}

export function PaymentsSummary({ data }: PaymentsSummaryProps) {
  return (
    <div className="rounded-lg border border-border p-6 bg-card">
      <h3 className="text-lg font-medium leading-6 text-foreground">
        Resumo de Pagamentos
        <strong className="text-base font-extralight text-muted-foreground">
          ({data.period})
        </strong>
      </h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="overflow-hidden rounded-lg border border-primary bg-primary-light px-4 py-5 sm:p-6">
          <dt className="truncate text-sm font-medium text-foreground">
            Recebido
          </dt>

          <dd className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
            {formatCurrency(data.received)}
          </dd>
        </div>

        <div className="overflow-hidden rounded-lg border border-accent bg-accent/10 px-4 py-5 sm:p-6">
          <dt className="truncate text-sm font-medium text-accent">
            A receber
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-accent">
            {formatCurrency(data.pending)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
