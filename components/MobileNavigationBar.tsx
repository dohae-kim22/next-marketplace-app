"use client";

import { Link } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { mainCategories } from "@/constants/categories";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLocale } from "next-intl";

export default function MobileNavigationBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMainIdx, setOpenMainIdx] = useState<number | null>(null);
  const [openSubIdx, setOpenSubIdx] = useState<number | null>(null);
  const currentLocale = useLocale() as "en" | "fr";

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <nav className="w-full bg-neutral-900 shadow-sm relative lg:hidden">
      <button onClick={() => setMenuOpen(true)} className="flex items-center">
        <Bars3Icon className="size-7 text-white" />
      </button>

      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full bg-neutral-900 transform transition-transform duration-500 z-50 overflow-y-auto`}
        style={{
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="flex justify-between items-center h-14 px-6 border-b border-neutral-700">
          <span className="text-neutral-200 font-bold text-lg">Menu</span>
          <button
            className="text-neutral-200 hover:text-orange-400"
            onClick={() => setMenuOpen(false)}
          >
            <XMarkIcon className="size-6" />
          </button>
        </div>

        <div className="py-4 px-6 space-y-2">
          {mainCategories.map((category, idx) => (
            <div key={idx} className=" pb-2">
              <div className="flex justify-between items-center">
                <Link
                  href={`/category/${encodeURIComponent(category.slug)}`}
                  className="flex-1 py-2 text-neutral-200 text-lg font-medium hover:text-orange-400 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {category.name[currentLocale]}
                </Link>
                {category.sub && (
                  <button
                    className="px-2 text-neutral-400 hover:text-orange-400 transition-colors"
                    onClick={() =>
                      setOpenMainIdx(openMainIdx === idx ? null : idx)
                    }
                  >
                    {openMainIdx === idx ? "−" : "+"}
                  </button>
                )}
              </div>

              <div
                className={`pl-4 mt-1 border-l border-neutral-800 overflow-hidden transition-all duration-300 ease-in-out ${
                  openMainIdx === idx
                    ? "max-h-screen opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {category.sub?.map((subCat, subIdx) => (
                  <div key={subIdx}>
                    <div className="flex justify-between items-center">
                      <Link
                        href={`/category/${encodeURIComponent(
                          category.slug
                        )}/${encodeURIComponent(subCat.slug)}`}
                        className="flex-1 py-2 text-neutral-300 hover:text-orange-400 transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        {subCat.name[currentLocale]}
                      </Link>
                      {subCat.sub && (
                        <button
                          className="px-2 text-neutral-400 hover:text-orange-400 transition-colors"
                          onClick={() =>
                            setOpenSubIdx(openSubIdx === subIdx ? null : subIdx)
                          }
                        >
                          {openSubIdx === subIdx ? "−" : "+"}
                        </button>
                      )}
                    </div>

                    <div
                      className={`pl-4 mt-1 border-l border-neutral-800 overflow-hidden transition-all duration-300 ease-in-out ${
                        openSubIdx === subIdx
                          ? "max-h-screen opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      {subCat.sub?.map((subSubCat, subSubIdx) => (
                        <Link
                          key={subSubIdx}
                          href={`/category/${encodeURIComponent(
                            category.slug
                          )}/${encodeURIComponent(
                            subCat.slug
                          )}/${encodeURIComponent(subSubCat.slug)}`}
                          className="block py-2 text-neutral-400 hover:text-orange-400 transition-colors"
                          onClick={() => setMenuOpen(false)}
                        >
                          {subSubCat.name[currentLocale]}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
