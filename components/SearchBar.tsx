"use client";

import {
  ArrowRightIcon,
  ChevronDownIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type SearchCategory = "products" | "posts" | "live";

const categories: SearchCategory[] = ["products", "posts", "live"];

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const pathWithoutLocale = segments.slice(1).join("/") || "/";
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState<SearchCategory>("products");
  const [open, setOpen] = useState(false);
  const t = useTranslations("header.searchBar");
  const locale = useLocale();

  const hideAddButton =
    pathname.startsWith(`/${locale}/profile`) ||
    pathname.startsWith(`/${locale}/chats`) ||
    pathname.startsWith(`/${locale}/favorites`);

  let addHref: string | undefined;
  let addLabel: string | undefined;

  if (
    pathWithoutLocale.startsWith("products") ||
    pathWithoutLocale.startsWith("category")
  ) {
    addHref = "/products/add";
    addLabel = t("addProduct");
  } else if (pathWithoutLocale.startsWith("posts")) {
    addHref = "/posts/add";
    addLabel = t("writePost");
  } else if (pathWithoutLocale.startsWith("live")) {
    addHref = "/live/add";
    addLabel = t("startLive");
  }

  const prevRootRef = useRef<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      router.push(`/${category}/search?q=${encodeURIComponent(term)}`);
    }
  };

  useEffect(() => {
    const root = pathname.split("/")[2] || "";

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
    <div className="flex items-center">
      <form
        onSubmit={handleSubmit}
        className="hidden relative lg:flex items-center w-full mx-auto px-50 py-2"
      >
        <div className="flex w-full rounded-full items-center focus-within:ring-1 focus-within:ring-orange-500">
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-1 pl-5 pr-3 py-2 bg-neutral-800 text-white rounded-l-full border border-neutral-600 cursor-pointer"
            >
              {t(category)}
              <ChevronDownIcon className="size-4" />
            </button>

            {open && (
              <div className="absolute left-[10px] top-full mt-0 w-26 bg-neutral-800 border border-neutral-600 rounded-md shadow-lg z-50">
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
                    {t(c)}
                  </div>
                ))}
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder={t(
              `search${category.charAt(0).toUpperCase() + category.slice(1)}`
            )}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="flex-1 pl-4 pr-12 py-2 rounded-r-full bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <button
            type="submit"
            className="absolute right-52 cursor-pointer ml-2 px-1 py-1 bg-orange-500 text-white rounded-full hover:bg-orange-600"
          >
            <ArrowRightIcon className="size-5" />
          </button>
        </div>
      </form>

      {!hideAddButton && (
        <Link
          href={addHref ?? "#"}
          className="hidden absolute right-5 cursor-pointer lg:flex bg-orange-500 text-white items-center justify-center gap-1 rounded-md p-2 hover:bg-orange-600 text-sm font-semibold"
        >
          <PlusIcon className="size-4" />
          <span>{addLabel}</span>
        </Link>
      )}
    </div>
  );
}
