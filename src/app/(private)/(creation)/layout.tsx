"use client";

import { Roles } from "@/constants";
import { Header } from "../../../components/layout/Header";
import { useUserRole } from "../../../hooks/useUserRole";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

export default function CreationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { loading, role } = useUserRole();
  const [isChecking, setIsChecking] = useState(true);

  const handleBack = () => {
    router.push("/properties");
  };
  useEffect(() => {
    if (!loading) {
      if (role === Roles.LOCATARIO || !role) {
        router.push("/properties");
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
