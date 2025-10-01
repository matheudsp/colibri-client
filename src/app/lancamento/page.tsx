"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle,
  FileText,
  BarChart2,
  Users,
  Percent,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

const features = [
  {
    icon: <FileText className="h-7 w-7 text-primary" />,
    title: "Contratos digitais",
    description:
      "Geração e assinatura eletrônica para reduzir burocracia e acelerar fechamento.",
  },
  {
    icon: <BarChart2 className="h-7 w-7 text-primary" />,
    title: "Controle financeiro",
    description:
      "Painel simples para acompanhar recebíveis e histórico de pagamentos.",
  },
  {
    icon: <Users className="h-7 w-7 text-primary" />,
    title: "Comunicação centralizada",
    description:
      "Mensagens e notificações automáticas para inquilinos e proprietários.",
  },
];

const chartData = [
  { name: "01", value: 1800 },
  { name: "02", value: 2400 },
  { name: "03", value: 3200 },
  { name: "04", value: 3900 },
  { name: "05", value: 4600 },
  { name: "06", value: 4100 },
  { name: "07", value: 5400 },
  { name: "08", value: 6000 },
  { name: "09", value: 7200 },
  { name: "10", value: 6800 },
  { name: "11", value: 7500 },
  { name: "12", value: 8200 },
  { name: "13", value: 7900 },
  { name: "14", value: 8600 },
];
/* eslint-disable  @typescript-eslint/no-explicit-any */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  const value = payload[0].value;
  return (
    <div
      className="p-3 rounded-lg shadow-lg"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="text-xs text-foreground-muted">Dia {label}</div>
      <div className="font-semibold text-foreground">
        R$ {value.toLocaleString()}
      </div>
      <div className="text-xs text-foreground-muted">Exemplo ilustrativo</div>
    </div>
  );
}

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
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 900);
  }

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

            <motion.h1
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-3xl md:text-5xl font-extrabold leading-tight"
            >
              Locaterra — a forma mais simples de gerenciar seus aluguéis.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12 }}
              className="text-lg text-foreground-muted max-w-2xl"
            >
              Automação de contratos, cobrança e acompanhamento financeiro. Sem
              mensalidade fixa: cobramos 8% de cada aluguel processado pela
              plataforma — transparência e custo alinhado ao seu resultado.
            </motion.p>

            <div className="flex items-center gap-3">
              <LaunchDateBadge />
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 sm:items-center max-w-xl"
            >
              <label htmlFor="email" className="sr-only">
                Seu melhor e-mail
              </label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Digite seu melhor e‑mail"
                required
                className="flex-1 rounded-lg px-4 py-3 border border-input-border bg-input-bg text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <button
                type="submit"
                disabled={isSubmitting || submitted}
                className="flex items-center gap-2 justify-center rounded-lg px-5 py-3 bg-primary text-white font-semibold shadow hover:bg-primary-hover transition w-full sm:w-auto"
              >
                {isSubmitting ? (
                  "Enviando..."
                ) : submitted ? (
                  "Recebido ✅"
                ) : (
                  <>
                    <Bell size={16} /> Avise‑me
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-6 text-sm text-foreground-muted mt-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" /> Sem mensalidade
                fixa
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" /> Segurança
                jurídica nas assinaturas
              </div>
            </div>
          </div>

          {/* RIGHT VISUAL (chart real, improved) */}
          <div className="md:col-span-5">
            <div className="rounded-2xl p-6 bg-card border border-border shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-foreground-muted">
                    Recebíveis processados (últimos 14 dias)
                  </p>
                  <p className="text-2xl font-bold text-foreground">R$ 8.240</p>
                </div>
              </div>

              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 8, right: 16, left: -16, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="gradPrimary"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="var(--primary)"
                          stopOpacity={0.22}
                        />
                        <stop
                          offset="45%"
                          stopColor="var(--primary)"
                          stopOpacity={0.12}
                        />
                        <stop
                          offset="100%"
                          stopColor="var(--primary)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      vertical={false}
                      stroke="var(--border)"
                      strokeDasharray="3 6"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "var(--foreground-muted)", fontSize: 12 }}
                      axisLine={false}
                    />
                    <YAxis
                      tickFormatter={(v) => `R$ ${Math.round(v / 1000)}k`}
                      tick={{ fill: "var(--foreground-muted)", fontSize: 12 }}
                      axisLine={false}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    {/* subtle reference line showing average */}
                    <ReferenceLine
                      y={
                        chartData.reduce((s, d) => s + d.value, 0) /
                        chartData.length
                      }
                      strokeOpacity={0.12}
                      stroke="var(--foreground-muted)"
                    />

                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--primary)"
                      fill="url(#gradPrimary)"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        stroke: "var(--background)",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 6 }}
                      isAnimationActive={true}
                      animationDuration={900}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-foreground-muted">
                <div>
                  Inquilinos <strong className="text-foreground">18</strong>
                </div>
                <div>
                  Contratos <strong className="text-foreground">14</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
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
            </motion.div>
          ))}
        </section>

        {/* SIMPLE FOOTER (improved) */}
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

            <div className="flex flex-col items-center">
              <div className="text-xs text-foreground-muted mt-2">
                Dados e valores apresentados são ilustrativos para fins de
                divulgação.
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="/politica-de-privacidade"
                className="text-sm text-foreground-muted hover:text-foreground transition"
              >
                Política de Privacidade
              </a>
              <div className="text-sm text-foreground-muted">
                © {new Date().getFullYear()} Locaterra
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
