"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "../services/domains/authService";
import { Loader2Icon } from "lucide-react";
import { extractAxiosError } from "@/services/api";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await AuthService.getMe();
        router.push("/properties");
      } catch (_error) {
        const errorMessage = extractAxiosError(_error);
        toast.error("Usuário não autenticado", {
          description: errorMessage,
        });
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-svh w-screen">
      <Loader2Icon className="animate-spin w-12 h-12 text-primary" />
    </div>
  );
}
