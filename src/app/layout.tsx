import type { Metadata } from "next";
import { Open_Sans, Montserrat, Poppins } from "next/font/google";
import "../styles/globals.css";
import { Toaster } from "sonner";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";

const openSans = Open_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Locaterra - Gestão de Aluguéis Simplificada",
    template: "%s | Locaterra",
  },
  description:
    "Encontre imóveis para alugar ou anuncie o seu com facilidade. A Locaterra oferece um fluxo 100% digital para contratos, pagamentos e gestão de aluguéis.",
  icons: "/logo/icon/favicon.ico",
  openGraph: {
    title: "Locaterra - Gestão de Aluguéis Simplificada",
    description: "Aluguel de imóveis de forma rápida, digital e segura.",
    url: "https://www.locaterra.com.br",
    siteName: "Locaterra",
    images: [
      {
        url: "images/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  keywords: [
    "aluguel de imóveis",
    "gestão de aluguel",
    "contrato digital",
    "anunciar imóvel",
    "procurar apartamento",
  ],
  authors: [{ name: "Locaterra" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={`${openSans.className} ${montserrat.className} ${poppins.className} font-poppins antialiased flex  `}
      >
        <ReactQueryProvider>
          <div className="flex flex-col min-h-screen w-full">
            <main className="grow">{children}</main>
          </div>
          <Toaster richColors position="bottom-center" />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
