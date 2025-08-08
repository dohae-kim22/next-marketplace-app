"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

const supportedLocales = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const currentLocale = supportedLocales.some((l) => l.code === segments[0])
    ? segments[0]
    : "fr";

  const [locale, setLocale] = useState(currentLocale);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (newLocale: string) => {
    setLocale(newLocale);
    setOpen(false);

    const newPath = supportedLocales.some((l) => l.code === segments[0])
      ? `/${newLocale}/${segments.slice(1).join("/")}`
      : `/${newLocale}${pathname}`;

    router.push(newPath || `/${newLocale}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 text-white py-1.5 
             border-b-2 border-transparent hover:border-white
             transition-colors cursor-pointer"
      >
        <span className="hidden lg:inline text-sm font-semibold">
          {supportedLocales.find((l) => l.code === locale)?.code.toUpperCase()}
        </span>
        <GlobeAltIcon className="size-7" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-32 bg-neutral-900 border border-neutral-700 rounded-xl shadow-xl overflow-hidden z-50 animate-fadeIn">
          {supportedLocales.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => handleChange(code)}
              className={`flex justify-between items-center w-full px-4 py-2.5 text-sm transition-colors
                          ${
                            locale === code
                              ? "bg-neutral-800 text-orange-400"
                              : "text-neutral-200 hover:bg-neutral-800 hover:text-white"
                          }`}
            >
              {label}
              {locale === code && (
                <CheckIcon className="size-4 text-orange-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
