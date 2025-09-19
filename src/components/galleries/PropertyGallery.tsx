"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion"; // 1. Importar o tipo 'Variants'
import {
  Home,
  Expand,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import { Photo } from "@/interfaces/photo";
import { PhotoViewModal } from "@/components/modals/photoModals/PhotoViewModal";
import clsx from "clsx";

interface PropertyGalleryProps {
  photos: Photo[];
  altText: string;
}

export function PropertyGallery({ photos, altText }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const changeImage = (newIndex: number, newDirection: number) => {
    if (newIndex === currentIndex) return;

    setDirection(newDirection);
    setCurrentIndex(newIndex);

    const thumbnail = thumbnailContainerRef.current?.children[
      newIndex
    ] as HTMLElement;
    if (thumbnail) {
      thumbnail.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
    changeImage(newIndex, -1);
  };

  const goToNext = () => {
    const newIndex = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
    changeImage(newIndex, 1);
  };

  const slideVariants: Variants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
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

  return (
    <>
      <div
        className="relative w-full aspect-video overflow-hidden rounded-lg bg-gray-100"
        role="region"
        aria-label="Galeria de Fotos"
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute w-full h-full cursor-pointer group"
            onClick={openModal}
          >
            <Image
              src={photos[currentIndex].url!}
              alt={`${altText} - Foto ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority={currentIndex === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <Expand className="text-white w-10 h-10 opacity-0 group-hover:opacity-75 transition-opacity" />
            </div>
          </motion.div>
        </AnimatePresence>

        {photos.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              aria-label="Foto anterior"
              className="absolute top-1/2 left-2 -translate-y-1/2 z-10 p-2 bg-black/40 rounded-full text-white hover:bg-black/60 focus:outline-hidden focus:ring-2 focus:ring-white transition-all"
            >
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
            <button
              onClick={goToNext}
              aria-label="Próxima foto"
              className="absolute top-1/2 right-2 -translate-y-1/2 z-10 p-2 bg-black/40 rounded-full text-white hover:bg-black/60 focus:outline-hidden focus:ring-2 focus:ring-white transition-all"
            >
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          </>
        )}

        <div className="absolute bottom-2 right-2 z-10 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
          <ImageIcon size={14} />
          <span>
            {currentIndex + 1} / {photos.length}
          </span>
        </div>
      </div>

      {photos.length > 1 && (
        <div
          ref={thumbnailContainerRef}
          className="w-full flex gap-2 mt-3 overflow-x-auto pb-2"
        >
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={clsx(
                "w-2/5 max-w-28 shrink-0 cursor-pointer rounded-md overflow-hidden border-2 transition-all",
                currentIndex === index
                  ? "border-primary"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
              onClick={() => changeImage(index, index > currentIndex ? 1 : -1)}
            >
              <Image
                src={photo.url!}
                alt={`Miniatura ${index + 1}`}
                width={100}
                height={75}
                className="object-cover w-full h-full aspect-video"
              />
            </div>
          ))}
        </div>
      )}

      <PhotoViewModal
        isOpen={isModalOpen}
        onClose={closeModal}
        photos={photos}
        initialIndex={currentIndex}
        altText={altText}
      />
    </>
  );
}
