import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LightboxImage {
  src: string;
  alt?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
}

export const Lightbox = ({ images, initialIndex = 0, open, onClose }: LightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;

  const resetTransforms = () => {
    setScale(1);
    setRotation(0);
  };

  const goNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((i) => i + 1);
      resetTransforms();
    }
  }, [currentIndex, images.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      resetTransforms();
    }
  }, [currentIndex]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') setScale((s) => Math.min(s + 0.25, 3));
      if (e.key === '-') setScale((s) => Math.max(s - 0.25, 0.5));
      if (e.key === 'r') setRotation((r) => r + 90);
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    },
    [onClose, goNext, goPrev]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setCurrentIndex(initialIndex);
      resetTransforms();
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown, initialIndex]);

  const zoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((s) => Math.min(s + 0.25, 3));
  };

  const zoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((s) => Math.max(s - 0.25, 0.5));
  };

  const rotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotation((r) => r + 90);
  };

  return (
    <AnimatePresence>
      {open && currentImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />

          {/* Controls */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={zoomOut}
            >
              <ZoomOut className="w-5 h-5" />
            </Button>
            <span className="text-white text-sm font-medium min-w-[4rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={zoomIn}
            >
              <ZoomIn className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={rotate}
            >
              <RotateCw className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20 ml-2"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Navigation Arrows */}
          {hasMultiple && (
            <>
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 w-12 h-12",
                  currentIndex === 0 && "opacity-30 cursor-not-allowed"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 w-12 h-12",
                  currentIndex === images.length - 1 && "opacity-30 cursor-not-allowed"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                disabled={currentIndex === images.length - 1}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          {hasMultiple && (
            <div className="absolute top-4 left-4 z-10">
              <span className="text-white/80 text-sm bg-black/50 px-3 py-1.5 rounded-full">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
          )}

          {/* Main Image */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-[85vw] max-h-[75vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.src}
              alt={currentImage.alt || 'Image'}
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transition: 'transform 0.2s ease-out',
              }}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              draggable={false}
            />
          </motion.div>

          {/* Image title */}
          {currentImage.alt && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
              <p className="text-white/80 text-sm bg-black/50 px-4 py-2 rounded-full max-w-md truncate">
                {currentImage.alt}
              </p>
            </div>
          )}

          {/* Thumbnail Strip */}
          {hasMultiple && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 p-2 bg-black/60 rounded-xl max-w-[90vw] overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                    resetTransforms();
                  }}
                  className={cn(
                    "relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200",
                    currentIndex === index
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-black/60 scale-105"
                      : "opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={img.src}
                    alt={img.alt || `Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Keyboard hints */}
          <div className="absolute bottom-4 right-4 z-10 text-white/40 text-xs space-y-0.5 hidden md:block">
            <p>ESC close • +/- zoom • R rotate</p>
            {hasMultiple && <p>← → navigate</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
