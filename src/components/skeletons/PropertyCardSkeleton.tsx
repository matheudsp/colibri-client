// src/components/skeletons/PropertyCardSkeleton.tsx

interface PropertyCardSkeletonProps {
  variant?: "dashboard" | "public";
}

export function PropertyCardSkeleton({
  variant = "dashboard",
}: PropertyCardSkeletonProps) {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg flex flex-col h-full animate-pulse">
      {/* Skeleton da Imagem */}
      <div className="w-full aspect-[4/3] bg-gray-300"></div>

      {/* Skeleton do Conteúdo */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Titulo e Endereço */}
        <div>
          {variant === "public" && (
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
          )}
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>

        <div className="flex-grow">
          {/* --- Renderização Condicional do Skeleton --- */}
          {variant === "public" ? (
            // Skeleton para a Vista Pública
            <div className="mt-auto">
              <div className="flex items-center space-x-4 mt-3 border-b pb-3">
                <div className="h-4 bg-gray-300 rounded w-12"></div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <div className="h-4 bg-gray-300 rounded w-1/5"></div>
                <div className="h-6 bg-gray-300 rounded w-1/3"></div>
              </div>
            </div>
          ) : (
            // Skeleton para a Vista do Dashboard
            <div className="mt-auto pt-4 border-t mt-4 space-y-2">
              <div className="h-10 bg-gray-300 rounded w-full"></div>
              <div className="h-10 bg-gray-300 rounded w-full"></div>
              <div className="h-10 bg-gray-300 rounded w-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
