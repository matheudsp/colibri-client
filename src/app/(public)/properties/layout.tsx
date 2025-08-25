"use client";

import { useState } from "react";

import { SearchProvider } from "../../../contexts/SearchContext";
// import { useUserRole } from "../../../hooks/useUserRole";
// import { Loader2Icon } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { AuthService } from "@/services/domains/authService";
// import { toast } from "sonner";
// import { extractAxiosError } from "@/services/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       await AuthService.getMe();
  //       router.push("/properties");
  //     } catch (_error) {
  //       const errorMessage = extractAxiosError(_error);
  //       toast.error("Usuário não autenticado", {
  //         description: errorMessage,
  //       });
  //       router.push("/login");
  //     }
  //   };

  //   checkAuth();
  // }, [router]);

  return (
    <SearchProvider value={{ searchValue, handleSearchChange }}>
      <div className="min-h-svh w-full flex items-center justify-center flex-col md:flex-row overflow-x-hidden">
        {/* <Header
          type="search"
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
        /> */}
        {children}
      </div>
    </SearchProvider>
  );
}
