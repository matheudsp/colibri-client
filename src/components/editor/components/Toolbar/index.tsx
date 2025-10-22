"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  // Heading1,
  // Heading2,
  // List,
  // ListOrdered,
  // Strikethrough,
  // Code,
  // Quote,
  Undo,
  Redo,
  RemoveFormatting,
  Eye,
  Edit3,
} from "lucide-react";
import { CustomButton } from "@/components/forms/CustomButton";
import { cn } from "@/lib/utils";

import { Tooltip } from "@/components/common/Tooltip";

interface ToolbarProps {
  editor: Editor | null;
  parseVariables: boolean;
  onToggleParseVariables: () => void;
}

/**
 * Um botão individual da barra de ferramentas.
 */
const ToolbarButton = ({
  onClick,
  disabled,
  isActive,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  isActive: boolean;
  children: React.ReactNode;
}) => (
  <CustomButton
    type="button"
    ghost
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "h-8 w-8 p-0",
      isActive ? "bg-accent text-accent-foreground" : ""
    )}
  >
    {children}
  </CustomButton>
);

/**
 * Divisor visual para a barra de ferramentas
 */
const Divider = () => <div className="w-px h-5 bg-border mx-1" />;

export const Toolbar = ({
  editor,
  parseVariables,
  onToggleParseVariables,
}: ToolbarProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="sticky md:top-0 top-16 z-20 bg-card/90 backdrop-blur-xs p-2 flex flex-wrap items-center gap-1 border-b border-t border-x border-border ">
      {/* --- Grupo de Histórico --- */}
      <Tooltip content="Desfazer (Ctrl+Z)" position="bottom">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          isActive={false}
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
      </Tooltip>
      <Tooltip content="Refazer (Ctrl+Y)" position="bottom">
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          isActive={false}
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </Tooltip>

      <Divider />

      {/* --- Grupo de Títulos --- */}
      {/* <Tooltip content="Título 1" position="bottom">
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          disabled={
            !editor.can().chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
      </Tooltip>
      <Tooltip content="Título 2" position="bottom">
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          disabled={
            !editor.can().chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
      </Tooltip>

      <Divider /> */}

      {/* --- Grupo de Estilos de Texto --- */}
      <Tooltip content="Negrito (Ctrl+B)" position="bottom">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
      </Tooltip>
      <Tooltip content="Itálico (Ctrl+I)" position="bottom">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
      </Tooltip>
      <Tooltip content="Sublinhado (Ctrl+U)" position="bottom">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
        >
          <Underline className="h-4 w-4" />
        </ToolbarButton>
      </Tooltip>
      {/* <Tooltip content="Tachado" position="bottom">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
      </Tooltip> */}

      <Divider />

      {/* --- Grupo de Listas e Blocos --- */}
      {/* <Tooltip content="Lista com marcadores" position="bottom">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={!editor.can().chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
      </Tooltip>
      <Tooltip content="Lista numerada">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={!editor.can().chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
      </Tooltip>

      <Divider /> */}

      {/* --- Grupo de Limpeza --- */}
      <Tooltip content="Limpar formatação" position="bottom">
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          disabled={!editor.can().chain().focus().unsetAllMarks().run()}
          isActive={false}
        >
          <RemoveFormatting className="h-4 w-4" />
        </ToolbarButton>
      </Tooltip>

      {/* --- Botão de Preview --- */}
      <div className="ml-auto">
        <Tooltip
          content={
            parseVariables ? "Voltar ao modo de edição" : "Pré-visualizar "
          }
          position="bottom"
        >
          {/* O seu componente Tooltip.tsx envolve os children num div, 
              o que é perfeito e não quebra o layout do flex. */}
          <CustomButton
            onClick={onToggleParseVariables}
            className={`min-w-[160px] text-sm ${
              parseVariables
                ? "bg-secondary border-1 border-border"
                : "bg-transparent border-1 border-border"
            }`}
            color={`${parseVariables ? "" : ""}`}
            textColor={`${parseVariables ? "text-white" : "text-foreground"}`}
          >
            {parseVariables ? (
              <div className="animate-flip-down animate-once  animate-duration-300 animate-ease-out flex items-center justify-center gap-1">
                <Edit3 className="h-4 w-4" /> Voltar à Edição
              </div>
            ) : (
              <div className="animate-flip-up animate-once animate-duration-300 animate-ease-out flex items-center justify-center gap-1">
                <Eye className="h-4 w-4 " />
                Pré-visualizar
              </div>
            )}
          </CustomButton>
        </Tooltip>
      </div>
    </div>
  );
};
