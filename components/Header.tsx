"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
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

  return (
    <div className="flex justify-end p-4">
      <Link
        href={linkHref}
        className="size-7 bg-orange-500 rounded-full flex justify-center items-center cursor-pointer hover:bg-orange-400"
      >
        <PlusIcon className="text-white" />
      </Link>
    </div>
  );
}
