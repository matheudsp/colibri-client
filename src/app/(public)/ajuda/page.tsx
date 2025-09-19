"use client";
import { useState } from "react";
import { Tab, Disclosure } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const faqs = {
  locador: [
    {
      question: "Como cadastro meu primeiro imóvel?",
      answer:
        'No seu painel de Locador, clique em "Meus Imóveis" e depois em "Adicionar Novo Imóvel". Preencha todos os campos com os detalhes da propriedade, adicione fotos de boa qualidade e clique em "Salvar". O imóvel ficará imediatamente visível para os locatários.',
    },
    {
      question: "Como funciona o fluxo de contrato digital?",
      answer:
        "Após um locatário demonstrar interesse, você pode criar um contrato preenchendo os valores e datas. A plataforma enviará o contrato para o locatário, que deverá submeter os documentos necessários. Após sua aprovação, o contrato é enviado para assinatura digital de ambas as partes. Uma vez assinado, ele é ativado automaticamente.",
    },
    {
      question: "Como acompanho o status dos documentos do inquilino?",
      answer:
        'Acesse o contrato em questão no seu painel. Haverá uma seção de "Documentos" onde você pode visualizar cada item enviado e seu status (Aguardando Aprovação, Aprovado, Reprovado). Você será notificado por e-mail quando novos documentos forem enviados.',
    },
    {
      question: "Como recebo os pagamentos do aluguel?",
      answer:
        "Os pagamentos são processados pelo nosso serviço de pagamentos e transferidos para a sua chave PIX cadastrada. O repasse ocorre automaticamente após a confirmação do pagamento do inquilino, descontando a taxa de administração da plataforma.",
    },
  ],
  locatario: [
    {
      question: "Quais documentos preciso enviar para alugar um imóvel?",
      answer:
        "Normalmente, são necessários: uma foto do seu documento de identidade (frente e verso), CPF e um comprovante de renda recente. O locador pode solicitar documentos adicionais, que estarão listados na página do contrato.",
    },
    {
      question: "Como assino o contrato digitalmente?",
      answer:
        "Após a aprovação dos seus documentos, você receberá um link por e-mail e WhatsApp para assinar o contrato através do nosso parceiro Clicksign. O processo é 100% online, seguro e tem validade jurídica.",
    },
    {
      question: "Como faço o pagamento do aluguel?",
      answer:
        'No seu painel de Locatário, na seção "Meus Pagamentos", você encontrará as faturas mensais. Você poderá gerar um boleto bancário ou um código PIX Copia e Cola para realizar o pagamento. As faturas são geradas automaticamente todos os meses.',
    },
    {
      question: "Onde encontro meu contrato assinado?",
      answer:
        "Após a assinatura de todas as partes, uma cópia do contrato assinado digitalmente ficará disponível para download na página de detalhes do seu contrato, dentro do seu painel na Locaterra.",
    },
  ],
};
const tutorials = [
  {
    title: "Guia do Locador: Publicando seu Primeiro Imóvel",
    description:
      "Passo a passo, desde o cadastro dos detalhes e fotos até a publicação do seu imóvel para locação.",
    icon: AcademicCapIcon,
  },
  {
    title: "Guia do Locatário: Do Interesse à Proposta",
    description:
      "Aprenda a navegar, favoritar imóveis e enviar uma proposta de locação de forma simples e rápida.",
    icon: AcademicCapIcon,
  },
  {
    title: "Entendendo o Fluxo de Pagamentos",
    description:
      "Saiba como as faturas são geradas, como os pagamentos são processados e como acompanhar seu extrato.",
    icon: BookOpenIcon,
  },
];

const FaqItem = ({ faq }: { faq: { question: string; answer: string } }) => (
  <Disclosure
    as="div"
    className="bg-white border border-zinc-200 rounded-lg shadow-xs"
  >
    {({ open }) => (
      <>
        <Disclosure.Button className="flex w-full justify-between items-center rounded-lg px-4 py-3 text-left text-md font-medium text-zinc-800 hover:bg-zinc-50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary">
          <span className="w-[90%]">{faq.question}</span>
          <ChevronDownIcon
            className={`${
              open ? "rotate-180" : ""
            } h-5 w-5 text-primary transition-transform duration-300`}
          />
        </Disclosure.Button>
        <AnimatePresence initial={false}>
          {open && (
            <Disclosure.Panel
              static
              as={motion.div}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pt-3 pb-4 text-sm text-zinc-600 border-t border-zinc-200">
                {faq.answer}
              </div>
            </Disclosure.Panel>
          )}
        </AnimatePresence>
      </>
    )}
  </Disclosure>
);

const TutorialCard = ({
  tutorial,
}: {
  tutorial: { title: string; description: string; icon: React.ElementType };
}) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -4 }}
    transition={{ type: "spring", stiffness: 400, damping: 15 }}
    className="p-6 bg-white border border-zinc-200 rounded-xl cursor-pointer group shadow-xs hover:shadow-lg hover:border-primary/50"
  >
    <tutorial.icon className="h-10 w-10 text-primary mb-4 transition-transform duration-300 group-hover:scale-110" />
    <h3 className="text-lg font-bold text-zinc-900">{tutorial.title}</h3>
    <p className="mt-2 text-sm text-zinc-600">{tutorial.description}</p>
  </motion.div>
);

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = {
    locador: faqs.locador.filter((faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    locatario: faqs.locatario.filter((faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  };

  const tabStyles = ({ selected }: { selected: boolean }) =>
    `w-full whitespace-nowrap py-3 px-5 text-sm font-bold leading-5 rounded-lg
     focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 focus-visible:ring-white 
     transition-all duration-200
     ${
       selected
         ? "bg-primary text-primary-foreground shadow-md"
         : "text-zinc-600 hover:bg-zinc-200/60"
     }`;

  return (
    <div className="min-h-[90svh] pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-16"
      >
        <div className="text-center mb-12">
          <QuestionMarkCircleIcon className="h-20 w-20 sm:h-24 sm:w-24 text-primary mx-auto" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 mt-4">
            Central de Ajuda Locaterra
          </h1>
          <p className="mt-2 text-md sm:text-lg text-zinc-600">
            Tudo o que você precisa para uma experiência de locação tranquila e
            segura.
          </p>
        </div>

        <Tab.Group>
          <div className="w-full overflow-x-auto pb-2 -mx-4 px-4">
            <Tab.List className="flex w-fit mx-auto space-x-2 rounded-xl bg-zinc-100 p-2">
              <Tab className={tabStyles}>Perguntas Frequentes</Tab>
              <Tab className={tabStyles}>Guias e Tutoriais</Tab>
              <Tab className={tabStyles}>Suporte e Documentação</Tab>
            </Tab.List>
          </div>

          <Tab.Panels as="div" className="mt-8">
            <AnimatePresence mode="wait">
              <Tab.Panel
                as={motion.div}
                key="faq"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative mb-8 max-w-2xl mx-auto">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Buscar por uma pergunta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 bg-white py-3 pl-12 pr-4 shadow-xs placeholder:text-zinc-500 focus:border-primary focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div className="space-y-4 max-w-3xl mx-auto">
                  <h3 className="text-xl font-semibold text-zinc-900 px-2">
                    Para Locadores
                  </h3>
                  {filteredFaqs.locador.length > 0 ? (
                    filteredFaqs.locador.map((faq, idx) => (
                      <FaqItem key={`locador-${idx}`} faq={faq} />
                    ))
                  ) : (
                    <p className="text-zinc-500 text-sm italic px-2">
                      Nenhuma pergunta encontrada.
                    </p>
                  )}
                  <h3 className="text-xl font-semibold text-zinc-900 mt-8 pt-6 border-t border-zinc-200">
                    Para Locatários
                  </h3>
                  {filteredFaqs.locatario.length > 0 ? (
                    filteredFaqs.locatario.map((faq, idx) => (
                      <FaqItem key={`locatario-${idx}`} faq={faq} />
                    ))
                  ) : (
                    <p className="text-zinc-500 text-sm italic px-2">
                      Nenhuma pergunta encontrada.
                    </p>
                  )}
                </div>
              </Tab.Panel>

              <Tab.Panel
                as={motion.div}
                key="tutorials"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Link href="/ajuda/guias/guia-locador">
                    <TutorialCard tutorial={tutorials[0]} />
                  </Link>
                  <Link href="/ajuda/guias/guia-locatario">
                    <TutorialCard tutorial={tutorials[1]} />
                  </Link>
                  <Link href="/ajuda/guias/fluxo-pagamentos">
                    <TutorialCard tutorial={tutorials[2]} />
                  </Link>
                </div>
              </Tab.Panel>

              {/* NOVO: Layout simplificado e mais amigável para a aba de Suporte */}
              <Tab.Panel
                as={motion.div}
                key="docs"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-zinc-900">
                    Ainda precisa de ajuda?
                  </h2>
                  <p className="mt-2 text-lg text-zinc-600">
                    Nossa equipe está pronta para te atender. Escolha o canal de
                    sua preferência.
                  </p>
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Card de E-mail */}
                  <div className="bg-white rounded-lg border border-zinc-200 shadow-xs hover:shadow-lg transition-shadow flex flex-col items-center text-center p-8">
                    <div className="bg-primary/10 rounded-full p-4">
                      <EnvelopeIcon className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-zinc-800">
                      Fale por E-mail
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600 grow">
                      Ideal para dúvidas detalhadas e envio de anexos.
                      Respondemos em até 24 horas úteis.
                    </p>
                    <a
                      href="mailto:suporte@locaterra.com"
                      className="mt-6 inline-block bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Enviar E-mail
                    </a>
                  </div>

                  <div className="bg-white rounded-lg border border-zinc-200 shadow-xs hover:shadow-lg transition-shadow flex flex-col items-center text-center p-8">
                    <div className="bg-green-100 rounded-full p-4">
                      <ChatBubbleLeftRightIcon className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-zinc-800">
                      Converse no WhatsApp
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600 grow">
                      Perfeito para questões rápidas. Atendimento de Seg-Sex,
                      das 9h às 18h.
                    </p>
                    <a
                      href="https://wa.me/5589999999999"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-block bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Iniciar Conversa
                    </a>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-zinc-200 text-center">
                  <h3 className="text-xl font-semibold text-zinc-800">
                    Documentação Legal
                  </h3>
                  <div className="mt-4 flex justify-center space-x-6">
                    <Link
                      href="/termos-de-servico"
                      className="text-primary hover:underline font-medium"
                    >
                      Termos de Serviço
                    </Link>
                    <Link
                      href="/politica-de-privacidade"
                      className="text-primary hover:underline font-medium"
                    >
                      Política de Privacidade
                    </Link>
                  </div>
                </div>
              </Tab.Panel>
            </AnimatePresence>
          </Tab.Panels>
        </Tab.Group>
      </motion.div>
    </div>
  );
}
