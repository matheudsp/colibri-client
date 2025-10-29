import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 xl:px-0 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        {" "}
        {/* Alterado para justify-between */}
        {/* Coluna 1: Logo e Informações da Empresa */}
        {/* Adiciona md:basis-1/3 para sugerir uma largura igual, mas flexível */}
        <div className="space-y-3 flex flex-col items-center md:items-start text-center md:text-left md:basis-1/3">
          <Link href="/" className="inline-block mb-2">
            <Image
              src="/logo/paisagem/paisagem-svg/4.svg" // Ajuste o caminho se necessário
              alt="Logo Locaterra"
              width={150}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          <p className="text-sm font-medium text-foreground">
            LOCATERRA TECNOLOGIA INOVA SIMPLES (I.S.)
          </p>
          <p className="text-xs text-foreground/70">CNPJ: 63.122.894/0001-02</p>
          <p className="text-xs text-foreground/70">
            © {new Date().getFullYear()} Todos os direitos reservados.
          </p>
        </div>
        {/* Coluna 2: Navegação Principal */}
        {/* Adiciona md:basis-1/3 */}
        <nav className="space-y-2 flex flex-col items-center md:items-start text-center md:text-left md:basis-1/3">
          <h4 className="font-semibold text-foreground mb-3">Navegação</h4>
          <ul className="space-y-1 text-sm text-foreground/80">
            <li>
              <Link href="/" className="hover:text-primary hover:underline">
                Início
              </Link>
            </li>
            <li>
              <Link
                href="/imoveis/para-alugar"
                className="hover:text-primary hover:underline"
              >
                Buscar Imóveis
              </Link>
            </li>
            <li>
              <Link
                href="/ajuda"
                className="hover:text-primary hover:underline"
              >
                Central de Ajuda
              </Link>
            </li>
          </ul>
        </nav>
        {/* Coluna 3: Links Legais e Contato */}
        {/* Adiciona md:basis-1/3 */}
        <nav className="space-y-2 flex flex-col items-center md:items-start text-center md:text-left md:basis-1/3">
          <h4 className="font-semibold text-foreground mb-3">Legal</h4>
          <ul className="space-y-1 text-sm text-foreground/80">
            <li>
              <Link
                href="/termos-de-uso"
                className="hover:text-primary hover:underline"
              >
                Termos de uso
              </Link>
            </li>
            <li>
              <Link
                href="/politica-de-privacidade"
                className="hover:text-primary hover:underline"
              >
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link
                href="/ajuda#contato"
                className="hover:text-primary hover:underline"
              >
                Contato
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
