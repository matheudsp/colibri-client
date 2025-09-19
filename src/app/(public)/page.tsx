"use client";

import { SearchBar } from "@/components/forms/SearchBar";

import { RecentPropertiesList } from "@/components/lists/RecentPropertiesList";
import { BenefitsSection } from "@/components/sections/home/BenefitsSectiont";
import { HelpSection } from "@/components/sections/home/HelpSection";

export default function Home() {
  return (
    <div className="bg-background flex-col justify-center items-center ">
      <section className="lg:min-h-[48svh] md:min-h-[54svh] sm:min-h-[72svh] min-h-[96svh] w-full bg-secondary flex flex-col items-center justify-center text-center text-white">
        <div className="w-full flex flex-col items-center justify-center">
          <div className=" px-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              Para{" "}
              <span className="bg-primary text-secondary px-2 rounded-sm">
                você
              </span>{" "}
              morar bem
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-200">
              Busque seu imóvel na Locaterra.
            </p>
          </div>

          <div className="mt-12 w-full px-4 flex items-center justify-center">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto">
        <RecentPropertiesList />
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
