"use client";

import {
  ChatBubbleOvalLeftEllipsisIcon,
  HomeIcon,
  NewspaperIcon,
  UserIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/solid";

import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function TabBar({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("tabBar");

  return (
    <div className="fixed z-10 bottom-0 flex justify-between md:justify-around w-full mx-auto px-5 py-3 border-neutral-600 border-t bg-neutral-900 lg:hidden">
      <Link
        href="/products"
        className={`flex flex-col gap-px items-center ${
          pathname.startsWith(`/${locale}/products`)
            ? "text-white"
            : "text-neutral-500"
        }`}
      >
        <HomeIcon className="size-7" />
        <span>{t("home")}</span>
      </Link>

      <Link
        href="/posts"
        className={`flex flex-col gap-px items-center ${
          pathname.startsWith(`/${locale}/posts`)
            ? "text-white"
            : "text-neutral-500"
        }`}
      >
        <NewspaperIcon className="size-7" />
        <span>{t("town")}</span>
      </Link>

      <Link
        href="/chats"
        className={`flex flex-col gap-px items-center relative ${
          pathname.startsWith(`/${locale}/chats`)
            ? "text-white"
            : "text-neutral-500"
        }`}
      >
        <ChatBubbleOvalLeftEllipsisIcon className="size-7" />
        <span>{t("chats")}</span>
        {unreadCount > 0 && (
          <span className="flex justify-center items-center absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full size-4">
            {unreadCount > 99 ? "99" : unreadCount}
          </span>
        )}
      </Link>

      <Link
        href="/live"
        className={`flex flex-col gap-px items-center ${
          pathname.startsWith(`/${locale}/live`)
            ? "text-white"
            : "text-neutral-500"
        }`}
      >
        <VideoCameraIcon className="size-7" />
        <span>{t("live")}</span>
      </Link>

      <Link
        href="/profile"
        className={`flex flex-col gap-px items-center ${
          pathname.startsWith(`/${locale}/profile`)
            ? "text-white"
            : "text-neutral-500"
        }`}
      >
        <UserIcon className="size-7" />
        <span className="text-inherit">{t("my")}</span>
      </Link>
    </div>
  );
}
