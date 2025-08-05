"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Home() {
  const t = useTranslations("home");

  return (
    <>
      <div className="flex flex-col min-h-screen items-center justify-between mx-auto p-6 md:max-w-xl md:p-10">
        <div className="absolute right-5">
          <LanguageSwitcher />
        </div>
        <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
          <img src="/logo.png" alt={t("logoAlt")} className="h-32" />
          <h1 className="text-4xl text-neutral-10">{t("title")}</h1>
          <h2 className="text-sm text-neutral-400">{t("subtitle")}</h2>
        </div>
        <div className="flex flex-col gap-3 items-center w-full sticky bottom-0">
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
