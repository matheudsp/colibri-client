"use client";

import { useState } from "react";
import Image from "next/image";
import { Home, Expand, ChevronLeft, ChevronRight } from "lucide-react";
import { Photo } from "@/interfaces/photo";
import { PhotoViewModal } from "@/components/modals/photoModals/PhotoViewModal";

interface PropertyGalleryProps {
  photos: Photo[];
  altText: string;
}

export function PropertyGallery({ photos, altText }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  if (!photos || photos.length === 0) {
    return (
      <div
        className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-gray-400"
        role="img"
        aria-label="Sem fotos disponíveis"
      >
        <Home size={64} aria-hidden="true" />
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];

  return (
    <>
      <div
        className="relative w-full aspect-video"
        role="region"
        aria-label="Galeria de Fotos"
      >
        <div
          className="relative w-full h-full cursor-pointer group"
          onClick={openModal}
        >
          <Image
            src={currentPhoto.signedUrl!}
            alt={`${altText} - Foto ${currentIndex + 1}`}
            fill
            className="object-cover rounded-lg"
            priority={currentIndex === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
            <Expand className="text-white w-10 h-10 opacity-0 group-hover:opacity-75 transition-opacity" />
          </div>
        </div>

        {photos.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              aria-label="Foto anterior"
              className="absolute top-1/2 left-2 -translate-y-1/2 p-2 bg-black/40 rounded-full text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white transition-all"
            >
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
            <button
              onClick={goToNext}
              aria-label="Próxima foto"
              className="absolute top-1/2 right-2 -translate-y-1/2 p-2 bg-black/40 rounded-full text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white transition-all"
            >
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          </>
        )}

        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {currentIndex + 1} / {photos.length}
        </div>
      </div>

      <div className="hidden md:flex gap-2 mt-2">
        {photos.slice(0, 5).map((photo, index) => (
          <div
            key={photo.id}
            className={`w-1/5 cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
              currentIndex === index ? "border-primary" : "border-transparent"
            }`}
            onClick={() => setCurrentIndex(index)}
          >
            <Image
              src={photo.signedUrl!}
              alt={`Miniatura ${index + 1}`}
              width={100}
              height={75}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>

      <PhotoViewModal
        isOpen={isModalOpen}
        onClose={closeModal}
        photoId={currentPhoto.id}
      />
    </>
  );
}
