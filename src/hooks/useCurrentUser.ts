"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { AuthService } from "@/services/domains/authService";

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
      fetchUser();
    }
  }, [loading, setUser, setLoading]);

  return {
    loading,
    isAuthenticated: !!user,
    role: user?.role,
    sub: user?.id,
    status: user?.status,
    user,
  };
}
