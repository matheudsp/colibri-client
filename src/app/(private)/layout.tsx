"use client";

import { AuthGuard } from "@/components/layout/AuthGuard";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard redirectToIfUnauthenticated="/entrar">{children}</AuthGuard>
  );
}
