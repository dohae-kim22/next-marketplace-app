import LocationBanner from "@/components/LocationBanner";
import CategoryBreadcrumb from "@/components/CategoryBreadcrumb";
import LoadMoreCategoryProducts from "@/components/LoadMoreCategoryProducts";
import { getFirstCategoryPage } from "./actions";
import { getTranslations } from "next-intl/server";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const { items, user } = await getFirstCategoryPage(slug);
  const t = await getTranslations("loadMoreProducts");

  return (
    <div className="container-lg px-5 flex flex-col gap-3 mb-20">
      <LocationBanner
        location={user?.location ?? undefined}
        radius={user?.radius ?? undefined}
      />
      <CategoryBreadcrumb slug={slug} />
      {items.length === 0 ? (
        <p className="text-neutral-400">{t("noProductsInCategory")}</p>
      ) : (
        <LoadMoreCategoryProducts initialItems={items} slug={slug} />
      )}
    </div>
  );
}
