import Image from "next/image";
import { FileText, BarChart2, Users, Percent } from "lucide-react";
import { FaCheckCircle } from "react-icons/fa";
import { LaunchForm } from "./launch-form";
import { StatsChart } from "./stats-chart";

const features = [
  {
    icon: <FileText className="h-7 w-7 text-success" />,
    title: "Contratos digitais",
    description:
      "Geração e assinatura eletrônica para reduzir burocracia e acelerar fechamento.",
  },
  {
    icon: <BarChart2 className="h-7 w-7 text-success" />,
    title: "Controle financeiro",
    description:
      "Painel simples para acompanhar recebíveis e histórico de pagamentos.",
  },
  {
    icon: <Users className="h-7 w-7 text-success" />,
    title: "Comunicação centralizada",
    description:
      "Mensagens e notificações automáticas para inquilinos e proprietários.",
  },
];

function LaunchDateBadge() {
  const today = new Date();
  const launchDate = new Date(today.getFullYear(), today.getMonth() + 1, 10);
  const monthName = launchDate.toLocaleString("pt-BR", { month: "long" });
  const year = launchDate.getFullYear();
  const formattedDate = `10 de ${monthName} de ${year}`;

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-background-alt border border-border text-sm">
      <strong className="text-foreground">Lançamento:</strong>
      <span className="text-foreground-muted">{formattedDate}</span>
    </div>
  );
}

export default function LancamentoPage() {
  return (
    <main className="min-h-screen bg-background text-foreground antialiased flex items-center">
      <div className="w-full max-w-6xl mx-auto px-6 py-16">
        {/* HERO */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-primary-light text-sm font-medium text-emerald-700">
                Pré-lançamento
              </div>
              <div className="px-3 py-1 rounded-full bg-accent/10 text-xs font-medium text-accent flex items-center gap-1">
                <Percent className="w-3 h-3" /> Taxa:{" "}
                <span className="font-semibold ml-1">8% por aluguel</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Locaterra — a forma mais simples de gerenciar seus aluguéis.
            </h1>

            <p className="text-lg text-foreground-muted max-w-2xl">
              Automação de contratos, cobrança e acompanhamento financeiro. Sem
              mensalidade fixa: cobramos 8% de cada aluguel processado pela
              plataforma — transparência e custo alinhado ao seu resultado.
            </p>

            <div className="flex items-center gap-3">
              <LaunchDateBadge />
            </div>

            <LaunchForm />

            <div className="flex items-center gap-6 text-sm text-foreground-muted mt-2">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="w-4 h-4 text-success" /> Sem
                mensalidade fixa
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <FaCheckCircle className="w-4 h-4 text-success" /> Segurança
                jurídica nas assinaturas
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <StatsChart />
          </div>
        </section>

        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-card border border-border shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary-light flex items-center justify-center">
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{f.title}</h4>
                  <p className="text-sm text-foreground-muted mt-1">
                    {f.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <footer className="mt-16 border-t border-border pt-6">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo/paisagem/paisagem-svg/5.svg"
                alt="Locaterra"
                width={140}
                height={44}
              />
            </div>
            <div className="text-sm text-foreground-muted">
              © {new Date().getFullYear()} Locaterra. Todos os direitos
              reservados.
            </div>
            <a
              href="/politica-de-privacidade"
              className="text-sm text-foreground-muted hover:text-foreground transition"
            >
              Política de Privacidade
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
