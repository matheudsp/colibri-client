"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface AuthGuardProps {
  children: React.ReactNode;
  /** Para onde redirecionar se o usuário NÃO estiver autenticado. (Usado em rotas privadas) */
  redirectToIfUnauthenticated?: string;
  /** Para onde redirecionar se o usuário JÁ ESTIVER autenticado. (Usado em rotas de login/registro) */
  redirectToIfAuthenticated?: string;
}

export function AuthGuard({
  children,
  redirectToIfAuthenticated,
  redirectToIfUnauthenticated,
}: AuthGuardProps) {
  const router = useRouter();
  const { loading, isAuthenticated } = useCurrentUser();

  useEffect(() => {
    if (loading) {
      return; // Aguarda a verificação terminar
    }

    // Regra para rotas de autenticação (ex: /entrar)
    if (redirectToIfAuthenticated && isAuthenticated) {
      router.push(redirectToIfAuthenticated);
    }

    // Regra para rotas privadas (ex: /imoveis)
    if (redirectToIfUnauthenticated && !isAuthenticated) {
      router.push(redirectToIfUnauthenticated);
    }
  }, [
    loading,
    isAuthenticated,
    router,
    redirectToIfAuthenticated,
    redirectToIfUnauthenticated,
  ]);

  // Exibe a tela de carregamento enquanto a verificação está em andamento
  // ou se uma regra de redirecionamento está prestes a ser aplicada.
  if (
    loading ||
    (redirectToIfAuthenticated && isAuthenticated) ||
    (redirectToIfUnauthenticated && !isAuthenticated)
  ) {
    return (
      <div className="flex justify-center items-center h-svh w-screen bg-background">
        <Loader2Icon className="animate-spin w-12 h-12 text-primary" />
      </div>
    );
  }

  // Se nenhuma regra de redirecionamento for aplicada, exibe o conteúdo da página.
  return <>{children}</>;
}
