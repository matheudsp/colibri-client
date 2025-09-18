export function ChartSkeleton() {
  return (
    <div className="rounded-lg border p-6 shadow">
      {/* Skeleton for the chart title */}
      <div className="mb-4 h-6 w-1/2 animate-pulse rounded-lg bg-gray-200" />
      {/* Skeleton for the chart area */}
      <div className="h-[300px] w-full animate-pulse rounded-lg bg-gray-200" />
    </div>
  );
}
