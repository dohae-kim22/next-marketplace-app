"use client";

import { Link } from "@/i18n/navigation";
import { findCategoryBySlugs } from "@/lib/categoryUtils";

interface Props {
  slug: string[];
}

export default function CategoryBreadcrumb({ slug }: Props) {
  const [main, sub, subsub] = slug || [];

  const categoryMainObj = findCategoryBySlugs([main]);
  const categorySubObj = findCategoryBySlugs([main, sub]);
  const categorySubSubObj = findCategoryBySlugs([main, sub, subsub]);

  return (
    <h1 className="text-[15px] font-medium *:text-neutral-400 flex gap-1 items-center">
      <Link
        href="/products"
        className="underline underline-offset-4 hover:text-orange-400 transition-colors"
      >
        Home
      </Link>

      {categoryMainObj && (
        <>
          <span>›</span>
          <Link
            href={`/category/${main}`}
            className="underline underline-offset-4 hover:text-orange-400 transition-colors"
          >
            {categoryMainObj.name.en}
          </Link>
        </>
      )}

      {categorySubObj && (
        <>
          <span>›</span>
          <Link
            href={`/category/${main}/${sub}`}
            className="underline underline-offset-4 hover:text-orange-400 transition-colors"
          >
            {categorySubObj.name.en}
          </Link>
        </>
      )}

      {categorySubSubObj && (
        <>
          <span>›</span>
          <Link
            href={`/category/${main}/${sub}/${subsub}`}
            className="underline underline-offset-4 hover:text-orange-400 transition-colors"
          >
            {categorySubSubObj.name.en}
          </Link>
        </>
      )}
    </h1>
  );
}
