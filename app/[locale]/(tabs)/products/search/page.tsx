import FormInput from "@/components/FormInput";
import LoadMoreSearchedProducts from "@/components/LoadMoreSearchedProducts";
import { getFirstSearchPage } from "../actions";
import { getTranslations } from "next-intl/server";

interface ProductSearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function ProductSearchPage({
  searchParams,
}: ProductSearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const t = await getTranslations("loadMoreProducts");

  if (!query) {
    return (
      <div className="container-lg p-5 flex flex-col gap-3 mb-20">
        <form className="mb-4 lg:hidden">
          <FormInput
            type="text"
            name="q"
            defaultValue=""
            placeholder={t("searchPlaceholder")}
          />
        </form>
        <p className="text-white">{t("typeSomethingToSearch")}</p>
      </div>
    );
  }

  const items = await getFirstSearchPage(query);

  return (
    <div className="container-lg p-5 flex flex-col gap-3 mb-20">
      <form className="mb-4 lg:hidden">
        <FormInput
          type="text"
          name="q"
          defaultValue={query}
          placeholder={t("searchPlaceholder")}
        />
      </form>

      {items.length === 0 ? (
        <p className="text-neutral-400">{t("noProducts")}</p>
      ) : (
        <LoadMoreSearchedProducts
          key={query}
          initialItems={items as any}
          query={query}
        />
      )}
    </div>
  );
}
