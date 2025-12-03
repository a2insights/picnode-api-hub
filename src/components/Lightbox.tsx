import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface LightboxProps {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
}

export const Lightbox = ({ src, alt, open, onClose }: LightboxProps) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') setScale((s) => Math.min(s + 0.25, 3));
      if (e.key === '-') setScale((s) => Math.max(s - 0.25, 0.5));
      if (e.key === 'r') setRotation((r) => r + 90);
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  // Reset transforms when opening
  useEffect(() => {
    if (open) {
      setScale(1);
      setRotation(0);
    }
  }, [open]);

  const zoomIn = () => setScale((s) => Math.min(s + 0.25, 3));
  const zoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));
  const rotate = () => setRotation((r) => r + 90);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />

          {/* Controls */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                zoomOut();
              }}
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
              onClick={(e) => {
                e.stopPropagation();
                zoomIn();
              }}
            >
              <ZoomIn className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                rotate();
              }}
            >
              <RotateCw className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20 ml-2"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Image title */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
            <p className="text-white/80 text-sm bg-black/50 px-4 py-2 rounded-full">
              {alt}
            </p>
          </div>

          {/* Image */}
          <motion.img
            src={src}
            alt={alt}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transition: 'transform 0.2s ease-out',
            }}
            className="relative max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />

          {/* Keyboard hints */}
          <div className="absolute bottom-4 right-4 z-10 text-white/50 text-xs space-y-1">
            <p>ESC to close</p>
            <p>+/- to zoom</p>
            <p>R to rotate</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
