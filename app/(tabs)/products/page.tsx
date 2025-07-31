import ListProduct from "@/components/ListProduct";
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

  if (process.env.NODE_ENV === "development") {
    console.log("지금은 개발 모드!");
  } else if (process.env.NODE_ENV === "production") {
    console.log("지금은 프로덕션 모드!");
  }

  return (
    <div className="px-5 flex flex-col gap-3 mb-20">
      <LocationBanner
        location={user?.location ?? undefined}
        radius={user?.radius ?? undefined}
      />
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
    </div>
  );
}
