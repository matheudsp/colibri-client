import type { Metadata } from "next";

import termsJson from "./terms.json";
import type { JSX } from "react";

export const metadata: Metadata = {
  title: "Termos de Uso - Locaterra",
  description:
    "Termos e condições de uso da plataforma Locaterra para locadores e locatários.",
  openGraph: {
    title: "Termos de Uso - Locaterra",
    description:
      "Termos e condições de uso da plataforma Locaterra para locadores e locatários.",
    url: "https://www.locaterra.com.br/termos-de-uso",
    siteName: "Locaterra",
    locale: "pt_BR",
    type: "website",
  },
};

type TermSection = {
  id?: string;
  title?: string;
  content?: string | string[];
  subsections?: TermSection[];
};

const slugify = (s = "") =>
  s
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function flattenToToc(sections: TermSection[]) {
  const toc: { id: string; title: string }[] = [];

  function walk(items: TermSection[]) {
    for (const item of items) {
      const id = item.id ?? slugify(item.title ?? "sec");
      toc.push({ id, title: item.title ?? "Sem título" });
      if (item.subsections && item.subsections.length) walk(item.subsections);
    }
  }

  walk(sections);
  return toc;
}

function SectionRenderer({
  section,
  depth = 2,
}: {
  section: TermSection;
  depth?: number;
}) {
  const Tag = `h${Math.min(
    depth,
    6
  )}` as unknown as keyof JSX.IntrinsicElements;
  const id = section.id ?? slugify(section.title ?? "sec");

  return (
    <section id={id} className="mt-6">
      {section.title && (
        <Tag
          className={`text-${Math.min(
            2 + depth,
            3
          )}xl font-semibold text-start mb-4`}
        >
          {section.title}
        </Tag>
      )}

      {section.content &&
        (Array.isArray(section.content) ? (
          section.content.map((p, i) => (
            <p key={i} className="text-justify break-words mt-2">
              {p}
            </p>
          ))
        ) : (
          <p className="text-justify break-words mt-2">{section.content}</p>
        ))}

      {section.subsections && section.subsections.length > 0 && (
        <div className="pl-4 border-l border-border mt-4">
          {section.subsections.map((sub, i) => (
            <SectionRenderer
              key={sub.id ?? i}
              section={sub}
              depth={Math.min(depth + 1, 6)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function TermosDeUsoPage() {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const sections: TermSection[] = Array.isArray(termsJson)
    ? termsJson
    : (termsJson as any).sections ?? [];

  const toc = flattenToToc(sections);

  return (
    <main className="max-w-3xl mx-auto py-32 px-4 prose prose-zinc space-y-5">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-start">
          Termos de Uso e Condições Gerais da Plataforma Locaterra
        </h1>
        <p className="text-sm text-zinc-600">
          Última atualização: 1 de novembro de 2025
        </p>
      </div>

      <nav className="not-prose bg-zinc-100 p-4 rounded-md border border-border mb-6">
        <h2 className="text-lg font-semibold text-center mb-4">Índice</h2>
        <ul className="list-disc pl-5 mt-2 space-y-2 text-sm">
          {toc.map((t) => (
            <li key={t.id} className="hover:text-secondary-hover underline">
              <a href={`#${t.id}`}>{t.title}</a>
            </li>
          ))}
        </ul>
      </nav>

      {sections.map((s, i) => (
        <SectionRenderer key={s.id ?? i} section={s} depth={2} />
      ))}

      <section id="contato">
        <h2 className="text-lg font-semibold text-start mb-4">Contato</h2>
        <p className="text-justify break-words">
          Em caso de dúvidas, solicitações ou comunicações relacionadas a estes
          Termos, entre em contato conosco pelo e-mail:{" "}
          <a
            href="mailto:atendimentoaocliente.locaterra@gmail.com"
            className="break-all text-primary-hover underline"
          >
            atendimentoaocliente.locaterra@gmail.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
