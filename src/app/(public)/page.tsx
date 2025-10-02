"use client";

import { SearchBar } from "@/components/forms/SearchBar";

import { PropertiesList } from "@/components/lists/PropertiesList";
import { BenefitsSection } from "@/components/sections/home/BenefitsSectiont";
import { HelpSection } from "@/components/sections/home/HelpSection";
import { PropertyService } from "@/services/domains/propertyService";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function Home() {
  const { data: popularData, isLoading: isPopularLoading } = useQuery({
    queryKey: ["properties", "most-interested", { limit: 8 }],
    queryFn: () => PropertyService.listMostInterested({ page: 1, limit: 8 }),
  });

  const { data: recentData, isLoading: isRecentLoading } = useQuery({
    queryKey: ["properties", "available", { limit: 8 }],
    queryFn: () => PropertyService.listAvailable({ page: 1, limit: 8 }),
  });

  const popularProperties = popularData?.properties || [];
  const recentProperties = recentData?.properties || [];

  return (
    <div className="bg-background flex-col justify-center items-center ">
      <section
        className="relative lg:min-h-[48svh] md:min-h-[54svh] min-h-[72svh] w-full mt-16 flex flex-col items-center justify-center text-center text-white"
        aria-label="Hero Locaterra"
      >
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 transform scale-110">
            <Image
              src="/images/home-mansion.avif"
              alt=""
              fill
              className="object-cover object-center w-full h-full opacity-90 blur-[3px]"
              priority={false}
              aria-hidden="true"
            />

            <div
              className="absolute inset-0 bg-gradient-to-b from-secondary-hover to-secondary/70"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="w-full lg:max-w-7xl relative z-10 flex flex-col items-center justify-center lg:py-10 px-4">
          <h1 className="text-4xl md:text-5xl font-medium tracking-normal flex items-center gap-x-2 flex-wrap justify-center">
            Para{" "}
            <span className="bg-primary/90 text-2xl uppercase font-black text-white px-2.5 py-1.5 rounded-md">
              você
            </span>{" "}
            morar bem!
          </h1>

          <p className="mt-4 text-sm md:text-base text-center text-gray-200 italic">
            Busque seu imóvel no Locaterra.
          </p>

          <div className="mt-6 w-full px-4 flex items-center justify-center">
            <SearchBar />
          </div>
        </div>
      </section>

      {popularProperties.length > 0 && (
        <section className="max-w-7xl mx-auto">
          <PropertiesList
            title="Imóveis mais populares"
            properties={popularProperties}
            isLoading={isPopularLoading}
            viewAllLink="/imoveis"
          />
        </section>
      )}
      <section className="max-w-7xl mx-auto">
        <PropertiesList
          title="Imóveis recentes para alugar"
          properties={recentProperties}
          isLoading={isRecentLoading}
          viewAllLink="/imoveis/para-alugar"
        />
      </section>
      <section className="py-12 sm:py-18">
        <BenefitsSection />
      </section>
      <section>
        <HelpSection />
      </section>
    </div>
  );
}
