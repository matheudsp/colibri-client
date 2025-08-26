import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 w-full">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500 text-center md:text-left">
          © {new Date().getFullYear()} Sistema Colibri. Todos os direitos
          reservados.
        </p>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <Link href="/termos" className="hover:text-primary hover:underline">
            Termos de uso
          </Link>
          <span className="text-gray-300">·</span>
          <Link
            href="/privacidade"
            className="hover:text-primary hover:underline"
          >
            Política de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
