"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

type Props = {
  isOpen: boolean;
  photos: { url: string }[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function LightBox({
  isOpen,
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: Props) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isPinching, setIsPinching] = useState(false);

  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  const safeIndex = useMemo(
    () =>
      photos.length
        ? ((index % photos.length) + photos.length) % photos.length
        : 0,
    [index, photos.length]
  );
  const current = photos[safeIndex];

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose, onPrev, onNext]);

  useEffect(() => {
    setImgLoaded(false);
    transformRef.current?.resetTransform();
  }, [safeIndex]);

  useEffect(() => {
    if (!photos.length) return;
    const nextIdx = (safeIndex + 1) % photos.length;
    const prevIdx = (safeIndex - 1 + photos.length) % photos.length;
    [photos[nextIdx]?.url, photos[prevIdx]?.url].forEach((u) => {
      if (!u) return;
      const img = new Image();
      img.src = `${u}/public`;
    });
  }, [safeIndex, photos]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      t: Date.now(),
    };
  };

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return;
      if (isPinching) {
        touchStart.current = null;
        return;
      }

      const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStart.current.x;
      const dy = (e.changedTouches[0]?.clientY ?? 0) - touchStart.current.y;
      const dt = Date.now() - touchStart.current.t;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      const isHorizontal = absX > absY;
      const smallVertical = absY < 40;
      const farEnough = absX > 50 || (absX > 30 && dt < 200);

      if (isHorizontal && smallVertical && farEnough) {
        dx < 0 ? onNext() : onPrev();
      }
      touchStart.current = null;
    },
    [isPinching, onNext, onPrev]
  );

  if (!isOpen || !current) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute z-10 cursor-pointer top-5 right-5 p-2 rounded-full bg-neutral-800/70 hover:bg-neutral-700 transition"
      >
        <XMarkIcon className="size-4 md:size-6 text-white" />
      </button>

      {photos.length > 1 && (
        <>
          <button
            onClick={onPrev}
            aria-label="Previous"
            className="hidden lg:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-800/70 hover:bg-neutral-700 transition cursor-pointer z-10"
          >
            <ChevronLeftIcon className="size-4 lg:size-6 text-white" />
          </button>
          <button
            onClick={onNext}
            aria-label="Next"
            className="hidden lg:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-800/70 hover:bg-neutral-700 transition cursor-pointer z-10"
          >
            <ChevronRightIcon className="size-4 lg:size-6 text-white" />
          </button>
        </>
      )}

      <div
        className="relative w-[92vw] h-[80vh] max-w-6xl bg-black/20 rounded-md overflow-hidden touch-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {!imgLoaded && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="size-8 z-10 rounded-full border-4 border-white/40 border-t-orange-400 animate-spin" />
          </div>
        )}

        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          minScale={1}
          doubleClick={{ mode: "zoomIn" }}
          wheel={{ step: 0.15 }}
          pinch={{ step: 5 }}
          panning={{ disabled: true }}
          limitToBounds
          centerOnInit
          onPinchingStart={() => setIsPinching(true)}
          onPinchingStop={() => setIsPinching(false)}
        >
          <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%" }}
            contentStyle={{ width: "100%", height: "100%" }}
          >
            <img
              key={safeIndex}
              src={`${current.url}/public`}
              alt={`Photo ${safeIndex + 1}`}
              className={`w-full h-full object-contain select-none pointer-events-none transition-opacity duration-200 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
              draggable={false}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {photos.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === safeIndex ? "bg-orange-400" : "bg-neutral-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
