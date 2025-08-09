"use client";

import { useState, useTransition } from "react";
import ListProduct from "@/components/ListProduct";
import ListProductDesktop from "@/components/ListProductDesktop";
import { getMoreCategoryProducts } from "@/app/[locale]/(tabs)/category/[...slug]/actions";
import { PAGE_SIZE } from "@/lib/utils";
import { useTranslations } from "next-intl";

type Product = Parameters<typeof ListProduct>[0];

export default function LoadMoreCategoryProducts({
  initialItems,
  slug,
}: {
  initialItems: Product[];
  slug: string[];
}) {
  const [items, setItems] = useState<Product[]>(initialItems);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const [hasMore, setHasMore] = useState(initialItems.length === PAGE_SIZE);
  const t = useTranslations("loadMoreProducts");

  const loadMore = () => {
    if (!hasMore || isPending) return;
    startTransition(async () => {
      const next = await getMoreCategoryProducts(page, slug);
      if (next.length < PAGE_SIZE) setHasMore(false);
      setItems((prev) => [...prev, ...next]);
      setPage((p) => p + 1);
    });
  };

  return (
    <>
      <div className="flex flex-col gap-3 lg:hidden">
        {items.map((p) => (
          <ListProduct key={p.id} {...p} />
        ))}
      </div>

      <div className="hidden lg:grid lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {items.map((p) => (
          <ListProductDesktop key={p.id} {...p} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="px-4 py-2 cursor-pointer rounded-md border border-neutral-700 hover:bg-neutral-800 transition-colors"
          >
            {isPending ? t("loading") : t("loadMore")}
          </button>
        </div>
      )}
    </>
  );
}
