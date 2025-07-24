"use client";

import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const linkHref = pathname.startsWith("/products")
    ? "/products/add"
    : pathname.startsWith("/posts")
    ? "/posts/add"
    : pathname.startsWith("/live")
    ? "/live/add"
    : "#";

  const searchHref = pathname.startsWith("/products")
    ? "/products/search"
    : pathname.startsWith("/posts")
    ? "/posts/search"
    : pathname.startsWith("/live")
    ? "/live/search"
    : "#";

  const hideSearchAddButton = pathname === "/profile" || pathname === "/chats";

  return (
    <div className="flex justify-end p-4 gap-2">
      <Link
        href={"/products"}
        className="cursor-pointer flex-1 hover:opacity-80"
      >
        <span className="inline-flex items-center justify-center h-8 px-2 border border-orange-400 rounded-md font-audio-wide bg-gradient-to-r from-[#FE971E] to-[#FF6A00] bg-clip-text text-transparent text-lg">
          Next
        </span>
      </Link>
      {!hideSearchAddButton && (
        <>
          <Link href={searchHref} className="cursor-pointer">
            <MagnifyingGlassIcon className="size-7 text-white" />
          </Link>
          <Link href={linkHref} className="cursor-pointer">
            <PlusCircleIcon className="size-7 text-white" />
          </Link>
        </>
      )}
    </div>
  );
}
