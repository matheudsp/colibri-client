export function ContractCardSkeleton() {
  return (
    <div className="bg-background rounded-2xl border border-border overflow-hidden animate-pulse">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-16 h-16 rounded-lg bg-zinc-200 shrink-0"></div>
            <div className="w-40 space-y-2">
              <div className="h-4 bg-zinc-300 rounded"></div>
              <div className="h-3 bg-zinc-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="h-6 w-28 bg-zinc-200 rounded-full mt-2 sm:mt-0 self-start sm:self-center"></div>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-16 bg-zinc-200 rounded"></div>
              <div className="h-4 w-24 bg-zinc-300 rounded"></div>
            </div>
          ))}
        </div>

        <div className="mt-4 h-16 bg-zinc-100 rounded-lg"></div>
      </div>

      <footer className="px-4 py-3 bg-zinc-50 border-t border-border flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-3 w-20 bg-zinc-200 rounded"></div>
          <div className="h-5 w-24 bg-zinc-300 rounded"></div>
        </div>
        <div className="h-4 w-28 bg-zinc-200 rounded"></div>
      </footer>
    </div>
  );
}
