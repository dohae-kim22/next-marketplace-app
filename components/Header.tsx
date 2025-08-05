"use client";

import {
  PlusCircleIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  NewspaperIcon,
  VideoCameraIcon,
  CurrencyEuroIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import SearchBar from "./SearchBar";
import MobileNavigationBar from "./MobileNavigationBar";
import NavigationBar from "./NavigationBar";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function Header({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();
  const t = useTranslations("header");

  const segments = pathname.split("/").filter(Boolean);
  const pathWithoutLocale = segments.slice(1).join("/") || "/";

  const hideSearchAddButton =
    pathname.startsWith("/profile") || pathname.startsWith("/chats");

  const menu = [
    { href: "products", label: t("menu.products"), icon: CurrencyEuroIcon },
    { href: "posts", label: t("menu.posts"), icon: NewspaperIcon },
    { href: "live", label: t("menu.live"), icon: VideoCameraIcon },
    {
      href: "/chats",
      label: t("menu.chats"),
      icon: ChatBubbleOvalLeftEllipsisIcon,
    },
  ];

  let addHref: string | undefined;
  let searchHref: string | undefined;

  if (
    pathWithoutLocale.startsWith("products") ||
    pathWithoutLocale.startsWith("category")
  ) {
    addHref = "/products/add";
    searchHref = "/products/search";
  } else if (pathWithoutLocale.startsWith("posts")) {
    addHref = "/posts/add";
    searchHref = "/posts/search";
  } else if (pathWithoutLocale.startsWith("live")) {
    addHref = "/live/add";
    searchHref = "/live/search";
  }

  return (
    <div className="flex flex-col sticky top-0 z-50 bg-neutral-900 container-lg">
      <div className="flex justify-end py-4 gap-2 md:justify-between">
        <Link
          href={"/products"}
          className="cursor-pointer flex-1 md:flex-none hover:opacity-80 py-1.5"
        >
          <span className="inline-flex items-center justify-center h-8 px-2 border border-orange-400 rounded-md font-audio-wide bg-gradient-to-r from-[#FE971E] to-[#FF6A00] bg-clip-text text-transparent text-lg">
            Next
          </span>
        </Link>

        <div className="flex items-center gap-3 lg:hidden">
          <>
            {!hideSearchAddButton && (
              <Link href={searchHref ?? "#"} className="cursor-pointer">
                <MagnifyingGlassIcon className="size-7 text-white" />
              </Link>
            )}
            <Link href={addHref ?? "#"} className="cursor-pointer">
              <PlusCircleIcon className="size-7 text-white" />
            </Link>
            <Link href="#">
              <HeartIcon className="size-7 text-white" />
            </Link>
            <LanguageSwitcher />
            <MobileNavigationBar />
          </>
        </div>

        <nav className="hidden lg:flex items-center gap-6 justify-center font-semibold absolute left-1/2 -translate-x-1/2">
          {menu.map(({ href, label, icon: Icon }) => {
            const active = pathWithoutLocale.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 transition-colors px-0.5 py-1.5 
                ${
                  active
                    ? "text-white border-b-2"
                    : "text-neutral-400 hover:text-white"
                }
              `}
              >
                <Icon className="size-5" />
                <span>{label}</span>
                {href === "/chats" && unreadCount > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-2 py-0.5">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="#"
            className="border-b-2 text-white hover:text-red-500 border-transparent hover:border-white py-1.5"
          >
            <HeartIcon className="size-7" />
          </Link>
          <Link
            href="/profile"
            className=" text-white border-b-2 border-transparent hover:border-white py-1.5"
          >
            <UserIcon className="size-7" />
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
      <div>
        <SearchBar />
        <NavigationBar />
      </div>
    </div>
  );
}
