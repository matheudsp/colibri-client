import { CreditCard, Eye, FileSignature, FileText, Home } from "lucide-react";
import Image from "next/image";
export const AutopromoteSection = () => {
  return (
    <section className="py-12 md:py-16 px-2 max-w-3xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Alugue com a <span className="text-primary">Locaterra</span>:
            <br className="hidden md:block" /> Simples, Rápido e Digital!
          </h2>
          <p className="text-muted-foreground mt-2">
            A forma inteligente de alugar o seu próximo lar.
          </p>
        </div>
        <div className="shrink-0">
          <Image
            src="/logo/icon/icon.svg"
            alt="Locaterra Icon"
            width={48}
            height={48}
            className="h-12 w-auto object-contain"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 text-foreground">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 text-primary p-3 rounded-lg flex-shrink-0">
            <FileSignature size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Contrato e Assinatura Online
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Revise e assine seu contrato digitalmente, com segurança e
              validade jurídica.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-primary/10 text-primary p-3 rounded-lg flex-shrink-0">
            <CreditCard size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Pagamentos Facilitados
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Pague seu aluguel por <strong className="font-medium">PIX</strong>{" "}
              ou <strong className="font-medium">Boleto</strong>, com lembretes
              automáticos.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-primary/10 text-primary p-3 rounded-lg flex-shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Documentos Digitais
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Envie e valide seus documentos diretamente pela plataforma, com
              total segurança.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-primary/10 text-primary p-3 rounded-lg flex-shrink-0">
            <Eye size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Transparência Total
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Acompanhe todas as etapas da locação — da proposta ao pagamento —
              de forma clara e centralizada.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 md:col-span-2">
          <div className="bg-secondary/10 text-secondary p-3 rounded-lg flex-shrink-0">
            <Home size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Para Locadores</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Gerenciamos cobranças, automatizamos repasses por
              <strong className="font-medium"> PIX</strong> e simplificamos a
              administração completa do seu imóvel.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
