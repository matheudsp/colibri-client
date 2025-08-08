"use client";

import { useState, useRef, ReactNode, DragEvent } from "react";

interface FileInputProps {
  id: string;
  label: string;
  icon: ReactNode;
  onFilesSelected: (files: FileList) => void;
  disabled?: boolean;
  multiple?: boolean;
}

export const CustomFileInput = ({
  id,
  label,
  icon,
  onFilesSelected,
  disabled = false,
  multiple = false,
}: FileInputProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // A função handleAreaClick foi removida, pois não é mais necessária.

  // Manipula a seleção de arquivos através da janela de diálogo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  // --- Lógica para Arrastar e Soltar (Drag and Drop) ---

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFilesSelected(files);
    }
  };

  // Classes dinâmicas para feedback visual
  const containerClasses = `
    flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg 
    transition-colors duration-200 ease-in-out
    ${
      disabled
        ? "bg-muted/50 cursor-not-allowed opacity-60"
        : "bg-background hover:bg-muted/30 cursor-pointer"
    }
    ${isDragging ? "border-primary" : "border-muted-foreground/30"}
  `;

  return (
    <label
      htmlFor={id}
      className={containerClasses}
      // O onClick foi removido daqui
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center text-center pointer-events-none">
        {icon}
        <p className="mt-2 text-sm text-muted-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">
          Imagens (PNG, JPG, etc.)
        </p>
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
        multiple={multiple}
        accept="image/*"
      />
    </label>
  );
};
