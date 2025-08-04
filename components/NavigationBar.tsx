"use client";

import Link from "next/link";
import { useState } from "react";
import { mainCategories } from "@/constants/categories";

export default function NavigationBar() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<number | null>(
    null
  );
  const [hoverPosition, setHoverPosition] = useState<{
    left: number;
    top: number;
  }>({
    left: 0,
    top: 0,
  });
  const [submenuDirection, setSubmenuDirection] = useState<"right" | "left">(
    "right"
  );

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
    const viewportWidth = window.innerWidth;
    const remainingRightSpace = viewportWidth - rect.right;

    if (remainingRightSpace < 180) {
      setSubmenuDirection("left");
    } else {
      setSubmenuDirection("right");
    }
  };

  return (
    <nav className="w-full bg-neutral-900 border-b border-neutral-700 shadow-sm relative hidden lg:block">
      <div className="flex container mx-auto h-14 items-center overflow-x-auto hide-scrollbar">
        {mainCategories.map((category, idx) => (
          <div
            key={idx}
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
              {category.name.en}
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
                  key={subIdx}
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
                  {subCat.name.en}
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
                ].sub!.map((subSubCat, subSubIdx) => (
                  <Link
                    key={subSubIdx}
                    href={`/category/${encodeURIComponent(
                      mainCategories[activeCategory].slug
                    )}/${encodeURIComponent(
                      mainCategories[activeCategory].sub![activeSubCategory]
                        .slug
                    )}/${encodeURIComponent(subSubCat.slug)}`}
                    className="block px-4 py-2 text-neutral-200 hover:bg-neutral-800 hover:text-orange-400 transition-colors"
                  >
                    {subSubCat.name.en}
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
