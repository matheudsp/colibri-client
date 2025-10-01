"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Função simples para capitalizar as palavras
const toTitleCase = (str: string): string => {
  if (!str) return "";
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
};

interface BreadcrumbProps {
  location: string;
  transactionType?: "VENDA" | "LOCACAO";
  totalResults: number;
}

export function Breadcrumb({
  location,
  transactionType,
  totalResults,
}: BreadcrumbProps) {
  const transactionText =
    transactionType === "VENDA" ? "à venda" : "para alugar";
  const locationText = toTitleCase(location) || "Todo o Brasil";
  const titleText = `Imóveis ${transactionText} em ${locationText}`;

  return (
    <div className="mb-6">
      <nav className="flex items-center text-sm text-gray-500 mb-2 flex-wrap">
        <Link href="/" className="hover:text-primary whitespace-nowrap">
          Início
        </Link>
        <ChevronRight size={16} className="mx-1" />
        <span
          className="font-semibold text-gray-700 truncate whitespace-nowrap"
          title={locationText}
        >
          {locationText}
        </span>
        <ChevronRight size={16} className="mx-1" />
        <span className="whitespace-nowrap">{transactionText}</span>
      </nav>
      <h1 className="text-2xl font-bold text-gray-800">{titleText}</h1>

      <p className="text-sm text-gray-600 mt-1">{`${totalResults} imóvel${
        totalResults > 1 ? "s" : ""
      } encontrado${totalResults > 1 ? "s" : ""}`}</p>
    </div>
  );
}
