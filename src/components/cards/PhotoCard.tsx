"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 as TrashIcon, Eye as EyeIcon } from "lucide-react";
import { Photo } from "../../interfaces/photo";
import { DeletePhotoModal } from "../modals/photoModals/DeletePhotoModal";
import { PhotoViewModal } from "../modals/photoModals/PhotoViewModal";
import { toast } from "sonner";

interface PhotoCardProps {
  photo: Photo;
  allPhotos: Photo[];
  propertyTitle: string;
  onDelete: (id: string) => Promise<void>;
}

export function PhotoCard({
  photo,
  allPhotos,
  propertyTitle,
  onDelete,
}: PhotoCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!photo.id) return;
    setIsLoading(true);
    try {
      await onDelete(photo.id);
    } catch (_error) {
      toast.error("Falha ao deletar foto.", {
        description: (_error as Error).message,
      });
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const initialIndex = allPhotos.findIndex((p) => p.id === photo.id);

  return (
    <>
      <div className="relative aspect-square group block border-2 rounded-lg cursor-pointer overflow-hidden">
        <Image
          src={photo.tempUrl || photo.filePath || "/placeholder.png"}
          alt="Preview do imóvel"
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setShowViewModal(true)}
            className="p-3 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-200"
            title="Visualizar foto"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="absolute top-2 right-2 p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full transition-all duration-200"
          title="Deletar foto"
        >
          <TrashIcon className="w-4 h-4" />
        </button>

        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <DeletePhotoModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />

      <PhotoViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        photos={allPhotos}
        altText={propertyTitle}
        initialIndex={initialIndex}
      />
    </>
  );
}
