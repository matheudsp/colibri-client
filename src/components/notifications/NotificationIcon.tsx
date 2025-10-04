"use client";

import { useNotifications } from "@/contexts/NotificationContext";
import { Bell } from "lucide-react";
import React from "react";

export const NotificationIcon = () => {
  const { unreadCount } = useNotifications();

  return (
    <div className="relative">
      <Bell className="w-5 h-5" strokeWidth={1.5} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </div>
  );
};
