import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface LightboxProps {
  isOpen: boolean;
  images: { url: string; altText?: string | null; caption?: string | null }[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950/90 backdrop-blur-xl p-4 sm:p-8 animate-in fade-in duration-200">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-dark-900/80 hover:bg-dark-800 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
        aria-label="Close Lightbox"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Prev button */}
      {images.length > 1 && (
        <button
          onClick={onPrev}
          className="absolute left-4 sm:left-8 z-50 p-3 rounded-full bg-dark-900/80 hover:bg-dark-800 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Main Image View */}
      <div className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center">
        <img
          src={currentImage.url}
          alt={currentImage.altText || currentImage.caption || `Screenshot ${currentIndex + 1}`}
          className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-slate-800"
        />

        {/* Caption and pagination */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 w-full px-2 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            {currentImage.altText || currentImage.caption || 'Project Screenshot Preview'}
          </p>
          <span className="text-xs font-mono text-slate-500 bg-dark-900 px-2.5 py-1 rounded-lg border border-slate-800">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={onNext}
          className="absolute right-4 sm:right-8 z-50 p-3 rounded-full bg-dark-900/80 hover:bg-dark-800 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
