// components/skeletons/PropertyCardSkeleton.tsx

export function PropertyCardSkeleton() {
  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row animate-fadeIn">
      {/* Skeleton da Imagem */}
      <div className="w-full md:w-2/5 h-56 md:h-auto bg-gray-300"></div>

      {/* Skeleton do Conteúdo */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Título */}
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
          {/* Endereço */}
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
          {/* Descrição */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-gray-200">
          {/* Skeleton dos Atributos (área, quartos, etc.) */}
          <div className="grid grid-cols-4 gap-4">
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>

          {/* Skeleton dos Botões */}
          <div className="mt-5 pt-5 border-t border-gray-200 space-y-3">
            <div className="h-12 bg-gray-300 rounded w-full"></div>
            <div className="grid grid-cols-1 gap-3">
              <div className="h-10 bg-gray-300 rounded w-full"></div>
              <div className="h-10 bg-gray-300 rounded w-full"></div>
              <div className="h-10 bg-gray-300 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
