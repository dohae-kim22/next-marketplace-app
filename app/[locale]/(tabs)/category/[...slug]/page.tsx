import LocationBanner from "@/components/LocationBanner";
import CategoryBreadcrumb from "@/components/CategoryBreadcrumb";
import LoadMoreCategoryProducts from "@/components/LoadMoreCategoryProducts";
import { getFirstCategoryPage } from "./actions";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const { items, user } = await getFirstCategoryPage(slug);

  return (
    <div className="container-lg px-5 flex flex-col gap-3 mb-20">
      <LocationBanner
        location={user?.location ?? undefined}
        radius={user?.radius ?? undefined}
      />
      <CategoryBreadcrumb slug={slug} />
      {items.length === 0 ? (
        <p className="text-neutral-400">No products found in this category.</p>
      ) : (
        <LoadMoreCategoryProducts initialItems={items} slug={slug} />
      )}
    </div>
  );
}
