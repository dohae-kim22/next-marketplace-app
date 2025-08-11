"use client";

import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import LightBox from "./LightBox";

export default function ProductImageSlider({
  photos,
}: {
  photos: { url: string }[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  const openAt = useCallback((idx: number) => {
    setCurrentSlide(idx);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const next = useCallback(() => {
    if (isOpen) {
      setCurrentSlide((prev) => (prev + 1) % photos.length);
    } else {
      slider.current?.next();
    }
  }, [isOpen, photos.length, slider]);

  const prev = useCallback(() => {
    if (isOpen) {
      setCurrentSlide((prev) => (prev - 1 + photos.length) % photos.length);
    } else {
      slider.current?.prev();
    }
  }, [isOpen, photos.length, slider]);

  return (
    <div className="relative md:size-[500px] mx-auto">
      <div
        ref={sliderRef}
        className="keen-slider aspect-square overflow-hidden rounded-md"
      >
        {photos.map((photo, i) => (
          <button
            key={i}
            className="keen-slider__slide relative cursor-pointer"
            onClick={() => openAt(i)}
            aria-label={`Open image ${i + 1} in fullscreen`}
          >
            <Image
              fill
              src={`${photo.url}/public`}
              alt={`Photo ${i + 1}`}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
              priority={i === 0}
            />
          </button>
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute flex justify-center items-center left-1 md:-left-12 lg:left-1 top-1/2 -translate-y-1/2 bg-neutral-600 text-white p-1 rounded-full opacity-80 cursor-pointer hover:bg-neutral-500 transition-colors"
          >
            <ChevronLeftIcon className="size-5 md:size-6" />
          </button>

          <button
            onClick={next}
            className="absolute flex justify-center items-center right-1 md:-right-12 lg:right-1 top-1/2 -translate-y-1/2 bg-neutral-600 text-white p-1 rounded-full opacity-80 cursor-pointer hover:bg-neutral-500 transition-colors"
          >
            <ChevronRightIcon className="size-5 md:size-6" />
          </button>

          <div className="absolute bottom-2 w-full flex justify-center gap-2">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => slider.current?.moveToIdx(i)}
                className={`w-2 h-2 rounded-full transition ${
                  currentSlide === i ? "bg-orange-400" : "bg-neutral-400"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      <LightBox
        isOpen={isOpen}
        photos={photos}
        index={currentSlide}
        onClose={close}
        onPrev={prev}
        onNext={next}
      />
    </div>
  );
}
