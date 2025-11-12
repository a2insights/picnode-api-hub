// src/components/ImageModal.tsx
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { X } from 'lucide-react';

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const ImageModal = ({ src, alt, onClose }: { src: string; alt?: string; onClose: () => void }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      variants={backdrop}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-[90vw] max-h-[90vh] rounded-lg overflow-hidden"
        variants={modal}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute z-30 top-3 right-3 bg-black/40 backdrop-blur-sm p-2 rounded-full"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="flex items-center justify-center bg-black">
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[80vh] object-contain block"
            loading="eager"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ImageModal;
