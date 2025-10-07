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
    <div className="rounded-lg border border-border p-6 ">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Resumo de Pagamentos{" "}
        <strong className="text-base font-extralight text-zinc-700/90">
          ({data.period})
        </strong>
      </h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="overflow-hidden rounded-lg border border-primary bg-primary-light px-4 py-5 sm:p-6">
          <dt className="truncate text-sm font-medium text-shadow-primary-hover">
            Recebido
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-shadow-primary-hover">
            {formatCurrency(data.received)}
          </dd>
        </div>

        <div className="overflow-hidden rounded-lg border border-sky-400 bg-sky-200 px-4 py-5 sm:p-6">
          <dt className="truncate text-sm font-medium text-sky-950">
            A receber
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-sky-950">
            {formatCurrency(data.pending)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
