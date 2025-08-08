"use client";

import { useState, useTransition } from "react";
import ListProduct from "@/components/ListProduct";
import ListProductDesktop from "@/components/ListProductDesktop";
import { getMoreProducts } from "@/app/[locale]/(tabs)/products/actions";
import { useTranslations } from "next-intl";
import { PAGE_SIZE } from "@/lib/utils";

type Product = Parameters<typeof ListProduct>[0];

export default function LoadMoreProducts({
  initialItems,
}: {
  initialItems: Product[];
}) {
  const [items, setItems] = useState<Product[]>(initialItems);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [hasMore, setHasMore] = useState(initialItems.length === PAGE_SIZE);
  const t = useTranslations("loadMoreProducts");

  const loadMore = () => {
    if (!hasMore || isPending) return;
    startTransition(async () => {
      const next = await getMoreProducts(page);
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
            className="px-4 py-2 rounded-md border border-neutral-700 hover:bg-neutral-800"
          >
            {isPending ? t("loading") : t("loadMore")}
          </button>
        </div>
      )}
    </>
  );
}
