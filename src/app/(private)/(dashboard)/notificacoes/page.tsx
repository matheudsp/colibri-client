"use client";

import { NotificationList } from "@/components/notifications/NotificationList";
import PageHeader from "@/components/common/PageHeader";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="max-h-screen flex flex-col items-center pt-8 md:pt-14  md:px-4">
      <div className="w-full max-w-7xl mx-auto">
        <PageHeader
          icon={Bell}
          title="Notificações"
          subtitle="Veja aqui as últimas atualizações sobre seus imóveis e contratos."
          className="md:mb-8 px-4 md:px-0"
        />

        <NotificationList scrollable showTitle={false} />
      </div>
    </div>
  );
}
