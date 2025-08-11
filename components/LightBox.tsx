"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
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
  const backdropRef = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

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

  if (!isOpen || !current) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-100 bg-black/90 backdrop-blur-sm flex items-center justify-center"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute cursor-pointer top-5 right-5 p-2 rounded-full bg-neutral-800/70 hover:bg-neutral-700 transition"
      >
        <XMarkIcon className="size-4 md:size-6 text-white" />
      </button>

      {photos.length > 1 && (
        <>
          <button
            onClick={onPrev}
            aria-label="Previous"
            className="hidden absolute lg:flex z-5 cursor-pointer left-15 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-800/70 hover:bg-neutral-700 transition"
          >
            <ChevronLeftIcon className="size-4 md:size-7 text-white" />
          </button>
          <button
            onClick={onNext}
            aria-label="Next"
            className="hidden absolute lg:flex z-5 cursor-pointer right-15 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-800/70 hover:bg-neutral-700 transition"
          >
            <ChevronRightIcon className="size-4 md:size-7 text-white" />
          </button>
        </>
      )}

      <div className="relative w-[92vw] h-[80vh] max-w-6xl bg-black/20 rounded-md overflow-hidden">
        {!imgLoaded && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="size-8 z-2 rounded-full border-4 border-white/40 border-t-orange-400 animate-spin" />
          </div>
        )}

        <TransformWrapper
          initialScale={1}
          minScale={0.75}
          doubleClick={{ mode: "zoomIn" }}
          wheel={{ step: 0.15 }}
          pinch={{ step: 5 }}
          panning={{ velocityDisabled: true }}
          limitToBounds={true}
          centerOnInit={true}
        >
          <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%" }}
            contentStyle={{ width: "100%", height: "100%" }}
          >
            <img
              key={safeIndex}
              src={`${current.url}/public`}
              alt={`Photo ${safeIndex + 1}`}
              className={`w-full h-full object-contain select-none transition-opacity duration-200 ${
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
