"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import { mainCategories } from "@/constants/categories";
import { usePathname } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export default function NavigationBar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const currentLocale = segments[0] === "fr" ? "fr" : "en";

  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<number | null>(
    null
  );
  const [hoverPosition, setHoverPosition] = useState({ left: 0, top: 0 });
  const [submenuDirection, setSubmenuDirection] = useState<"right" | "left">(
    "right"
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, clientWidth, scrollWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => updateScrollButtons();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  const scrollByDir = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.max(240, Math.floor(el.clientWidth * 0.8));
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  const handleMainEnter = (
    idx: number,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveCategory(idx);
    setActiveSubCategory(null);
    setHoverPosition({ left: rect.left, top: rect.bottom });
  };

  const handleSubEnter = (
    subIdx: number,
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    setActiveSubCategory(subIdx);
    const rect = e.currentTarget.getBoundingClientRect();
    const remainingRightSpace = window.innerWidth - rect.right;
    setSubmenuDirection(remainingRightSpace < 180 ? "left" : "right");
  };

  return (
    <nav className="w-full bg-neutral-900 border-b border-neutral-700 shadow-sm relative hidden lg:block">
      {canScrollLeft && (
        <div className="absolute left-0 top-0 h-14 w-10 z-20 flex items-center justify-center">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-neutral-900 to-transparent" />
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollByDir("left")}
            className="relative z-10 rounded-full p-1.5 bg-neutral-900 hover:bg-neutral-700 focus:outline-none cursor-pointer"
          >
            <ChevronLeftIcon className="size-7 text-neutral-200" />
          </button>
        </div>
      )}
      {canScrollRight && (
        <div className="absolute right-0 top-0 h-14 w-10 z-20 flex items-center justify-center">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-neutral-900 to-transparent" />
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollByDir("right")}
            className="relative z-10 rounded-full p-1.5 bg-neutral-900 hover:bg-neutral-700 focus:outline-none cursor-pointer"
          >
            <ChevronRightIcon className="size-7 text-neutral-200" />
          </button>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex container mx-auto h-14 items-center overflow-x-auto hide-scrollbar gap-0"
      >
        {mainCategories.map((category, idx) => (
          <div
            key={category.slug}
            className="relative group"
            onMouseEnter={(e) => handleMainEnter(idx, e)}
            onMouseLeave={() => {
              setActiveCategory(null);
              setActiveSubCategory(null);
            }}
          >
            <Link
              href={`/category/${encodeURIComponent(category.slug)}`}
              className={`px-4 py-3 whitespace-nowrap block transition-colors ${
                activeCategory === idx
                  ? "text-orange-400"
                  : "text-neutral-200 hover:text-orange-400"
              }`}
            >
              {category.name[currentLocale]}
            </Link>
          </div>
        ))}
      </div>

      {activeCategory !== null && (
        <div
          className="fixed z-50 flex transition-opacity duration-200"
          style={{ left: hoverPosition.left, top: hoverPosition.top }}
          onMouseEnter={() => setActiveCategory(activeCategory)}
          onMouseLeave={() => {
            setActiveCategory(null);
            setActiveSubCategory(null);
          }}
        >
          {mainCategories[activeCategory].sub && (
            <div className="w-38 bg-neutral-900 border border-neutral-700 shadow-lg animate-fadeIn">
              {mainCategories[activeCategory].sub!.map((subCat, subIdx) => (
                <Link
                  key={subCat.slug}
                  href={`/category/${encodeURIComponent(
                    mainCategories[activeCategory].slug
                  )}/${encodeURIComponent(subCat.slug)}`}
                  className={`block px-4 py-2 text-neutral-200 hover:bg-neutral-800 hover:text-orange-400 transition-colors ${
                    activeSubCategory === subIdx
                      ? "bg-neutral-800 text-orange-400"
                      : ""
                  }`}
                  onMouseEnter={(e) => handleSubEnter(subIdx, e)}
                >
                  {subCat.name[currentLocale]}
                </Link>
              ))}
            </div>
          )}

          {activeSubCategory !== null &&
            mainCategories[activeCategory].sub![activeSubCategory].sub && (
              <div
                className={`w-48 bg-neutral-900 border border-neutral-700 shadow-lg transition-all duration-200 transform animate-fadeIn
                ${
                  submenuDirection === "right"
                    ? "ml-px -translate-x-1"
                    : "mr-px -translate-x-85"
                }`}
              >
                {mainCategories[activeCategory].sub![
                  activeSubCategory
                ].sub!.map((subSubCat) => (
                  <Link
                    key={subSubCat.slug}
                    href={`/category/${encodeURIComponent(
                      mainCategories[activeCategory].slug
                    )}/${encodeURIComponent(
                      mainCategories[activeCategory].sub![activeSubCategory]
                        .slug
                    )}/${encodeURIComponent(subSubCat.slug)}`}
                    className="block px-4 py-2 text-neutral-200 hover:bg-neutral-800 hover:text-orange-400 transition-colors"
                  >
                    {subSubCat.name[currentLocale]}
                  </Link>
                ))}
              </div>
            )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}
