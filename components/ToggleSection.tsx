"use client";

import { useState, useEffect, useRef } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function ToggleSection({
  title,
  children,
  defaultOpen = false,
  initialCount = 5,
  loadMoreCount = 5,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  initialCount?: number;
  loadMoreCount?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [height, setHeight] = useState(0);
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const contentRef = useRef<HTMLDivElement>(null);

  const childrenArray = Array.isArray(children) ? children : [children];
  const slicedChildren = childrenArray.slice(0, visibleCount);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? contentRef.current.scrollHeight : 0);
    }

    if (!open) {
      setVisibleCount(initialCount);
    }
  }, [open, visibleCount, childrenArray.length, initialCount]);

  return (
    <div className="border-b border-neutral-700 pb-3">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex justify-between items-center w-full text-lg font-semibold text-white mb-4 cursor-pointer
             hover:scale-[1.02] transition-transform duration-300 ease-out"
        aria-expanded={open}
      >
        {title}
        <span
          className={`transition-transform duration-300 ease-out text-neutral-400 group-hover:text-orange-500 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          {open ? (
            <MinusIcon className="size-5" />
          ) : (
            <PlusIcon className="size-5" />
          )}
        </span>
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight: `${height}px` }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div className="flex flex-col gap-3">
          {slicedChildren}
          {childrenArray.length > visibleCount && (
            <button
              onClick={() => setVisibleCount((prev) => prev + loadMoreCount)}
              className="self-center my-2 px-3 py-1 rounded-md bg-neutral-700 cursor-pointer hover:bg-neutral-600 text-sm text-white transition"
            >
              More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
