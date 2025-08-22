"use client";

import { useEffect, useState } from "react";
import { Header } from "../../components/layout/Header";
import BottomNav from "../../components/layout/BottomNav";
import SidebarNav from "../../components/layout/SidebarNav";
import { SearchProvider } from "../../contexts/SearchContext";
import { useUserRole } from "../../hooks/useUserRole";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const { loading, role } = useUserRole();
  const [isChecking, setIsChecking] = useState(true);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  useEffect(() => {
    if (!loading) {
      if (!role) {
        router.push("/login");
      }
      setIsChecking(false);
    }
  }, [loading, role, router]);

  if (loading || isChecking) {
    return (
      <div className="flex justify-center items-center h-svh w-screen">
        <Loader2Icon className="animate-spin w-12 h-12 text-primary" />
      </div>
    );
  }

  return (
    <SearchProvider value={{ searchValue, handleSearchChange }}>
      <div className="min-h-svh w-full flex flex-col md:flex-row overflow-x-hidden">
        <SidebarNav />
        <main className="flex-1 md:ml-32">
          <Header
            type="default"
            hasSidebar
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
          />
          {children}
        </main>
        <BottomNav />
      </div>
    </SearchProvider>
  );
}
