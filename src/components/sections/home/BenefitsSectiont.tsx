"use client";
import { useState } from "react";
import Image from "next/image";
import { CustomButton } from "@/components/forms/CustomButton";
import { ChevronRight, Search, Video } from "lucide-react";

function FeatureCard({
  icon,
  title,
  subtitle,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  className?: string;
}) {
  return (
    <div
      className={`absolute bg-background/80 border-border border backdrop-blur-xs p-4 rounded-xl shadow-lg flex items-center gap-4 w-11/12 sm:w-auto ${className}`}
    >
      <div className="bg-primary shrink-0 w-12 h-12 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-black">{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
}

export function BenefitsSection() {
  const [activeTab, setActiveTab] = useState<"tenants" | "landlords">(
    "tenants"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-y-12 lg:gap-x-16 items-center">
      <div className="relative w-full aspect-4/5 max-w-md mx-auto">
        <Image
          src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop"
          alt="Casa moderna"
          width={1974}
          height={2467}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="w-full h-full rounded-2xl object-cover shadow-2xl"
        />

        <FeatureCard
          icon={<Video className="w-6 h-6 text-white" />}
          title="Tour Virtual"
          subtitle="Conheça o imóvel sem sair de casa"
          className="top-4 left-4 lg:top-8 lg:-left-8"
        />
        <FeatureCard
          icon={<Search className="w-6 h-6 text-white" />}
          title="Encontre a melhor oferta"
          subtitle="Navegue por milhares de imóveis"
          className="bottom-4 right-4 lg:bottom-8 lg:-right-8"
        />
      </div>

      <div className="text-center lg:text-left">
        <div className="inline-flex p-1 bg-background-alt rounded-lg space-x-1 mb-6 cursor-pointer">
          <button
            onClick={() => setActiveTab("tenants")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
              activeTab === "tenants"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600"
            }`}
          >
            Para inquilinos
          </button>
          <button
            onClick={() => setActiveTab("landlords")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors  cursor-pointer ${
              activeTab === "landlords"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600"
            }`}
          >
            Para locadores
          </button>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
          Facilitamos a vida de inquilinos e locadores
        </h2>

        <p className="mt-4 text-gray-600 text-lg">
          {activeTab === "tenants"
            ? "Seja para encontrar seu próximo lar ou gerenciar seus pagamentos, tornamos tudo mais fácil e eficiente. A melhor parte? Você terá mais tempo e tranquilidade com nossos serviços digitais."
            : "Desde anunciar seu imóvel até receber o aluguel com segurança, nossa plataforma automatiza o processo. Conte com contratos digitais e gestão completa para valorizar seu tempo e seu patrimônio."}
        </p>

        <div className="mt-8 flex items-center justify-center lg:justify-start">
          <CustomButton
            color="bg-primary hover:bg-primary-hover"
            textColor="text-white"
            rounded="rounded-lg"
            fontSize="font-bold"
            type="button"
            className="p-3 border border-primary-hover border-b-4"
          >
            Veja mais <ChevronRight className="w-5 h-5 ml-1" />
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
