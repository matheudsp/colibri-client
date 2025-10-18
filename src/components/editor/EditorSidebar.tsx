"use client";

import { useMemo } from "react";
import { Clipboard } from "lucide-react";
import { toast } from "sonner";
import { HeadlessTabs } from "@/components/ui/HeadlessTabs";
import {
  contractTemplateVariables,
  groupVariables,
} from "@/constants/contractTemplateVariables";

interface EditorSidebarProps {
  previewHtml: string;
  templateData: Record<string, any>;
}

const SuggestionItem = ({ tag, label }: { tag: string; label: string }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(tag);
    toast.success(`'${tag}' copiado para a área de transferência!`);
  };

  return (
    <div
      className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer"
      onClick={handleCopy}
    >
      <div>
        <div className="text-sm font-mono text-blue-600">{tag}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
      <Clipboard className="w-4 h-4 text-gray-400" />
    </div>
  );
};

export function EditorSidebar({
  previewHtml,
  templateData,
}: EditorSidebarProps) {
  const availableGroupedVariables = useMemo(() => {
    const availableTags = new Set<string>();

    Object.keys(templateData).forEach((key) => {
      if (typeof templateData[key] === "object" && templateData[key] !== null) {
        Object.keys(templateData[key]).forEach((subKey) => {
          availableTags.add(`${key}.${subKey}`);
        });
      } else {
        availableTags.add(key);
      }
    });

    const filtered = contractTemplateVariables.filter((variable) => {
      const cleanTag = variable.tag.replace(/[{}]/g, "").trim();
      return availableTags.has(cleanTag);
    });

    return groupVariables(filtered);
  }, [templateData]);

  const tabs = [
    {
      title: "Preview",
      content: (
        <div
          className="p-4 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      ),
    },
    {
      title: "Variáveis",
      content: (
        <div className="p-2 space-y-4">
          <p className="text-xs text-gray-500 px-2">
            Clique para copiar e cole no editor. Elas serão substituídas
            automaticamente no preview.
          </p>
          {Object.entries(availableGroupedVariables).map(
            ([category, items]) => (
              <div key={category}>
                <h4 className="font-bold text-sm text-gray-700 mb-2 px-2">
                  {category}
                </h4>
                <div className="space-y-1">
                  {items.map((item) => (
                    <SuggestionItem
                      key={item.tag}
                      tag={item.tag}
                      label={item.label}
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="h-full flex flex-col border border-border rounded-md p-2 bg-gray-100">
      <HeadlessTabs tabs={tabs} />
    </div>
  );
}
