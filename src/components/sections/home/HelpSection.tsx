"use client";
import { Tag, Wallet, Megaphone, ShieldCheck } from "lucide-react";
import Link from "next/link";

const helpItems = [
  {
    icon: <Tag className="w-6 h-6 text-primary" />,
    title: "Aluguel Rápido e 100% Digital",
    description:
      "Encontre o imóvel ideal e alugue sem burocracia. Propostas, documentos e contratos, tudo online, com validade jurídica.",
    linkText: "Quero alugar",
    href: "/imoveis",
  },
  {
    icon: <Wallet className="w-6 h-6 text-primary" />,
    title: "Pagamentos Automatizados",
    description:
      "Gerencie e receba seus aluguéis com praticidade. Garantimos segurança, previsibilidade e menos preocupações.",
    linkText: "Saiba mais",
    href: "/pagamentos",
  },
  {
    icon: <Megaphone className="w-6 h-6 text-primary" />,
    title: "Visibilidade para seu Imóvel",
    description:
      "Anuncie grátis e alcance milhares de potenciais inquilinos. Mais agilidade, mais chances de locação, sem custo inicial.",
    linkText: "Criar conta agora",
    href: "/register",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    title: "Segurança e Controle para Locadores",
    description:
      "Tenha contratos digitais, gestão centralizada e recebimentos garantidos. Aproveite a taxa promocional de 5% — por tempo limitado.",
    linkText: "Entenda",
    href: "/saiba-mais",
  },
];
export function HelpSection() {
  return (
    <div className="w-full bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-start text-gray-800 mb-12">
          Como a Colibri pode te ajudar?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {helpItems.map((item) => (
            <div
              key={item.title}
              className="bg-white p-6 border border-gray-200 rounded-lg flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
              <p className="text-gray-600 mt-2 flex-grow">{item.description}</p>
              <Link
                href={item.href}
                className="text-secondary font-bold mt-4 inline-block group"
              >
                {item.linkText}
                <span className="inline-block transition-transform group-hover:translate-x-1 ml-1">
                  &rarr;
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
