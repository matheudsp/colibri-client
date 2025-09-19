export function PaymentsSummarySkeleton() {
  return (
    <div className="rounded-lg border p-6 shadow-sm">
      {/* Skeleton for the title */}
      <div className="mb-5 h-7 w-3/4 animate-pulse rounded-lg bg-gray-200" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Skeletons for the summary boxes */}
        <div className="h-24 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-24 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}
