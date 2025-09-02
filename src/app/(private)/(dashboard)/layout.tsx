"use client";

import { useState } from "react";

import BottomNav from "../../../components/layout/BottomNav";
import SidebarNav from "../../../components/layout/SidebarNav";
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
      <div className="min-h-svh w-full flex flex-col md:flex-row overflow-x-hidden">
        <SidebarNav />
        <main className="flex-1 md:ml-32">{children}</main>
        <BottomNav />
      </div>
    </SearchProvider>
  );
}
