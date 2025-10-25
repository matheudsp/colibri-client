"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { ContainerScroll } from "@/components/ui/container-scroll-animation";

import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { SecuritySeal } from "@/components/common/SecuritySeal";

function HeroScrollSection() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <div className="md:pb-10 ">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-secondary leading-tight ">
              Locaterra{" - "}
              <span className="font-bold text-secondary-hover tracking-tighter">
                Aluguel Digital, Gestão Simplificada.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-justify  text-foreground/80 max-w-4xl mx-auto ">
              A plataforma completa para locadores e locatários. Automatize
              contratos, pagamentos e a comunicação – tudo online, com segurança
              e transparência.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button
                size="lg"
                asChild
                className="bg-primary hover:bg-primary-hover border border-b-4 border-primary-hover text-primary-foreground font-bold w-full sm:w-auto"
              >
                <Link href="/registrar">Criar Conta Grátis</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-secondary text-secondary hover:bg-secondary/5 hover:text-secondary font-bold w-full sm:w-auto"
              >
                <Link href="/imoveis/para-alugar">Buscar Imóveis</Link>
              </Button>
            </div>
          </div>
        }
      >
        <Image
          src={`/images/carousel/1.png`}
          alt="Painel Locaterra"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
          priority
        />
      </ContainerScroll>
    </div>
  );
}

const carouselData = [
  {
    category: "Contratos",
    title: "Contratos Digitais e Personalizados",
    src: "/images/carousel/6.png",
    content: (
      <Image
        src="/images/carousel/6.png"
        alt="Locaterra feature illustration"
        height={500}
        width={500}
        className="h-full w-full mx-auto object-contain mt-4"
      />
    ),
  },
  {
    category: "Faturas",
    title: "Cobrança Automatizada",
    src: "/images/carousel/3.png",
    content: (
      <Image
        src="/images/carousel/3.png"
        alt="Locaterra feature illustration"
        height={500}
        width={500}
        className="h-full w-full mx-auto object-contain mt-4"
      />
    ),
  },
  {
    category: "Painel Financeiro",
    title: "Tenha o controle financeiro na palma das mãos",
    src: "/images/carousel/4.png",
    content: (
      <Image
        src="/images/carousel/4.png"
        alt="Locaterra feature illustration"
        height={500}
        width={500}
        className="h-full w-full mx-auto object-contain mt-4"
      />
    ),
  },
];

function AppleCardsCarouselSection() {
  const cards = carouselData.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20 bg-muted/50 ">
      <h2 className="max-w-7xl  mx-auto text-3xl md:text-4xl font-bold text-secondary text-center  mb-2">
        Locaterra: Sua Gestão de Aluguéis Inteligente
      </h2>
      <p className="text-lg text-foreground/80 max-w-3xl mx-auto mb-10 text-center  px-4">
        Nossa plataforma centraliza e automatiza todo o processo, da busca à
        gestão, de forma segura, transparente e intuitiva.
      </p>
      <Carousel items={cards} />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground flex flex-col">
      <HeroScrollSection />

      <AppleCardsCarouselSection />

      <section className="py-16 max-w-7xl mx-auto">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">
              Comece em Poucos Passos
            </h2>
            <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
              Nossa plataforma foi desenhada para ser intuitiva e fácil de usar.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Cadastre-se
                  </h3>
                  <p className="text-foreground/70 mt-1">
                    Crie sua conta gratuitamente como locador ou locatário em
                    poucos minutos.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Anuncie ou Encontre
                  </h3>
                  <p className="text-foreground/70 mt-1">
                    Locadores: cadastrem seus imóveis em minutos. Locatários:
                    encontrem seu lar ideal com facilidade.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Gerencie Tudo Online
                  </h3>
                  <p className="text-foreground/70 mt-1">
                    Negocie, assine contratos, envie documentos e acompanhe
                    pagamentos pela plataforma - tudo 100% online.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center max-w-7xl w-full border-t mx-auto">
        <div className="h-[20rem] w-full  bg-background  relative flex flex-col items-center justify-center antialiased px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Pronto para simplificar seu aluguel?
          </h2>
          <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
            Cadastre-se gratuitamente ou explore os imóveis disponíveis agora
            mesmo. É rápido, fácil e sem burocracia!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-primary hover:bg-primary-hover border border-b-4 border-primary-hover text-primary-foreground font-bold"
            >
              <Link href="/registrar">Criar Conta Grátis</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-secondary text-secondary hover:bg-secondary/5 hover:text-secondary font-bold"
            >
              <Link href="/imoveis/para-alugar">Buscar Imóveis</Link>
            </Button>
          </div>
          <div className="flex justify-center items-center pt-4">
            <SecuritySeal />
          </div>
        </div>
      </section>
    </div>
  );
}
