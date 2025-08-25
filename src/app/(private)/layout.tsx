"use client";

import { useEffect, useState } from "react";
import { useUserRole } from "../../hooks/useUserRole";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { loading, role, sub } = useUserRole();
  const [isChecking, setIsChecking] = useState(true);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       await AuthService.getMe();
  //       router.push("/properties");
  //     } catch (_error) {
  //       const errorMessage = extractAxiosError(_error);
  //       toast.error("Usuário não autenticado", {
  //         description: errorMessage,
  //       });
  //       router.push("/login");
  //     }
  //   };

  //   checkAuth();
  // }, [router]);

  useEffect(() => {
    if (!loading) {
      if (!role || !sub) {
        router.push("/login");
      } else {
        router.push("/properties");
      }

      setIsChecking(false);
    }
  }, [loading, role, router, sub]);

  if (loading || isChecking) {
    return (
      <div className="flex justify-center items-center h-svh w-screen">
        <Loader2Icon className="animate-spin w-12 h-12 text-primary" />
      </div>
    );
  }

  return children;
}
