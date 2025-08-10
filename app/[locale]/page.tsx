import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export const revalidate = 60;

export default async function Home() {
  const t = await getTranslations("home");

  return (
    <>
      <div className="flex flex-col min-h-screen items-center justify-between mx-auto p-6 md:max-w-xl md:p-15">
        <div className="absolute right-5">
          <LanguageSwitcher />
        </div>
        <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
          <Image
            src="/logo.png"
            alt={t("logoAlt")}
            width={128}
            height={128}
            priority
            sizes="128px"
            className="object-contain"
          />
          <h1 className="text-4xl text-neutral-10">{t("title")}</h1>
          <h2 className="text-sm text-neutral-400">{t("subtitle")}</h2>
        </div>
        <div className="flex flex-col gap-3 items-center w-full sticky bottom-3">
          <Link href="/create-account" className="primary-btn py-2 text-lg">
            {t("createAccount")}
          </Link>
          <div className="flex gap-2">
            <span>{t("alreadyMember")}</span>
            <Link href="/login" className="hover:underline">
              {t("signIn")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
