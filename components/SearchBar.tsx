"use client";

import { ArrowRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type SearchCategory = "products" | "posts" | "live";

const categories: SearchCategory[] = ["products", "posts", "live"];

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState<SearchCategory>("products");
  const [open, setOpen] = useState(false);

  const prevRootRef = useRef<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      router.push(`/${category}/search?q=${encodeURIComponent(term)}`);
    }
  };

  useEffect(() => {
    const root = pathname.split("/")[1] || "";

    if (root === "posts") {
      setCategory("posts");
    } else if (root === "live") {
      setCategory("live");
    } else if (root === "products") {
      setCategory("products");
    }

    if (prevRootRef.current && prevRootRef.current !== root) {
      setTerm("");
    }

    prevRootRef.current = root;
  }, [pathname]);

  return (
    <form
      onSubmit={handleSubmit}
      className="hidden lg:flex items-center w-full max-w-3xl mx-auto px-4 py-2 relative"
    >
      <div>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-1 pl-5 pr-3 py-2 bg-neutral-800 text-white rounded-l-full border border-neutral-600"
        >
          {category}
          <ChevronDownIcon className="size-4" />
        </button>

        {open && (
          <div className="absolute left-[22px] top-full mt-0 w-26 bg-neutral-800 border border-neutral-600 rounded-lg shadow-lg z-50">
            {categories.map((c) => (
              <div
                key={c}
                onClick={() => {
                  setCategory(c);
                  setOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-neutral-700 ${
                  category === c ? "text-orange-400" : "text-white"
                }`}
              >
                {c}
              </div>
            ))}
          </div>
        )}
      </div>

      <input
        type="text"
        placeholder={`Search ${category}...`}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="flex-1 pl-4 pr-12 py-2 rounded-r-full bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <button
        type="submit"
        className="absolute right-6
        
        ml-2 px-1 py-1 bg-orange-500 text-white rounded-full hover:bg-orange-600"
      >
        <ArrowRightIcon className="size-5" />
      </button>
    </form>
  );
}
