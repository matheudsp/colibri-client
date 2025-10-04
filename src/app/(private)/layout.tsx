"use client";

import { AuthGuard } from "@/components/layout/AuthGuard";
import { NotificationsProvider } from "@/contexts/NotificationContext";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard redirectToIfUnauthenticated="/entrar">
      <NotificationsProvider>{children}</NotificationsProvider>
    </AuthGuard>
  );
}
