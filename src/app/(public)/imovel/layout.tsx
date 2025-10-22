"use client";

import { useState } from "react";

import { SearchProvider } from "../../../contexts/SearchContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <SearchProvider value={{ searchValue, handleSearchChange }}>
      <div className="min-h-svh bg-background w-full flex items-center justify-center flex-col md:flex-row overflow-x-hidden">
        {children}
      </div>
    </SearchProvider>
  );
}
