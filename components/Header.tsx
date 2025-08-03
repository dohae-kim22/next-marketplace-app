"use client";

import {
  PlusIcon,
  PlusCircleIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  NewspaperIcon,
  VideoCameraIcon,
  CurrencyEuroIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBar from "./SearchBar";

export default function Header({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();
  const hideSearchAddButton =
    pathname.startsWith("/profile") || pathname.startsWith("/chats");

  const menu = [
    { href: "/products", label: "Marketplace", icon: CurrencyEuroIcon },
    { href: "/posts", label: "My Town", icon: NewspaperIcon },
    { href: "/live", label: "Live", icon: VideoCameraIcon },
    { href: "/chats", label: "Chats", icon: ChatBubbleOvalLeftEllipsisIcon },
  ];

  let addHref: string | undefined;
  let addLabel: string | undefined;
  let searchHref: string | undefined;

  if (pathname.startsWith("/products")) {
    addHref = "/products/add";
    addLabel = "Sell Product";
    searchHref = "/products/search";
  } else if (pathname.startsWith("/posts")) {
    addHref = "/posts/add";
    addLabel = "Write Post";
    searchHref = "/posts/search";
  } else if (pathname.startsWith("/live")) {
    addHref = "/live/add";
    addLabel = "Start Live";
    searchHref = "/live/search";
  }

  return (
    <div className="flex flex-col sticky top-0 z-50 bg-neutral-900 container-lg">
      <div className="flex justify-end py-4 gap-2 md:justify-between">
        <Link
          href={"/products"}
          className="cursor-pointer flex-1 md:flex-none hover:opacity-80"
        >
          <span className="inline-flex items-center justify-center h-8 px-2 border border-orange-400 rounded-md font-audio-wide bg-gradient-to-r from-[#FE971E] to-[#FF6A00] bg-clip-text text-transparent text-lg">
            Next
          </span>
        </Link>

        <div className="flex items-center gap-3 md:hidden">
          {!hideSearchAddButton && (
            <>
              <Link href={searchHref ?? "#"} className="cursor-pointer">
                <MagnifyingGlassIcon className="size-7 text-white" />
              </Link>
              <Link href={addHref ?? "#"} className="cursor-pointer">
                <PlusCircleIcon className="size-7 text-white" />
              </Link>
            </>
          )}
        </div>

        <nav className="hidden md:flex items-center gap-6 justify-center font-semibold lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          {menu.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 transition-colors px-0.5 py-1 
                ${
                  active
                    ? "text-white border-b"
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

        <div className="hidden md:flex items-center gap-5">
          {!hideSearchAddButton && (
            <Link
              href={addHref ?? "#"}
              className="cursor-pointer flex bg-orange-500 text-white items-center justify-center gap-1 rounded-md py-1 px-2 hover:bg-orange-600"
            >
              <PlusIcon className="size-4" />
              <span>{addLabel}</span>
            </Link>
          )}
          <Link
            href="/profile"
            className="flex flex-col gap-px items-center bg-neutral-800 p-1.5 rounded-full text-white hover:text-neutral-400"
          >
            <UserIcon className="size-6" />
          </Link>
        </div>
      </div>
      <div>
        <SearchBar />
      </div>
    </div>
  );
}
