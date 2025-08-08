import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { notFound } from "next/navigation";
import ListProduct from "@/components/ListProduct";
import ListProductDesktop from "@/components/ListProductDesktop";
import LocationBanner from "@/components/LocationBanner";
import { getUserWithLocation } from "@/lib/session";
import { getTranslations } from "next-intl/server";

export default async function FavoritesPage() {
  const session = await getSession();
  if (!session?.id) return notFound();

  const t = await getTranslations("favorites");
  const user = await getUserWithLocation();

  const products = await db.product.findMany({
    where: {
      productLikes: {
        some: { userId: session.id },
      },
    },
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
  });

  return (
    <div className="container-lg px-5 flex flex-col gap-3 mb-20 lg:mt-10">
      <h1 className="text-white text-xl font-semibold my-4">{t("title")}</h1>

      {products.length === 0 ? (
        <p className="text-neutral-400">{t("empty")}</p>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
