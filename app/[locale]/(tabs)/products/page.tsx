import LocationBanner from "@/components/LocationBanner";
import LoadMoreProducts from "@/components/LoadMoreProducts";
import { getFirstProductPage } from "./actions";

export default async function Products() {
  const { items, user } = await getFirstProductPage();

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
