"use client";

import { useState, useEffect, useRef } from "react";
import { Category, mainCategories } from "@/constants/categories";
import { useLocale, useTranslations } from "next-intl";

interface Props {
  onChange: (values: string[]) => void;
  errors?: string[];
  defaultValue?: string[];
}

export default function CategorySelector({
  onChange,
  errors = [],
  defaultValue = [],
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [path, setPath] = useState<number[]>([]);
  const [localError, setLocalError] = useState<string | null>(
    errors.length > 0 ? errors[0] : null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentLocale = useLocale() as "en" | "fr";
  const t = useTranslations("categorySelector");

  useEffect(() => {
    if (defaultValue.length === 0) return;

    const newPath: number[] = [];
    let currentLevel = mainCategories as Category[];

    for (const id of defaultValue) {
      const idx = currentLevel.findIndex((c) => c.id === id);
      if (idx === -1) break;
      newPath.push(idx);
      currentLevel = currentLevel[idx].sub || [];
    }

    if (newPath.length > 0) {
      setPath(newPath);
      onChange(defaultValue);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (errors.length > 0) {
      setLocalError(errors[0]);
    }
  }, [errors]);

  const getCurrentLevelCategories = (): Category[] => {
    let currentLevel = mainCategories as Category[];
    for (const index of path) {
      const next = currentLevel[index]?.sub;
      if (!next) return [];
      currentLevel = next;
    }
    return currentLevel;
  };

  const getSelectedPathNames = (): string[] => {
    let currentLevel = mainCategories as Category[];
    return path.map((idx) => {
      const category = currentLevel[idx];
      currentLevel = category.sub || [];
      return category.name[currentLocale];
    });
  };

  const handleSelect = (idx: number) => {
    const currentLevel = getCurrentLevelCategories();
    const selected = currentLevel[idx];
    const newPath = [...path, idx];

    const selectedIds: string[] = [];
    let levelCats = mainCategories as Category[];
    for (const i of newPath) {
      const cat = levelCats[i];
      selectedIds.push(cat.id);
      levelCats = cat.sub || [];
    }

    onChange(selectedIds);

    if (selected.sub && selected.sub.length > 0) {
      setPath(newPath);
    } else {
      setPath(newPath);
      setLocalError(null);
      setIsOpen(false);
    }
  };

  const handleBack = () => {
    setPath((prev) => prev.slice(0, -1));
  };

  const currentCategories = getCurrentLevelCategories();
  const selectedNames = getSelectedPathNames();

  const handleButtonClick = () => {
    setIsOpen((prev) => !prev);
    setLocalError(null);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleButtonClick}
        type="button"
        className="w-full border border-neutral-200 px-4 py-2 rounded-md bg-neutral-900 text-left shadow"
      >
        {selectedNames.length === 0
          ? t("placeholder")
          : selectedNames.join(" → ")}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-full border rounded bg-neutral-900 shadow z-10">
          {path.length > 0 && (
            <div
              onClick={handleBack}
              className="px-4 py-2 text-orange-500 cursor-pointer hover:bg-neutral-800 border-b transition-colors"
            >
              {t("back")}
            </div>
          )}

          <ul className="max-h-60 overflow-auto">
            {currentCategories.map((cat, idx) => (
              <li
                key={idx}
                onClick={() => handleSelect(idx)}
                className="px-4 py-2 hover:bg-neutral-800 transition-colors cursor-pointer flex justify-between items-center"
              >
                <span>{cat.name[currentLocale]}</span>
                {cat.sub && cat.sub.length > 0 && (
                  <span className="text-gray-400">›</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {localError && (
        <div className="text-red-500 text-sm p-2">{localError}</div>
      )}
    </div>
  );
}
