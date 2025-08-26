"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "../../components/layout/Header";
import { SearchProvider } from "../../contexts/SearchContext";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });

      handleScroll();

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    } else {
      setIsScrolled(true);
    }
  }, [pathname]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <SearchProvider value={{ searchValue, handleSearchChange }}>
      <Header
        type={"default"}
        isScrolled={isScrolled}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
      />
      <main className="w-full ">{children}</main>
      <Footer />
    </SearchProvider>
  );
}
