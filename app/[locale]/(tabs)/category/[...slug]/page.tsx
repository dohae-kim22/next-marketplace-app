import ListProduct from "@/components/ListProduct";
import ListProductDesktop from "@/components/ListProductDesktop";
import LocationBanner from "@/components/LocationBanner";
import { Category, mainCategories } from "@/constants/categories";
import db from "@/lib/db";
import { getUserWithLocation } from "@/lib/session";
import { getDistanceFromLatLonInKm } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

async function getAllProducts() {
  return db.product.findMany({
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
  });
}

function findCategoryBySlugs(slugs: string[]): Category | null {
  let currentLevel = mainCategories;

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const category = currentLevel.find((c) => c.slug === slug);
    if (!category) return null;
    if (i === slugs.length - 1) return category;
    currentLevel = category.sub ?? [];
  }

  return null;
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

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const [categoryMainSlug, categorySubSlug, categorySubSubSlug] =
    slug || [];

  const user = await getUserWithLocation();
  const products = await getFilteredProductsByLocation();

  const categoryMainObj = findCategoryBySlugs([categoryMainSlug]);
  const categorySubObj = findCategoryBySlugs([
    categoryMainSlug,
    categorySubSlug,
  ]);
  const categorySubSubObj = findCategoryBySlugs([
    categoryMainSlug,
    categorySubSlug,
    categorySubSubSlug,
  ]);

  const categoryMainId = categoryMainObj?.id ?? null;
  const categorySubId = categorySubObj?.id ?? null;
  const categorySubSubId = categorySubSubObj?.id ?? null;

  const filteredProducts = products.filter((product) => {
    if (!categoryMainId) return true;
    if (product.categoryMain !== categoryMainId) return false;
    if (categorySubId && product.categorySub !== categorySubId) return false;
    if (categorySubSubId && product.categorySubSub !== categorySubSubId)
      return false;
    return true;
  });

  return (
    <div className="container-lg px-5 flex flex-col gap-3 mb-20">
      <LocationBanner
        location={user?.location ?? undefined}
        radius={user?.radius ?? undefined}
      />

      <h1 className="text-md font-medium *:text-neutral-400 flex gap-1 items-center">
        <Link
          href={"/products"}
          className="underline underline-offset-4 hover:text-orange-400 transition-colors"
        >
          Home
        </Link>

        {categoryMainObj && (
          <>
            <span>›</span>
            <Link
              href={`/category/${encodeURIComponent(categoryMainSlug)}`}
              className="underline underline-offset-4 hover:text-orange-400 transition-colors"
            >
              {categoryMainObj.name.en}
            </Link>
          </>
        )}

        {categorySubObj && (
          <>
            <span>›</span>
            <Link
              href={`/category/${encodeURIComponent(
                categoryMainSlug
              )}/${encodeURIComponent(categorySubSlug)}`}
              className="underline underline-offset-4 hover:text-orange-400 transition-colors"
            >
              {categorySubObj.name.en}
            </Link>
          </>
        )}

        {categorySubSubObj && (
          <>
            <span>›</span>
            <Link
              href={`/category/${encodeURIComponent(
                categoryMainSlug
              )}/${encodeURIComponent(categorySubSlug!)}/${encodeURIComponent(
                categorySubSubSlug
              )}`}
              className="underline underline-offset-4 hover:text-orange-400 transition-colors"
            >
              {categorySubSubObj.name.en}
            </Link>
          </>
        )}
      </h1>

      {filteredProducts.length === 0 ? (
        <p className="text-neutral-400">No products found in this category.</p>
      ) : (
        <>
          <div className="flex flex-col gap-3 lg:hidden">
            {filteredProducts.map((product) => (
              <ListProduct key={product.id} {...product} />
            ))}
          </div>

          <div className="hidden lg:grid lg:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <ListProductDesktop key={product.id} {...product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
