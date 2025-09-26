import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full h-20 ">
      <div className="max-w-7xl border-t h-full border-gray-200 mx-auto py-6 px-4 xl:px-0 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500 text-center md:text-left">
          © {new Date().getFullYear()} Sistema Colibri. Todos os direitos
          reservados.
        </p>
        <div className="flex items-center text-center gap-6 pb-10 md:pb-0 text-sm text-gray-500">
          <Link
            href="/termos-de-uso"
            className="hover:text-primary hover:underline"
          >
            Termos de uso
          </Link>
          <span className="text-gray-300">·</span>
          <Link
            href="/politica-de-privacidade"
            className="hover:text-primary hover:underline"
          >
            Política de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
