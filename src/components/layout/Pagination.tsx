"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  maxVisiblePages?: number;
  total?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  maxVisiblePages = 5,
  total,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-6">
      {typeof total === "number" && (
        <div className="text-sm text-foreground">
          <span className="font-semibold">{total}</span> itens encontrados.{" "}
        </div>
      )}
      <div className="flex items-center justify-center gap-2">
        <button
          title="Página anterior"
          className={`flex items-center justify-center p-2 h-9 w-9 rounded-md border border-border text-foreground ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-muted"
          }`}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {startPage > 1 && (
          <>
            <button
              title={`Ir para página 1`}
              className={`flex items-center justify-center p-2 h-9 w-9 rounded-md border border-border text-foreground ${
                currentPage === 1
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-2 text-muted-foreground">...</span>
            )}
          </>
        )}
        {pages.map((page) => (
          <button
            key={page}
            title={`Ir para página ${page}`}
            className={`flex items-center justify-center p-2 h-9 w-9 rounded-md border border-border text-foreground ${
              currentPage === page
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 text-muted-foreground">...</span>
            )}

            <button
              title={`Ir para página ${totalPages} (última página)`}
              className={`flex items-center justify-center p-2 h-9 w-9 rounded-md border border-border text-foreground ${
                currentPage === totalPages
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          title="Próxima página"
          className={`flex items-center justify-center p-2 h-9 w-9 rounded-md border border-border text-foreground ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-muted"
          }`}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
