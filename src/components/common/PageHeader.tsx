"use client";

import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";

export type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface PageHeaderProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Icon component shown at the left. Defaults to LayoutDashboard */
  icon?: IconComponent;
  /** HTML attributes for the top-level wrapper */
  className?: string;
  /** Optional right-side actions (buttons, filters, etc) */
  actions?: React.ReactNode;
  /** Optional small breadcrumb or pretitle shown above the title */
  preTitle?: React.ReactNode;
  /** If true, reduces paddings/sizes for compact pages */
  compact?: boolean;
  /** If provided, render a simple back link on the left (mobile-friendly) */
  backHref?: string;
}

export default function PageHeader({
  title = "",
  subtitle = "",
  icon: Icon = LayoutDashboard,
  className,
  actions,
  preTitle,

  backHref,
}: PageHeaderProps) {
  return (
    <header
      role="banner"
      aria-label={typeof title === "string" ? title : "page header"}
      className={clsx(
        "w-full",
        // "p-4",
        // "rounded-2xl",
        // "border",
        // "border-border",
        "flex",
        "items-center",
        "gap-4",
        className
      )}
    >
      {/* Icon / Back area */}
      <div className={clsx("hidden items-start gap-3 md:flex")}>
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100"
            aria-label="Voltar"
          >
            {/* simple chevron left built with svg for minimal bundle impact */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-700"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
        ) : null}

        <motion.div
          initial={{ scale: 0.95, opacity: 0.9 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className={clsx(
            "flex items-center justify-center rounded-xl",
            "w-14 h-14",
            "outline-2 outline-primary-light outline-offset-2",
            "bg-primary/10 text-primary"
          )}
        >
          <Icon className={clsx("w-6 h-6")} />
        </motion.div>
      </div>

      {/* Title and subtitle */}
      <div className="flex-1">
        {preTitle ? (
          <div className="text-xs text-gray-500 mb-1">{preTitle}</div>
        ) : null}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1
              className={clsx(
                "font-bold text-black leading-tight",
                "text-3xl sm:text-4xl"
              )}
            >
              {title}
            </h1>
            {subtitle ? (
              <p className="text-sm text-gray-500 mt-1 max-w-prose">
                {subtitle}
              </p>
            ) : null}
          </div>

          {/* Actions area */}
          {actions ? (
            <div className="flex items-center gap-3 mt-2 sm:mt-0">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
