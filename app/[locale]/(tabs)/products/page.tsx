import LocationBanner from "@/components/LocationBanner";
import LoadMoreProducts from "@/components/LoadMoreProducts";
import { getFirstProductPage } from "./actions";
import { getTranslations } from "next-intl/server";

export default async function Products() {
  const { items, user } = await getFirstProductPage();
  const t = await getTranslations("loadMoreProducts");
  const labels = {
    loadMore: t("loadMore"),
    loading: t("loading"),
    noProducts: t("noProducts"),
  };

  return (
    <div className="container-lg px-5 flex flex-col gap-3 mb-30">
      <LocationBanner
        location={user?.location ?? undefined}
        radius={user?.radius ?? undefined}
      />
      <LoadMoreProducts initialItems={items} labels={labels} />
    </div>
  );
}
