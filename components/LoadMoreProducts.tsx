"use client";

import { useState, useTransition } from "react";
import ListProduct from "@/components/ListProduct";
import ListProductDesktop from "@/components/ListProductDesktop";
import { getMoreProducts } from "@/app/[locale]/(tabs)/products/actions";
import { PAGE_SIZE } from "@/lib/utils";
import { ListProductProps } from "@/lib/types/product";

export type Product = ListProductProps;

export default function LoadMoreProducts({
  initialItems,
  labels,
}: {
  initialItems: Product[];
  labels: { loadMore: string; loading: string; noProducts: string };
}) {
  const [items, setItems] = useState<Product[]>(initialItems);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [hasMore, setHasMore] = useState(initialItems.length === PAGE_SIZE);

  const loadMore = () => {
    if (!hasMore || isPending) return;
    startTransition(async () => {
      try {
        const next = await getMoreProducts(page);
        if (next.length < PAGE_SIZE) setHasMore(false);
        setItems((prev) => [...prev, ...next]);
        setPage((p) => p + 1);
      } catch (e) {
        console.error(e);
      }
    });
  };

  return (
    <>
      {items.length === 0 ? (
        <p className="text-neutral-400">{labels.noProducts}</p>
      ) : (
        <>
          <div className="flex flex-col gap-3 lg:hidden">
            {items.map((p, i) => (
              <ListProduct key={p.id} {...p} index={i} />
            ))}
          </div>

          <div className="hidden lg:grid lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {items.map((p, i) => (
              <ListProductDesktop key={p.id} {...p} index={i} />
            ))}
          </div>
        </>
      )}

      {hasMore && items.length > 0 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="px-4 py-2 cursor-pointer rounded-md border border-neutral-700 hover:bg-neutral-800 transition-colors"
          >
            {isPending ? labels.loading : labels.loadMore}
          </button>
        </div>
      )}
    </>
  );
}
