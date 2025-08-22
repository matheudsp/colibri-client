"use client";

import { useState, useEffect } from "react";
import { AuthService } from "../services/domains/authService";

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [sub, setSub] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = await AuthService.getMe();
        setRole(user.data.role);
        setSub(user.data.id);
        setName(user.data.name);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setRole(null);
        setName(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  return {
    sub,
    role,
    name,
    loading,
  };
}
