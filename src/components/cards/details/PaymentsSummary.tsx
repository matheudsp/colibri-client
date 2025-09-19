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
    <div className="rounded-lg border p-6 shadow-sm">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Resumo de Pagamentos{" "}
        <strong className="text-base font-extralight text-zinc-700/90">
          ({data.period})
        </strong>
      </h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="overflow-hidden rounded-lg border border-green-400 bg-green-200 px-4 py-5 sm:p-6">
          <dt className="truncate text-sm font-medium text-green-700">
            Recebido
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-900">
            {formatCurrency(data.received)}
          </dd>
        </div>

        <div className="overflow-hidden rounded-lg border border-yellow-400 bg-yellow-200 px-4 py-5 sm:p-6">
          <dt className="truncate text-sm font-medium text-yellow-700">
            A receber
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-yellow-900">
            {formatCurrency(data.pending)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
