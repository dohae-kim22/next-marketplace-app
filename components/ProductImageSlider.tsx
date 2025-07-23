"use client";

import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function ProductImageSlider({
  photos,
}: {
  photos: { url: string }[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  return (
    <div className="relative">
      <div
        ref={sliderRef}
        className="keen-slider aspect-square rounded-md overflow-hidden"
      >
        {photos.map((photo, i) => (
          <div key={i} className="keen-slider__slide relative">
            <Image
              fill
              src={`${photo.url}/public`}
              alt={`Photo ${i + 1}`}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button
            onClick={() => slider.current?.prev()}
            className="absolute flex justify-center items-center left-1 top-1/2 -translate-y-1/2 bg-neutral-600 text-white p-1 rounded-full opacity-80 cursor-pointer"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>

          <button
            onClick={() => slider.current?.next()}
            className="absolute flex justify-center items-center right-1 top-1/2 -translate-y-1/2 bg-neutral-600 text-white p-1 rounded-full opacity-80 cursor-pointer"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
          <div className="absolute bottom-2 w-full flex justify-center gap-2">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => slider.current?.moveToIdx(i)}
                className={`w-2 h-2 rounded-full transition ${
                  currentSlide === i ? "bg-orange-400" : "bg-neutral-400"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
