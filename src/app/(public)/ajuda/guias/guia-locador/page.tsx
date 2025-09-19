"use client";

import YouTubeEmbed from "@/components/common/YoutubeEmbed";
import {
  AcademicCapIcon,
  ArrowRightIcon,
  CameraIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  PencilSquareIcon,
  RocketLaunchIcon,
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

export default function GuiaLocadorPage() {
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
              Guia do Locador
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-zinc-800">
            Publicando seu Primeiro Imóvel na Locaterra
          </h2>
          <p className="text-lg text-zinc-600 mt-2 max-w-2xl mx-auto">
            Bem-vindo! Este guia foi feito para transformar o cadastro do seu
            imóvel em uma tarefa simples e rápida. Vamos juntos?
          </p>
        </header>

        <main className="space-y-16">
          <section>
            <h3 className="text-2xl font-bold text-zinc-800 mb-4 text-center">
              Assista ao Vídeo Completo
            </h3>
            <YouTubeEmbed
              videoId="YOUTUBE_VIDEO_ID_AQUI"
              title="Guia do Locador: Publicando seu Primeiro Imóvel"
            />
          </section>

          <section className="prose prose-zinc max-w-none lg:prose-lg">
            <h3 className="text-2xl font-bold text-zinc-800 mb-6 text-center">
              O Processo em 5 Passos Simples
            </h3>
            <div className="space-y-8 p-6 bg-white border border-zinc-200 rounded-lg shadow-xs">
              <StepCard icon={HomeIcon} title="1. Acesse seu Painel de Imóveis">
                <p>
                  Após fazer login, encontre a seção{" "}
                  <strong>&quot;Meus Imóveis&quot;</strong> no menu lateral. É
                  lá que toda a mágica acontece. Clique em{" "}
                  <strong>&quot;Adicionar Novo Imóvel&quot;</strong> para
                  começar.
                </p>
              </StepCard>

              <StepCard
                icon={PencilSquareIcon}
                title="2. Descreva sua Propriedade"
              >
                <p>
                  Aqui você preenche as informações essenciais: endereço, tipo
                  de imóvel (casa, apartamento), número de cômodos e o valor do
                  aluguel. Seja detalhista, pois isso ajuda o inquilino a
                  entender melhor o espaço.
                </p>
              </StepCard>

              <StepCard icon={CameraIcon} title="3. Capriche nas Fotos">
                <p>
                  Fotos são a vitrine do seu imóvel! Envie imagens claras, com
                  boa iluminação e de todos os ambientes. Lembre-se de marcar a
                  melhor foto como <strong>&quot;Capa&quot;</strong>, pois ela
                  será a primeira impressão.
                </p>
                {/* Dica de Ouro para mais engajamento */}
                <div className="mt-3 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                  <p className="flex items-center text-sm font-semibold text-amber-800">
                    <StarIcon className="h-5 w-5 mr-2" />
                    Dica de Ouro
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    Fotos tiradas durante o dia e na horizontal costumam ter um
                    desempenho muito melhor!
                  </p>
                </div>
              </StepCard>

              <StepCard
                icon={ClipboardDocumentListIcon}
                title="4. Revise as Informações"
              >
                <p>
                  Antes de publicar, dê uma última olhada em todos os dados.
                  Verifique se o endereço está correto e se os valores de
                  aluguel, condomínio e IPTU estão certos.
                </p>
              </StepCard>

              <StepCard
                icon={RocketLaunchIcon}
                title="5. Publique e Comece a Receber Propostas"
              >
                <p>
                  Tudo pronto? Clique em{" "}
                  <strong>&quot;Salvar e Publicar&quot;</strong>. Parabéns! Seu
                  imóvel já está visível para milhares de locatários em
                  potencial. Agora é só aguardar as propostas chegarem.
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
