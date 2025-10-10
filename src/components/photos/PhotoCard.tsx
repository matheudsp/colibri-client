"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Photo } from "@/interfaces/photo";

export interface PhotoCardProps {
  photo: Photo;
  allPhotos: Photo[];
  propertyTitle: string;
  onDelete: () => void;
}

export function PhotoCard({
  photo,
  allPhotos,
  propertyTitle,
  onDelete,
}: PhotoCardProps) {
  const isCover = allPhotos.indexOf(photo) === 0;

  return (
    <div className="relative aspect-square group block border-2 border-border rounded-lg cursor-pointer overflow-hidden">
      <Image
        src={photo.tempUrl || photo.url || "/placeholder.png"}
        alt={`Foto de ${propertyTitle}`}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          type="button"
          className="p-2 rounded-full bg-red-600/80 text-white hover:bg-red-700 transition-colors"
          title="Excluir foto"
        >
          <Trash2 size={18} />
        </button>
      </div>
      {isCover && (
        <div
          className="absolute top-2 left-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded"
          title="Esta é a foto de capa do anúncio"
        >
          CAPA
        </div>
      )}
    </div>
  );
}
