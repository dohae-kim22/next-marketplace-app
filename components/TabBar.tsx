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

  const isActive = (path: string) =>
    pathname.startsWith(`/${locale}${path}`)
      ? "text-white"
      : "text-neutral-500";

  return (
    <>
      <div
        className="lg:hidden"
        style={{ height: "calc(56px + env(safe-area-inset-bottom))" }}
      />

      <div
        className="fixed inset-x-0 bottom-0 z-50 flex justify-between md:justify-around px-5 border-t border-neutral-600 bg-neutral-900 lg:hidden transform-gpu"
        style={{
          paddingTop: "0.75rem",
          paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
        }}
      >
        <Link
          href="/products"
          className={`flex flex-col gap-px items-center ${isActive(
            "/products"
          )}`}
        >
          <HomeIcon className="size-7" />
          <span>{t("home")}</span>
        </Link>

        <Link
          href="/posts"
          className={`flex flex-col gap-px items-center ${isActive("/posts")}`}
        >
          <NewspaperIcon className="size-7" />
          <span>{t("town")}</span>
        </Link>

        <Link
          href="/chats"
          className={`flex flex-col gap-px items-center relative ${isActive(
            "/chats"
          )}`}
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
          className={`flex flex-col gap-px items-center ${isActive("/live")}`}
        >
          <VideoCameraIcon className="size-7" />
          <span>{t("live")}</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col gap-px items-center ${isActive(
            "/profile"
          )}`}
        >
          <UserIcon className="size-7" />
          <span className="text-inherit">{t("my")}</span>
        </Link>
      </div>
    </>
  );
}
