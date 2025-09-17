"use client";

import YouTubeEmbed from "@/components/common/YoutubeEmbed";
import {
  AcademicCapIcon,
  ArrowRightIcon,
  CursorArrowRaysIcon,
  DocumentArrowUpIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  SparklesIcon,
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
    <div className="flex-shrink-0">
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

export default function GuiaLocatarioPage() {
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
            <AcademicCapIcon className="h-10 w-10 mr-3" />
            <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900">
              Guia do Locatário
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-zinc-800">
            Encontrando seu Novo Lar na Locaterra
          </h2>
          <p className="text-lg text-zinc-600 mt-2 max-w-2xl mx-auto">
            Alugar um imóvel nunca foi tão simples. Siga estes passos para
            encontrar e garantir sua próxima casa ou apartamento.
          </p>
        </header>

        <main className="space-y-16">
          <section>
            <h3 className="text-2xl font-bold text-zinc-800 mb-4 text-center">
              Assista ao Vídeo Completo
            </h3>
            <YouTubeEmbed
              videoId="YOUTUBE_VIDEO_ID_AQUI"
              title="Guia do Locatário: Encontrando seu novo lar"
            />
          </section>

          <section className="prose prose-zinc max-w-none lg:prose-lg">
            <h3 className="text-2xl font-bold text-zinc-800 mb-6 text-center">
              Sua Jornada até as Chaves
            </h3>
            <div className="space-y-8 p-6 bg-white border border-zinc-200 rounded-lg shadow-sm">
              <StepCard
                icon={MagnifyingGlassIcon}
                title="1. Busque com Inteligência"
              >
                <p>
                  Sua jornada começa na busca. Use os filtros por cidade,
                  bairro, preço e características para encontrar exatamente o
                  que você procura.
                </p>
              </StepCard>

              <StepCard icon={SparklesIcon} title="2. Explore Cada Detalhe">
                <p>
                  Encontrou um imóvel interessante? Mergulhe nos detalhes! Veja
                  a galeria de fotos completa, leia a descrição e confira todos
                  os valores. A transparência é nossa prioridade.
                </p>
              </StepCard>

              <StepCard
                icon={CursorArrowRaysIcon}
                title="3. Demonstre seu Interesse"
              >
                <p>
                  É o lugar perfeito para você? Clique em{" "}
                  <strong>&quot;Tenho Interesse&quot;</strong> ou{" "}
                  <strong>&quot;Enviar Proposta&quot;</strong>. O locador será
                  notificado e o processo de locação começará oficialmente.
                </p>
              </StepCard>

              <StepCard
                icon={DocumentArrowUpIcon}
                title="4. Envie seus Documentos com Segurança"
              >
                <p>
                  Após o locador criar o contrato, você receberá uma notificação
                  para enviar seus documentos (Identidade, CPF, etc.) pela
                  plataforma. É tudo 100% online e seguro.
                </p>
                {/* Dica de Ouro para agilizar o processo */}
                <div className="mt-3 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                  <p className="flex items-center text-sm font-semibold text-amber-800">
                    <StarIcon className="h-5 w-5 mr-2" />
                    Dica de Ouro
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    Tenha seus documentos já digitalizados (fotos ou PDFs) no
                    celular ou computador para agilizar muito esta etapa!
                  </p>
                </div>
              </StepCard>

              <StepCard
                icon={PencilSquareIcon}
                title="5. Assine o Contrato Digitalmente"
              >
                <p>
                  Documentos aprovados? Ótimo! Você receberá um link para
                  assinar o contrato digitalmente via Clicksign. Sem papelada,
                  sem cartório. Simples, rápido e com total validade jurídica.
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
