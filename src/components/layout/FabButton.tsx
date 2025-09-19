"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, HomeIcon, Building2 } from "lucide-react";

// Definindo as ações que o botão irá conter
const actions = [
  {
    label: "Adicionar Imóvel",
    icon: <HomeIcon size={20} className="text-primary" />,
    href: "/novo/imovel",
  },
  {
    label: "Adicionar Condomínio",
    icon: <Building2 size={20} className="text-primary" />,
    href: "/novo/condominio",
  },
];

export default function FabButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleActionClick = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-30">
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-30 ${
          isOpen ? "opacity-30" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div className="relative z-40 flex flex-col items-end gap-3">
        <div
          className={`flex flex-col items-end gap-3 transition-all duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          {actions.map((action, index) => (
            <div
              key={action.href}
              className={`flex items-center gap-4 transform transition-all duration-300 ease-in-out ${
                isOpen ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0"
              }`}
              style={{ transitionDelay: `${isOpen ? index * 50 : 0}ms` }}
            >
              <span className="bg-white text-sm text-gray-800 font-semibold px-4 py-2 rounded-lg shadow-md">
                {action.label}
              </span>
              <button
                onClick={() => handleActionClick(action.href)}
                className="bg-white p-3.5 rounded-full shadow-lg hover:bg-gray-200 transition-all"
                title={`Cadastrar ${action.label}`}
              >
                {action.icon}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mb-16 md:mb-0 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-hover focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform duration-300 ease-in-out"
          title={isOpen ? "Fechar" : "Adicionar novo"}
        >
          <PlusIcon
            className={`h-8 w-8 transition-transform duration-300 ${
              isOpen ? "rotate-45" : "rotate-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
