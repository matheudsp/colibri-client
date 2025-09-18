"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  XIcon,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { Photo } from "@/interfaces/photo";

interface PhotoViewModalProps {
  photos: Photo[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  altText: string;
}

export function PhotoViewModal({
  photos,
  initialIndex = 0,
  isOpen,
  onClose,
  altText,
}: PhotoViewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const changeImage = useCallback(
    (newDirection: number) => {
      if (!photos || photos.length === 0) return;
      if (newDirection > 0) {
        setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
      } else {
        setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
      }
    },
    [photos]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight") changeImage(1);
      else if (e.key === "ArrowLeft") changeImage(-1);
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, changeImage, onClose]);

  if (!photos || photos.length === 0) {
    return null;
  }

  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) =>
    setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) changeImage(1);
    else if (distance < -minSwipeDistance) changeImage(-1);
  };

  const fadeVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const currentPhoto = photos[currentIndex];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/90"
        />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel
            className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center focus:outline-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full h-full"
              >
                {currentPhoto?.url ? (
                  <Image
                    src={currentPhoto.url}
                    alt={`Foto ${currentIndex + 1} de ${altText}`}
                    fill
                    className="object-contain "
                    unoptimized={true}
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <Loader2 className="animate-spin h-12 w-12" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Controles da UI */}
            <button
              title="Fechar modal"
              onClick={onClose}
              className="absolute right-0 -top-8 sm:right-4 sm:top-4 z-20 rounded-full bg-black/50 p-2 text-white hover:bg-black/75"
            >
              <XIcon className="h-6 w-6" />
            </button>

            {photos.length > 1 && (
              <>
                <button
                  title="Foto anterior"
                  onClick={() => changeImage(-1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/50 p-2 text-white hover:bg-black/75"
                >
                  <ChevronLeft className="h-7 w-7" />
                </button>
                <button
                  title="Próxima foto"
                  onClick={() => changeImage(1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/50 p-2 text-white hover:bg-black/75"
                >
                  <ChevronRight className="h-7 w-7" />
                </button>
              </>
            )}

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 bg-black/50 text-white text-sm font-semibold px-3 py-1.5 rounded-full flex items-center gap-2">
              <ImageIcon size={16} />
              <span>
                {currentIndex + 1} / {photos.length}
              </span>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
