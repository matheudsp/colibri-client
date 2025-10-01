"use client";

import Image from "next/image";
import { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CheckCircle,
  FileText,
  BarChart2,
} from "lucide-react";
import { UserGroupIcon } from "@heroicons/react/24/outline";

const features = [
  {
    icon: <FileText className="h-8 w-8 md:h-10 md:w-10 text-cyan-500" />,
    title: "Contratos 100% digitais",
    description:
      "Crie, envie e assine contratos de aluguel sem papelada e sem sair de casa. Agilidade e segurança na palma da sua mão.",
  },
  {
    icon: <BarChart2 className="h-8 w-8 md:h-10 md:w-10 text-cyan-500" />,
    title: "Gestão financeira simplificada",
    description:
      "Acompanhe faturas, registre pagamentos e tenha uma visão clara da sua rentabilidade com painel financeiro.",
  },
  {
    icon: <CheckCircle className="h-8 w-8 md:h-10 md:w-10 text-cyan-500" />,
    title: "Plataforma completa",
    description:
      "Uma solução integrada para locadores e locatários, desde a busca do imóvel até a gestão do dia a dia da locação.",
  },
  {
    icon: <UserGroupIcon className="h-8 w-8 md:h-10 md:w-10 text-cyan-500" />,
    title: "Desenvolvimento baseado no feedback",
    description:
      "Nós entendemos o valor do feedback do usuário, o desenvolvimento de novas funcionalidades irá escutar o público para melhorias do sistema!",
  },
];

const LaunchDate = () => {
  const today = new Date();
  const launchDate = new Date(today.getFullYear(), today.getMonth() + 1, 10);
  const monthName = launchDate.toLocaleString("pt-BR", { month: "long" });
  const year = launchDate.getFullYear();
  const formattedDate = `10 de ${monthName} de ${year}`;

  return (
    <div className="text-center">
      <p className="text-sm text-gray-400 uppercase tracking-wider">
        Lançamento previsto em
      </p>
      <p className="text-xl md:text-2xl font-bold text-gray-200">
        {formattedDate}
      </p>
    </div>
  );
};

export default function LancamentoPage() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setFeature = (index: number) => {
    setCurrentFeature(index);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentFeature((prev) =>
        prev === features.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentFeature]);

  const handleNotifySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(10,178,206,0.15),rgba(255,255,255,0))]"></div>
        <div className="absolute bottom-[-40%] right-[-20%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(10,178,206,0.1),rgba(255,255,255,0))]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-4xl w-full">
        <div className="mb-6">
          <Image
            src="/logo/paisagem/paisagem-svg/5.svg"
            alt="Logo Locaterra"
            width={240}
            height={80}
            className="mx-auto"
          />
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Uma nova era na gestão de aluguéis está começando.
        </h1>

        <p className="text-base md:text-lg text-gray-300 mb-10 text-center max-w-2xl">
          Deixe a burocracia para trás. O Locaterra automatiza seus processos
          para que você foque no que realmente importa.
        </p>

        <div className="w-full max-w-lg relative">
          <div className="h-48 md:h-44 mb-4 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="absolute w-full h-full flex flex-col items-center justify-center text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700"
              >
                {features[currentFeature].icon}
                <h3 className="font-semibold text-lg md:text-xl mt-3 mb-1 text-cyan-400">
                  {features[currentFeature].title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {features[currentFeature].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          <button
            onClick={() =>
              setFeature(
                currentFeature === 0 ? features.length - 1 : currentFeature - 1
              )
            }
            className="absolute top-1/2 -translate-y-1/2 -left-12 text-gray-500 hover:text-white transition-colors hidden md:block"
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onClick={() =>
              setFeature(
                currentFeature === features.length - 1 ? 0 : currentFeature + 1
              )
            }
            className="absolute top-1/2 -translate-y-1/2 -right-12 text-gray-500 hover:text-white transition-colors hidden md:block"
          >
            <ArrowRight size={24} />
          </button>

          <div className="flex justify-center gap-2 mb-10">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setFeature(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentFeature === index
                    ? "w-6 bg-cyan-500"
                    : "w-2 bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Seja o primeiro a saber!
          </h2>
          <p className="text-gray-400 mb-4">
            Deixe seu e-mail abaixo e nós enviaremos uma notificação exclusiva
            assim que a plataforma for lançada.
          </p>

          {submitted ? (
            <div className="flex flex-col items-center justify-center text-center bg-green-900/50 border border-green-700 p-4 rounded-lg">
              <CheckCircle className="text-green-400 mb-2" size={32} />
              <h3 className="font-bold text-lg">Tudo certo!</h3>
              <p className="text-green-200">
                Avisaremos você assim que o Locaterra estiver no ar.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleNotifySubmit}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                required
                placeholder="Digite seu melhor e-mail"
                className="flex-grow bg-gray-800 border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-6 py-3 rounded-md transition-all duration-300 disabled:bg-gray-500"
              >
                {isSubmitting ? (
                  "Enviando..."
                ) : (
                  <>
                    <Bell className="mr-2" size={18} /> Avise-me
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <footer className="mt-12 md:mt-16 w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 border-t border-gray-800 pt-6">
          <Suspense
            fallback={
              <div className="h-12 w-48 bg-gray-700 animate-pulse rounded-lg" />
            }
          >
            <LaunchDate />
          </Suspense>
          <Image
            src="/logo/valedosol/logo-cropped.png"
            alt="Logo Locaterra"
            width={150}
            height={50}
            className="invert-75"
          />
        </footer>
      </div>
    </main>
  );
}
