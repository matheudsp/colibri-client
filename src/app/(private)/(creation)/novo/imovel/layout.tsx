"use client";

import { Header } from "@/components/layout/Header";
import { Roles } from "@/constants";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

export default function CreationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { loading, role } = useCurrentUser();
  const [isChecking, setIsChecking] = useState(true);

  const handleBack = () => {
    router.push("/imoveis");
  };
  useEffect(() => {
    if (!loading) {
      if (role === Roles.LOCATARIO || !role) {
        router.push("/imoveis");
      }
      setIsChecking(false);
    }
  }, [loading, role, router]);

  if (loading || isChecking) {
    return (
      <div className="flex justify-center items-center h-svh w-screen">
        <Loader2Icon className="animate-spin w-12 h-12 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-svh w-full bg-background">
      <Header type="back" onBack={handleBack} />
      <main className="w-full">{children}</main>
    </div>
  );
}
