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
      <div className="min-h-screen w-full flex flex-col md:flex-row">
        <SidebarNav />

        {/* md:ml-48 */}
        <main
          className="flex-1 
        
         transition-all duration-300"
        >
          {children}
        </main>

        <BottomNav />
      </div>
    </SearchProvider>
  );
}
