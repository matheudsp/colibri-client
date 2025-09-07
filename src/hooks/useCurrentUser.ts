"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { AuthService } from "@/services/domains/authService";

/**
 * Verifica a existência do cookie de status de sessão não-httpOnly.
 */
const hasSessionCookie = (): boolean => {
  // Usa a API padrão do navegador para ler os cookies
  return document.cookie.includes("session-status=active");
};

export function useCurrentUser() {
  const { user, loading, setUser, setLoading } = useUserStore();

  useEffect(() => {
    async function fetchUser() {
      try {
        const me = await AuthService.getMe();
        setUser(me.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    if (loading) {
      if (hasSessionCookie()) {
        // Só faz a chamada à API se o cookie de sessão existir.
        fetchUser();
      } else {
        // Se o cookie não existe, sabemos que não há sessão.
        // Não fazemos chamada à API e encerramos o carregamento.
        setUser(null);
        setLoading(false);
      }
    }
  }, [loading, setUser, setLoading]);

  return {
    loading,
    isAuthenticated: !!user,
    role: user?.role,
    sub: user?.id,
    status: user?.status,
    emailVerified: user?.emailVerified,
    user,
  };
}
