"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold,
  // Strikethrough,
  Italic,
  List,
  ListOrdered,
  // Heading2,
  Underline,
  // Quote,
  // Undo,
  // Redo,
  // Code,
} from "lucide-react";

type Props = {
  editor: Editor | null;
};

export function Toolbar({ editor }: Props) {
  if (!editor) {
    return null;
  }

  return (
    <div className="border  border-border bg-transparent rounded-md p-2 flex items-center gap-1 flex-wrap">
      {/* Botões de formatação */}
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={`p-2 rounded-lg hover:bg-gray-200 ${
          editor.isActive("bold") ? "bg-gray-300" : ""
        }`}
        title="Negrito"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={`p-2 rounded-lg hover:bg-gray-200 ${
          editor.isActive("italic") ? "bg-gray-300" : ""
        }`}
        title="Itálico"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }}
        className={`p-2 rounded-lg hover:bg-gray-200 ${
          editor.isActive("underline") ? "bg-gray-300" : ""
        }`}
        title="Sublinhado"
      >
        <Underline className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        className={`p-2 rounded-lg hover:bg-gray-200 ${
          editor.isActive("bulletList") ? "bg-gray-300" : ""
        }`}
        title="Lista"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={`p-2 rounded-lg hover:bg-gray-200 ${
          editor.isActive("orderedList") ? "bg-gray-300" : ""
        }`}
        title="Lista Ordenada"
      >
        <ListOrdered className="h-4 w-4" />
      </button>
    </div>
  );
}
