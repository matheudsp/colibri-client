"use client";

import React, { useState, useRef, useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { Bell } from "lucide-react";
import clsx from "clsx";
import { NotificationList } from "./NotificationList";

export const NotificationBell = ({ collapsed }: { collapsed: boolean }) => {
  const { unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Notificações"
        className={clsx(
          "flex items-center transition-all duration-200 ease-in-out rounded-lg w-full p-2 cursor-pointer",
          "text-slate-800/90 hover:bg-gray-400/40 hover:scale-105",
          collapsed ? "justify-center px-0 py-2" : "justify-start px-3 py-2"
        )}
      >
        <div className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>

        {!collapsed && (
          <span className="ml-2 text-sm font-normal tracking-wide truncate">
            Notificações
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={clsx(
            "absolute bottom-full mb-2 w-80",
            collapsed ? "left-full ml-2" : "left-0"
          )}
        >
          <NotificationList maxNotifications={3} />
        </div>
      )}
    </div>
  );
};
