"use client";

import { useRouter } from "next/navigation";
// import Image from "next/image";

import { KeyRound, Building, ArrowRight } from "lucide-react";
import Link from "next/link";
const ProfileSelectionCard = ({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="group w-full bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-left transition-all duration-300 hover:border-primary hover:shadow-2xl hover:-translate-y-1"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-lg text-primary">{icon}</div>
        <div>
          <h3 className="font-bold text-lg text-secondary">{title}</h3>
          <p className="text-sm text-foreground/80">{description}</p>
        </div>
      </div>
      <ArrowRight className="text-gray-300 transition-transform duration-300 group-hover:text-primary group-hover:translate-x-1" />
    </div>
  </button>
);

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-[90svh] w-full bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8 mt-20">
        {/* <Image
          width={200}
          height={200}
          src="/icons/logo-purple-black.svg"
          alt="Logo Colibri"
          priority
          className="w-auto h-20 mx-auto mb-8"
        /> */}
        <h1 className="text-3xl font-bold text-secondary mt-4">Bem-vindo!</h1>
        <p className="text-foreground/80 mt-1">
          Escolha seu perfil para iniciar o cadastro.
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <ProfileSelectionCard
          onClick={() => router.push("/registrar/locatario")}
          icon={<KeyRound size={28} />}
          title="Sou Inquilino"
          description="Quero encontrar um imóvel para alugar."
        />

        <ProfileSelectionCard
          onClick={() => router.push("/registrar/locador")}
          icon={<Building size={28} />}
          title="Sou Locador"
          description="Quero anunciar meus imóveis na plataforma."
        />
      </div>

      <div className="mt-8 text-center">
        <p className="text-foreground/80">
          Já tem uma conta?{" "}
          <Link
            href="/entrar"
            className="font-bold text-secondary hover:text-primary underline transition-colors"
          >
            Entre agora
          </Link>
        </p>
      </div>
    </div>
  );
}
