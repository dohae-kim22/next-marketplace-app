"use client";

import { Link } from "@/i18n/navigation";
import { findCategoryBySlugs } from "@/lib/categoryUtils";
import { useLocale } from "next-intl";

interface Props {
  slug: string[];
}

export default function CategoryBreadcrumb({ slug }: Props) {
  const currentLocale = useLocale() as "en" | "fr";
  const [main, sub, subsub] = slug || [];

  const categoryMainObj = findCategoryBySlugs([main]);
  const categorySubObj = findCategoryBySlugs([main, sub]);
  const categorySubSubObj = findCategoryBySlugs([main, sub, subsub]);

  return (
    <h1
      className="text-[15px] font-medium *:text-neutral-400 flex items-center gap-1 overflow-x-auto whitespace-nowrap pr-2 -mr-2 hide-scrollbar"
      aria-label="Category breadcrumb"
    >
      <Link
        href="/products"
        className="hover:underline hover:underline-offset-4 hover:text-orange-400 transition shrink-0"
      >
        Home
      </Link>

      {categoryMainObj && (
        <>
          <span className="shrink-0">›</span>
          <Link
            href={`/category/${main}`}
            className="hover:underline hover:underline-offset-4 hover:text-orange-400 transition
                       shrink-0 max-w-[45vw] sm:max-w-none truncate"
            title={categoryMainObj.name[currentLocale]}
          >
            {categoryMainObj.name[currentLocale]}
          </Link>
        </>
      )}

      {categorySubObj && (
        <>
          <span className="shrink-0">›</span>
          <Link
            href={`/category/${main}/${sub}`}
            className="hover:underline hover:underline-offset-4 hover:text-orange-400 transition
                       shrink-0 max-w-[40vw] sm:max-w-none truncate"
            title={categorySubObj.name[currentLocale]}
          >
            {categorySubObj.name[currentLocale]}
          </Link>
        </>
      )}

      {categorySubSubObj && (
        <>
          <span className="shrink-0">›</span>
          <Link
            href={`/category/${main}/${sub}/${subsub}`}
            className="hover:underline hover:underline-offset-4 hover:text-orange-400 transition
                       shrink-0 max-w-[55vw] sm:max-w-none truncate"
            title={categorySubSubObj.name[currentLocale]}
          >
            {categorySubSubObj.name[currentLocale]}
          </Link>
        </>
      )}
    </h1>
  );
}
