"use client";

import { Header } from "../../components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh">
      <Header type={"default"} isScrolled={true} />
      <main className="w-full">{children}</main>
      <Footer />
    </div>
  );
}
