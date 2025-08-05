import ListProduct from "@/components/ListProduct";
import ListProductDesktop from "@/components/ListProductDesktop";
import LocationBanner from "@/components/LocationBanner";
import db from "@/lib/db";
import { getUserWithLocation } from "@/lib/session";
import { getDistanceFromLatLonInKm } from "@/lib/utils";

async function getAllProducts() {
  const products = await db.product.findMany({
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
    },
    orderBy: { created_at: "desc" },
  });

  return products;
}

async function getFilteredProductsByLocation() {
  const user = await getUserWithLocation();

  if (!user?.latitude || !user.longitude || !user.radius) {
    return getAllProducts();
  }

  const allProducts = await getAllProducts();

  return allProducts.filter((product) => {
    if (product.latitude === null || product.longitude === null) return false;
    const distance = getDistanceFromLatLonInKm(
      user.latitude!,
      user.longitude!,
      product.latitude,
      product.longitude
    );
    return distance <= user.radius!;
  });
}

export default async function Products() {
  const user = await getUserWithLocation();
  const products = await getFilteredProductsByLocation();

  return (
    <div className="container-lg px-5 flex flex-col gap-3 mb-20">
      <LocationBanner
        location={user?.location ?? undefined}
        radius={user?.radius ?? undefined}
      />

      <div className="flex flex-col gap-3 lg:hidden">
        {products.map((product) => (
          <ListProduct key={product.id} {...product} />
        ))}
      </div>

      <div className="hidden lg:grid lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <ListProductDesktop key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
