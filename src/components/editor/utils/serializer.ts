import type { VariableOptionNode } from "@/types/editor";
import type { Editor } from "@tiptap/react";

export function preprocessContent(content: string | undefined): string {
  if (!content) {
    return "";
  }
  const regex = /{{\s*([^{}\s]+)\s*}}/g;
  return content.replace(
    regex,
    (match, path) =>
      `<variable-component id="${path}" label="${path}"></variable-component>`
  );
}

/**
 * Converte o HTML serializado do Tiptap (com <variable-component...>)
 * de volta para o formato Handlebars (com {{...}}) que o backend espera.
 */
export function serializeContentForBackend(html: string): string {
  const regex =
    /<variable-component[^>]*data-id="([^"]+)"[^>]*><\/variable-component>/g;

  return html.replace(regex, (match, id) => {
    return `{{${id}}}`;
  });
}

/**
 * Pega o conteúdo atual do editor, serializa para o formato Handlebars
 * e inicia o download de um arquivo .html.
 */
export function exportHtmlFile(editor: Editor) {
  const rawHtml = editor.getHTML();
  const contentForBackend = serializeContentForBackend(rawHtml);
  const blob = new Blob([contentForBackend], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "template.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

/**
 * Converte um objeto de dados aninhado (como o templateData da sua API)
 * em uma estrutura de árvore (VariableOptionNode[]) para o popup do Tiptap.
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */
export function convertDataToOptions(
  data: Record<string, any> | undefined,
  parentId: string = ""
): VariableOptionNode[] {
  if (!data || typeof data !== "object") {
    return [];
  }

  return Object.keys(data).map((key) => {
    const id = parentId ? `${parentId}.${key}` : key;
    const value = data[key];

    // Considera que é um "nó pai" se for um objeto, mas não um array
    const hasChildren =
      value && typeof value === "object" && !Array.isArray(value);

    return {
      id: id,
      label: key,
      children: hasChildren ? convertDataToOptions(value, id) : undefined,
    };
  });
}
