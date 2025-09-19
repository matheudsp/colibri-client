"use client";

import YouTubeEmbed from "@/components/common/YoutubeEmbed";
import {
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  ChartPieIcon,
  CheckBadgeIcon,
  EnvelopeOpenIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Link from "next/link";

const StepCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start space-x-4">
    <div className="shrink-0">
      <div className="bg-primary/10 text-primary rounded-lg p-3">
        <Icon className="h-6 w-6" />
      </div>
    </div>
    <div>
      <h4 className="text-xl font-bold text-zinc-800">{title}</h4>
      <div className="text-zinc-600 mt-1">{children}</div>
    </div>
  </div>
);

export default function PagamentosPage() {
  return (
    <div className="bg-zinc-50 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 py-12"
      >
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center text-primary mb-4">
            <BanknotesIcon className="h-10 w-10 mr-3" />
            <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900">
              Entendendo os Pagamentos
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-zinc-800">
            O fluxo financeiro da sua locação, explicado.
          </h2>
          <p className="text-lg text-zinc-600 mt-2 max-w-2xl mx-auto">
            Veja como garantimos um processo de pagamento e repasse seguro e
            transparente para todos.
          </p>
        </header>

        <main className="space-y-16">
          <section>
            <h3 className="text-2xl font-bold text-zinc-800 mb-4 text-center">
              Assista ao Vídeo Completo
            </h3>
            <YouTubeEmbed
              videoId="YOUTUBE_VIDEO_ID_AQUI"
              title="Entendendo o Fluxo de Pagamentos na Locaterra"
            />
          </section>

          <section className="prose prose-zinc max-w-none lg:prose-lg">
            <h3 className="text-2xl font-bold text-zinc-800 mb-6 text-center">
              A Jornada do Locatário (Inquilino)
            </h3>
            <div className="space-y-8 p-6 bg-white border border-zinc-200 rounded-lg shadow-xs">
              <StepCard
                icon={CalendarDaysIcon}
                title="1. Fatura Gerada Automaticamente"
              >
                <p>
                  Todo mês, sua fatura é criada e aparece na seção{" "}
                  <strong>&quot;Meus Pagamentos&quot;</strong>. Você também
                  recebe um aviso por e-mail para não esquecer. Simples assim!
                </p>
              </StepCard>

              <StepCard icon={BanknotesIcon} title="2. Pague Como Preferir">
                <p>
                  Acesse sua fatura e escolha entre{" "}
                  <strong>Boleto Bancário</strong> ou <strong>PIX</strong>. Com
                  o PIX &quot;Copia e Cola&quot;, o pagamento é ainda mais
                  rápido e pode ser feito a qualquer hora.
                </p>
                <div className="mt-3 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                  <p className="flex items-center text-sm font-semibold text-amber-800">
                    <StarIcon className="h-5 w-5 mr-2" />
                    Dica de Ouro
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    Pague sempre com alguns dias de antecedência para evitar
                    imprevistos com o tempo de compensação do boleto.
                  </p>
                </div>
              </StepCard>

              <StepCard
                icon={CheckBadgeIcon}
                title="3. Confirmação Instantânea"
              >
                <p>
                  Assim que o pagamento é confirmado pelo banco, o status da sua
                  fatura muda para <strong>&quot;Pago&quot;</strong> em seu
                  painel. Você e o locador são notificados, garantindo
                  tranquilidade para ambos.
                </p>
              </StepCard>
            </div>
          </section>

          {/* Seção do Locador */}
          <section className="prose prose-zinc max-w-none lg:prose-lg">
            <h3 className="text-2xl font-bold text-zinc-800 mb-6 text-center">
              A Jornada do Locador (Proprietário)
            </h3>
            <div className="space-y-8 p-6 bg-white border border-zinc-200 rounded-lg shadow-xs">
              <StepCard
                icon={EnvelopeOpenIcon}
                title="1. Notificação de Recebimento"
              >
                <p>
                  No momento em que o inquilino paga, você recebe uma
                  notificação. O valor fica disponível em sua conta digital
                  Asaas, já com as taxas da plataforma descontadas.
                </p>
              </StepCard>

              <StepCard
                icon={ArrowsRightLeftIcon}
                title="2. Repasse Automático para seu PIX"
              >
                <p>
                  Não precisa fazer nada! O valor líquido do aluguel é
                  transferido <strong>automaticamente</strong> para a chave PIX
                  que você cadastrou. Rápido, seguro e sem burocracia.
                </p>
                <div className="mt-3 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                  <p className="flex items-center text-sm font-semibold text-amber-800">
                    <StarIcon className="h-5 w-5 mr-2" />
                    Dica de Ouro
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    Mantenha sempre sua chave PIX atualizada no perfil para
                    garantir que os repasses ocorram sem atrasos.
                  </p>
                </div>
              </StepCard>

              <StepCard
                icon={ChartPieIcon}
                title="3. Extrato Completo e Transparente"
              >
                <p>
                  Acesse sua área financeira no painel para ver um extrato
                  detalhado de todos os pagamentos, taxas e repasses. Seu
                  controle financeiro na palma da mão.
                </p>
              </StepCard>
            </div>
          </section>

          <footer className="text-center pt-8 border-t border-zinc-200">
            <Link
              href="/ajuda"
              className="inline-flex items-center text-primary hover:underline font-semibold"
            >
              <ArrowRightIcon className="h-4 w-4 mr-2 rotate-180" />
              Voltar para a Central de Ajuda
            </Link>
          </footer>
        </main>
      </motion.div>
    </div>
  );
}
