"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Os dados serão considerados "frescos" por 5 minutos
            // e não serão buscados novamente nesse período.
            staleTime: 1000 * 60 * 5, // 5 minutos

            // Desativa a busca automática de dados quando o usuário
            // volta para a aba do navegador.
            refetchOnWindowFocus: false,

            // Tenta novamente a busca 2 vezes em caso de falha.
            retry: 2,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
