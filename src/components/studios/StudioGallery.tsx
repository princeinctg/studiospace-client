"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface StudioGalleryProps {
  images: string[];
  title: string;
}

export function StudioGallery({ images, title }: StudioGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages = images.length > 0
    ? images
    : ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=85"];

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden bg-muted p-1 border border-border">
        {/* Main Hero Shot */}
        <div
          onClick={() => openLightbox(0)}
          className="relative md:col-span-2 aspect-[4/3] md:aspect-auto md:h-[460px] cursor-pointer group overflow-hidden rounded-2xl"
        >
          <Image
            src={displayImages[0]}
            alt={`${title} - Primary Preview`}
            fill
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg">
              <Maximize2 className="h-4 w-4" />
              <span>View Fullscreen</span>
            </span>
          </div>
        </div>

        {/* Supporting Thumbnails */}
        <div className="md:col-span-2 grid grid-cols-2 gap-3 h-full">
          {displayImages.slice(1, 5).map((img, i) => (
            <div
              key={i}
              onClick={() => openLightbox(i + 1)}
              className="relative h-[225px] cursor-pointer group overflow-hidden rounded-2xl bg-muted"
            >
              <Image
                src={img}
                alt={`${title} - Gallery Image ${i + 2}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize2 className="h-5 w-5 text-white" />
              </div>

              {/* Show "+X more photos" on the last cell */}
              {i === 3 && displayImages.length > 5 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white font-bold text-sm">
                  +{displayImages.length - 5} More Photos
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-10 select-none"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation arrows */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Active Image Container */}
            <div className="relative w-full max-w-5xl h-[75vh]">
              <Image
                src={displayImages[selectedIndex]}
                alt={`${title} - Lightbox Photo`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {/* Footer index counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-mono">
              {selectedIndex + 1} of {displayImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
