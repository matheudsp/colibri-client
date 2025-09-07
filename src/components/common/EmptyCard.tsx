import React from "react";

interface EmptyCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export function EmptyCard({
  icon,
  title,
  subtitle,
  className = "",
}: EmptyCardProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-center p-6 bg-white rounded-lg shadow-sm ${className}`}
    >
      <div className="text-gray-400">{icon}</div>
      <p className="text-gray-600 font-semibold">{title}</p>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}
