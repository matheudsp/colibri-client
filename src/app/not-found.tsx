"use client";

import { useRouter } from "next/navigation";
import { SearchX } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col text-center bg-background p-4">
      <SearchX className="w-16 h-16 text-primary mb-6" />
      <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
        Página Não Encontrada
      </h1>
      <p className="text-lg text-foreground/80 max-w-md">
        Desculpe, a página que você está procurando não existe ou foi movida.
      </p>
      <button
        onClick={() => router.back()}
        className="mt-8 px-6 py-3 bg-primary text-secondary font-bold rounded-lg hover:bg-primary-hover transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        Voltar para a página anterior
      </button>
    </div>
  );
}
