"use client";

import { SearchBar } from "@/components/forms/SearchBar";

export default function Home() {
  return (
    <div>
      <section className="min-h-screen bg-secondary flex flex-col items-center justify-center p-4 text-center text-white">
        <div className="w-full flex flex-col items-center justify-center">
          <div className="max-w-5xl">
            <h1 className="text-4xl md:text-6xl font-bold">
              Para{" "}
              <span className="bg-primary text-secondary px-2 rounded">
                você
              </span>{" "}
              morar bem
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-200">
              Busque seu imóvel na Colibri.
            </p>
          </div>

          <div className="mt-12 w-full px-4 flex items-center justify-center">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="h-screen bg-white p-8">
        <h2 className="text-3xl font-bold text-center">Sobre Nós</h2>
        <p className="mt-4 text-center max-w-2xl mx-auto">
          Conteúdo sobre a sua imobiliária, serviços e diferenciais.
        </p>
      </section>
    </div>
  );
}
