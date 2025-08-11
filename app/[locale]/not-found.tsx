import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HomeIcon } from "@heroicons/react/24/outline";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="container-lg min-h-[70vh] flex flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="text-6xl font-bold text-white">404</div>
      <h1 className="text-2xl md:text-3xl font-semibold">{t("title")}</h1>
      <p className="text-neutral-400 max-w-xl">{t("desc")}</p>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600 transition-colors"
        >
          <HomeIcon className="size-5" />
          {t("goHome")}
        </Link>
      </div>
    </div>
  );
}
