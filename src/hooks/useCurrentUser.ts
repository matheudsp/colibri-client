"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { AuthService } from "@/services/domains/authService";
import { socketService } from "@/services/domains/socketService";

const hasSessionCookie = (): boolean => {
  return document.cookie.includes("session-status=active");
};

export function useCurrentUser() {
  const { user, loading, setUser, setLoading } = useUserStore();

  useEffect(() => {
    async function fetchUser() {
      try {
        const me = await AuthService.getMe();
        setUser(me.data);
        socketService.connect();
      } catch {
        setUser(null);
        socketService.disconnect();
      } finally {
        setLoading(false);
      }
    }

    if (loading) {
      if (hasSessionCookie()) {
        fetchUser();
      } else {
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
