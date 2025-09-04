"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { useCurrentUser } from "../../hooks/useCurrentUser";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { loading, role, sub, status } = useCurrentUser();
  // console.log(loading, role, sub, status);
  useEffect(() => {
    if (!loading) {
      if (!role || !sub || !status) {
        router.push("/entrar");
      }
    }
  }, [loading, role, sub, status, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-svh w-screen">
        <Loader2Icon className="animate-spin w-12 h-12 text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
