"use client";

import { SearchBar } from "@/components/forms/SearchBar";

import { RecentPropertiesList } from "@/components/lists/RecentPropertiesList";
import { BenefitsSection } from "@/components/sections/home/BenefitsSectiont";
import { HelpSection } from "@/components/sections/home/HelpSection";

export default function Home() {
  return (
    <div className="bg-background flex-col justify-center items-center ">
      <section className="relative lg:min-h-[48svh] md:min-h-[54svh] min-h-[72svh] w-full bg-gradient-to-b from-secondary-hover to-secondary mt-16 flex flex-col items-center justify-center text-center text-white">
        <div className="w-full lg:max-w-7xl flex flex-col items-center justify-center lg:py-10 ">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter flex items-center gap-x-2 flex-wrap justify-center">
            Para{" "}
            <span className="bg-primary text-3xl  uppercase font-black text-secondary px-2.5 py-1 rounded-xl">
              você
            </span>{" "}
            morar bem
          </h1>
          <p className="mt-4 text-sm md:text-base text-center text-gray-200 italic">
            Busque seu imóvel na Locaterra.
          </p>

          <div className="mt-6 w-full px-4 flex items-center justify-center">
            <SearchBar />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform -scale-y-100">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[75px]"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.3-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              className="fill-background"
            ></path>
          </svg>
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
