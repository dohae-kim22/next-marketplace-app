"use client";

import { useState, useEffect, useRef } from "react";
import { Category, mainCategories } from "@/constants/categories";

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

  useEffect(() => {
    if (defaultValue.length === 0) return;

    const newPath: number[] = [];
    let currentLevel = mainCategories as Category[];

    for (const name of defaultValue) {
      const idx = currentLevel.findIndex((c) => c.name === name);
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
      return category.name;
    });
  };

  const handleSelect = (idx: number) => {
    const currentLevel = getCurrentLevelCategories();
    const selected = currentLevel[idx];
    const newPath = [...path, idx];

    const selectedNames: string[] = [];
    let levelCats = mainCategories as Category[];
    for (const i of newPath) {
      const cat = levelCats[i];
      selectedNames.push(cat.name);
      levelCats = cat.sub || [];
    }

    onChange(selectedNames);

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
    console.log("back");
  };

  const currentCategories = getCurrentLevelCategories();
  const selectedNames = getSelectedPathNames();

  const handleButtonClick = () => {
    setIsOpen((prev) => !prev);
    setLocalError(null);
  };

  return (
    <div className="relative w-64" ref={dropdownRef}>
      <button
        onClick={handleButtonClick}
        type="button"
        className="w-full border px-4 py-2 rounded bg-neutral-900 text-left shadow"
      >
        {selectedNames.length === 0
          ? "Select Category"
          : selectedNames.join(" → ")}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-full border rounded bg-neutral-900 shadow z-10">
          {path.length > 0 && (
            <div
              onClick={handleBack}
              className="px-4 py-2 text-blue-500 cursor-pointer hover:bg-neutral-800 border-b"
            >
              ← Back
            </div>
          )}

          <ul className="max-h-60 overflow-auto">
            {currentCategories.map((cat, idx) => (
              <li
                key={idx}
                onClick={() => handleSelect(idx)}
                className="px-4 py-2 hover:bg-neutral-800 cursor-pointer flex justify-between items-center"
              >
                <span>{cat.name}</span>
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
