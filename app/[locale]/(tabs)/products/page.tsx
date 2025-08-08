import LocationBanner from "@/components/LocationBanner";
import { getUserWithLocation } from "@/lib/session";
import db from "@/lib/db";
import { getDistanceFromLatLonInKm, PAGE_SIZE } from "@/lib/utils";
import LoadMoreProducts from "@/components/LoadMoreProducts";

async function getFirstPage() {
  const user = await getUserWithLocation();

  const rows = await db.product.findMany({
    select: {
      title: true,
      price: true,
      id: true,
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

export default async function Products() {
  const { items, user } = await getFirstPage();

  return (
    <div className="container-lg px-5 flex flex-col gap-3 mb-30">
      <LocationBanner
        location={user?.location ?? undefined}
        radius={user?.radius ?? undefined}
      />

      <LoadMoreProducts initialItems={items} />
    </div>
  );
}
