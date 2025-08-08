import LocationBanner from "@/components/LocationBanner";
import db from "@/lib/db";
import { getUserWithLocation } from "@/lib/session";
import { getDistanceFromLatLonInKm, PAGE_SIZE } from "@/lib/utils";
import CategoryBreadcrumb from "@/components/CategoryBreadcrumb";
import { findCategoryBySlugs } from "@/lib/categoryUtils";
import LoadMoreCategoryProducts from "@/components/LoadMoreCategoryProducts";

async function getFirstPage(slug: string[]) {
  const [mainSlug, subSlug, subSubSlug] = slug || [];
  const mainObj = findCategoryBySlugs([mainSlug]);
  const subObj = findCategoryBySlugs([mainSlug, subSlug]);
  const subSubObj = findCategoryBySlugs([mainSlug, subSlug, subSubSlug]);

  const where: any = {};
  if (mainObj?.id) where.categoryMain = mainObj.id;
  if (subObj?.id) where.categorySub = subObj.id;
  if (subSubObj?.id) where.categorySubSub = subSubObj.id;

  const user = await getUserWithLocation();

  const rows = await db.product.findMany({
    where,
    select: {
      id: true,
      title: true,
      price: true,
      photo: true,
      created_at: true,
      views: true,
      productLikes: true,
      location: true,
      status: true,
      type: true,
      latitude: true,
      longitude: true,
      city: true,
      street: true,
      postalCode: true,
      state: true,
      countryCode: true,
      categoryMain: true,
      categorySub: true,
      categorySubSub: true,
    },
    orderBy: { created_at: "desc" },
    take: PAGE_SIZE,
  });

  let items = rows;
  if (user?.latitude && user.longitude && user.radius) {
    items = rows.filter((p) => {
      if (p.latitude === null || p.longitude === null) return false;
      const d = getDistanceFromLatLonInKm(
        user.latitude!,
        user.longitude!,
        p.latitude,
        p.longitude
      );
      return d <= user.radius!;
    });
  }

  return { items, user };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const { items, user } = await getFirstPage(slug);

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
        <LoadMoreCategoryProducts initialItems={items as any} slug={slug} />
      )}
    </div>
  );
}
