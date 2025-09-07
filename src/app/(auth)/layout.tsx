"use client";

import { Header } from "../../components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthGuard } from "@/components/layout/AuthGuard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard redirectToIfAuthenticated="/imoveis">
      <div className="min-h-svh">
        <Header type={"default"} isScrolled={true} />
        <main className="w-full">{children}</main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
