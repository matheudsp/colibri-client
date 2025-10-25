"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { PlusIcon, Loader2 } from "lucide-react";
import { Photo } from "@/interfaces/photo";
import { PropertyProps } from "@/interfaces/property";
import { PhotoService } from "@/services/domains/photoService";
import { extractAxiosError } from "@/services/api";
import { PhotoCard } from "@/components/photos/PhotoCard";
import { AddPhotoModal } from "@/components/modals/photoModals/AddPhotoModal";
import { DeletePhotoModal } from "@/components/modals/photoModals/DeletePhotoModal";

interface PropertyPhotoManagerProps {
  // Para modo de EDIÇÃO
  property?: PropertyProps;
  onPhotoListUpdate?: (updatedPhotos: Photo[]) => void;

  // Para modo de CRIAÇÃO
  onFilesChange?: (files: File[]) => void;

  isSubmitting: boolean;
  propertyTitle: string;
}

export function PropertyPhotoManager({
  property,
  onPhotoListUpdate,
  onFilesChange,
  isSubmitting,
  propertyTitle,
}: PropertyPhotoManagerProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isAddPhotoModalOpen, setIsAddPhotoModalOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);

  const isEditMode = !!property?.id;

  useEffect(() => {
    if (isEditMode && property.photos) {
      setPhotos(property.photos);
    }
  }, [property, isEditMode]);

  useEffect(() => {
    // Para modo CRIAÇÃO, notifica o pai sobre a lista de arquivos
    if (!isEditMode) {
      const files = photos.map((p) => p.file).filter((f): f is File => !!f);
      onFilesChange?.(files);
    }
  }, [photos, isEditMode, onFilesChange]);

  const handlePhotosAdded = useCallback(
    async (newFiles: File[]) => {
      if (newFiles.length === 0) return;

      // MODO EDIÇÃO: Faz o upload imediatamente
      if (isEditMode) {
        const promise = PhotoService.upload(property.id, newFiles);
        toast.promise(promise, {
          loading: `Enviando ${newFiles.length} foto(s)...`,
          success: (response) => {
            const uploadedPhotos = response.data;
            const newPhotoList = [...photos, ...uploadedPhotos];
            setPhotos(newPhotoList);
            onPhotoListUpdate?.(newPhotoList);
            setIsAddPhotoModalOpen(false);
            return "Foto(s) enviada(s) com sucesso.";
          },
          error: (error) => `Falha no upload: ${extractAxiosError(error)}`,
        });
      }
      // MODO CRIAÇÃO: Adiciona localmente
      else {
        const newPhotos: Photo[] = newFiles.map((file) => ({
          file,
          tempUrl: URL.createObjectURL(file),
        }));
        setPhotos((prev) => [...prev, ...newPhotos]);
        setIsAddPhotoModalOpen(false);
      }
    },
    [isEditMode, property?.id, photos, onPhotoListUpdate]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!photoToDelete) return;

    // MODO EDIÇÃO: Deleta via API
    if (isEditMode && photoToDelete.id) {
      const promise = PhotoService.delete(photoToDelete.id);
      toast.promise(promise, {
        loading: "Excluindo foto...",
        success: () => {
          const newPhotoList = photos.filter((p) => p.id !== photoToDelete.id);
          setPhotos(newPhotoList);
          onPhotoListUpdate?.(newPhotoList);
          setPhotoToDelete(null);
          return "Foto excluída com sucesso.";
        },
        error: (err) => `Falha ao excluir: ${extractAxiosError(err)}`,
      });
    }
    // MODO CRIAÇÃO: Deleta localmente
    else {
      setPhotos((prev) =>
        prev.filter((p) => {
          if (p.id === photoToDelete.id && p.tempUrl) {
            URL.revokeObjectURL(p.tempUrl);
          }
          return p.id !== photoToDelete.id;
        })
      );
      toast.success("Foto removida da seleção.");
      setPhotoToDelete(null);
    }
  }, [photoToDelete, isEditMode, photos, onPhotoListUpdate]);

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 border-b border-border pb-2">
          Fotos do Imóvel
        </h2>
        <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {photos.map((photo) => (
            <PhotoCard
              key={photo.id || photo.tempUrl}
              photo={photo}
              allPhotos={photos}
              propertyTitle={propertyTitle || ""}
              onDelete={() => setPhotoToDelete(photo)}
            />
          ))}
          <button
            type="button"
            onClick={() => setIsAddPhotoModalOpen(true)}
            className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-lg border-border text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            title="Adicionar nova foto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <PlusIcon className="w-8 h-8 sm:w-10 sm:h-10" />
            )}
            <span className="text-xs sm:text-sm mt-1">Adicionar</span>
          </button>
        </div>
      </div>

      <AddPhotoModal
        isOpen={isAddPhotoModalOpen}
        onClose={() => setIsAddPhotoModalOpen(false)}
        onPhotosAdded={handlePhotosAdded}
        isLoading={isSubmitting}
      />

      {photoToDelete && (
        <DeletePhotoModal
          isOpen={!!photoToDelete}
          onClose={() => setPhotoToDelete(null)}
          onConfirm={handleConfirmDelete}
          isLoading={isSubmitting}
        />
      )}
    </>
  );
}
