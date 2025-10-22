"use client";

import React from "react";
import {
  useNotifications,
  type Notification,
} from "@/contexts/NotificationContext";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import clsx from "clsx";
import { CustomButton } from "../forms/CustomButton";
import Link from "next/link";

interface NotificationListProps {
  maxNotifications?: number;
  scrollable?: boolean;
  showTitle?: boolean;
}

export const NotificationList = ({
  maxNotifications,
  scrollable = false,
  showTitle = true,
}: NotificationListProps) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const router = useRouter();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const displayedNotifications = maxNotifications
    ? notifications.slice(0, maxNotifications)
    : notifications;

  return (
    <div
      className={`w-full bg-card  overflow-hidden md:rounded-lg md:border md:border-border md:shadow-lg`}
    >
      <div
        className={`flex items-center  p-3 border-b border-border gap-14 ${
          !showTitle ? "justify-end" : "justify-between"
        }`}
      >
        {showTitle && <h3 className="font-semibold text-sm">Notificações</h3>}
        <CustomButton
          onClick={markAllAsRead}
          fontSize="text-xs"
          rounded="rounded-lg"
          textColor="text-gray-900 disabled:text-gray-900/70"
          type="button"
          color="bg-primary hover:bg-primary-hover disabled:bg-primary-hover/50"
          className="px-2 py-1 cursor-pointer border-b-2 hover:underline border border-primary-hover disabled:no-underline disabled:cursor-not-allowed disabled:border-primary-hover/50"
          disabled={unreadCount === 0}
        >
          Marcar todas como lidas
        </CustomButton>
      </div>

      <div>
        {displayedNotifications.length === 0 ? (
          <p className="p-4 text-center text-sm text-gray-500">
            Nenhuma notificação.
          </p>
        ) : (
          <ul className={`max-h-[72vh] ${scrollable && "overflow-y-scroll "}`}>
            {displayedNotifications.map((n) => (
              <li
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className="border-b border-border last:border-b-0 "
              >
                <div className="p-3 hover:bg-gray-100 cursor-pointer ">
                  <div className="flex items-start gap-3">
                    {!n.read && (
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                    <div className={clsx("flex-grow", n.read && "pl-5")}>
                      <p className="text-sm font-semibold">{n.title}</p>
                      <p className="text-xs text-gray-600">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(n.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {maxNotifications && notifications.length > maxNotifications && (
        <div className="p-2 text-center border-t border-border bg-gray-50">
          <Link
            href="/notificacoes"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Ver todas as notificações
          </Link>
        </div>
      )}
    </div>
  );
};
