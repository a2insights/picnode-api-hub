import { useEffect, useCallback, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight, Move } from 'lucide-react';
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  
  // Touch gesture state
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const [lastTouchCenter, setLastTouchCenter] = useState<{ x: number; y: number } | null>(null);
  
  // Swipe navigation state
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
  const [swipeOffsetX, setSwipeOffsetX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;
  const canDrag = scale > 1;
  const canSwipe = scale === 1 && hasMultiple;

  const resetTransforms = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
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

  const handleZoom = useCallback((delta: number) => {
    setScale((s) => {
      const newScale = Math.min(Math.max(s + delta, 0.5), 4);
      if (newScale <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') handleZoom(0.25);
      if (e.key === '-') handleZoom(-0.25);
      if (e.key === 'r') setRotation((r) => r + 90);
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === '0') resetTransforms();
    },
    [onClose, goNext, goPrev, handleZoom]
  );

  // Ctrl + Wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.15 : 0.15;
        handleZoom(delta);
      }
    },
    [handleZoom]
  );

  // Touch gesture handlers
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return null;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touches: React.TouchList) => {
    if (touches.length < 2) return null;
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      setLastTouchDistance(getTouchDistance(e.touches));
      setLastTouchCenter(getTouchCenter(e.touches));
      // Cancel swipe if user switches to two fingers
      setIsSwiping(false);
      setSwipeStartX(null);
      setSwipeOffsetX(0);
    } else if (e.touches.length === 1) {
      if (canDrag) {
        setIsDragging(true);
        setDragStart({
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y,
        });
      } else if (canSwipe) {
        // Start swipe tracking
        setSwipeStartX(e.touches[0].clientX);
        setIsSwiping(true);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      
      // Pinch to zoom
      const newDistance = getTouchDistance(e.touches);
      if (newDistance && lastTouchDistance) {
        const delta = (newDistance - lastTouchDistance) * 0.01;
        setScale((s) => {
          const newScale = Math.min(Math.max(s + delta, 0.5), 4);
          if (newScale <= 1) {
            setPosition({ x: 0, y: 0 });
          }
          return newScale;
        });
        setLastTouchDistance(newDistance);
      }
      
      // Two-finger pan
      const newCenter = getTouchCenter(e.touches);
      if (newCenter && lastTouchCenter && scale > 1) {
        setPosition((p) => ({
          x: p.x + (newCenter.x - lastTouchCenter.x),
          y: p.y + (newCenter.y - lastTouchCenter.y),
        }));
        setLastTouchCenter(newCenter);
      }
    } else if (e.touches.length === 1) {
      if (isDragging && canDrag) {
        setPosition({
          x: e.touches[0].clientX - dragStart.x,
          y: e.touches[0].clientY - dragStart.y,
        });
      } else if (isSwiping && swipeStartX !== null && canSwipe) {
        const currentX = e.touches[0].clientX;
        let deltaX = currentX - swipeStartX;
        
        // Apply resistance at edges
        const isAtStart = currentIndex === 0 && deltaX > 0;
        const isAtEnd = currentIndex === images.length - 1 && deltaX < 0;
        
        if (isAtStart || isAtEnd) {
          // Apply resistance factor (0.3 = 30% of actual movement)
          deltaX = deltaX * 0.3;
        }
        
        setSwipeOffsetX(deltaX);
      }
    }
  };

  const handleTouchEnd = () => {
    // Handle swipe navigation
    if (isSwiping && swipeOffsetX !== 0) {
      const threshold = 80; // Minimum swipe distance to trigger navigation
      
      if (swipeOffsetX < -threshold && currentIndex < images.length - 1) {
        // Swiped left - go to next
        goNext();
      } else if (swipeOffsetX > threshold && currentIndex > 0) {
        // Swiped right - go to previous
        goPrev();
      }
    }
    
    // Reset all touch states
    setIsDragging(false);
    setLastTouchDistance(null);
    setLastTouchCenter(null);
    setSwipeStartX(null);
    setSwipeOffsetX(0);
    setIsSwiping(false);
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('wheel', handleWheel, { passive: false });
      document.body.style.overflow = 'hidden';
      setCurrentIndex(initialIndex);
      resetTransforms();
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('wheel', handleWheel);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown, handleWheel, initialIndex]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canDrag) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !canDrag) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const zoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleZoom(0.25);
  };

  const zoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleZoom(-0.25);
  };

  const rotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotation((r) => r + 90);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetTransforms();
  };

  const lightboxNode = (
    <AnimatePresence>
      {open && currentImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center touch-none"
          onClick={onClose}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
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
            {(scale !== 1 || rotation !== 0 || position.x !== 0 || position.y !== 0) && (
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={handleReset}
                title="Reset (0)"
              >
                <Move className="w-5 h-5" />
              </Button>
            )}
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
            ref={imageRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "relative max-w-[85vw] max-h-[75vh] flex items-center justify-center",
              canDrag ? "cursor-grab" : "cursor-default",
              isDragging && "cursor-grabbing"
            )}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
          >
            <img
              src={currentImage.src}
              alt={currentImage.alt || 'Image'}
              style={{
                transform: `translate(${position.x + swipeOffsetX}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                transition: isDragging || isSwiping ? 'none' : 'transform 0.2s ease-out',
              }}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl select-none"
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

          {/* Keyboard hints - Desktop */}
          <div className="absolute bottom-4 right-4 z-10 text-white/40 text-xs space-y-0.5 hidden md:block">
            <p>ESC close • Ctrl+scroll zoom</p>
            <p>+/- zoom • R rotate • 0 reset</p>
            {hasMultiple && <p>← → navigate</p>}
            {canDrag && <p>Drag to pan</p>}
          </div>

          {/* Touch hints - Mobile */}
          <div className="absolute bottom-4 right-4 z-10 text-white/40 text-xs space-y-0.5 md:hidden">
            <p>Pinch to zoom</p>
            {hasMultiple && !canDrag && <p>Swipe to navigate</p>}
            {canDrag && <p>Two fingers to pan</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(lightboxNode, document.body);
};
