"use client";

import {
  ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisIconSolid,
  HomeIcon as HomeIconSolid,
  NewspaperIcon as NewspaperIconSolid,
  UserIcon as UserIconSolid,
  VideoCameraIcon as VideoCameraIconSolid,
} from "@heroicons/react/24/solid";
import {
  ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisIconOutline,
  HomeIcon as HomeIconOutline,
  NewspaperIcon as NewspaperIconOutline,
  UserIcon as UserIconOutline,
  VideoCameraIcon as VideoCameraIconOutline,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 flex justify-between w-full mx-auto max-w-sm px-5 py-3 border-neutral-600 border-t bg-neutral-900 *:text-white">
      <Link href="/products" className="flex flex-col gap-px items-center">
        {pathname === "/products" ? (
          <HomeIconSolid className="size-7" />
        ) : (
          <HomeIconOutline className="size-7" />
        )}
        <span>Home</span>
      </Link>
      <Link href="/town" className="flex flex-col gap-px items-center">
        {pathname === "/town" ? (
          <NewspaperIconSolid className="size-7" />
        ) : (
          <NewspaperIconOutline className="size-7" />
        )}
        <span>Town</span>
      </Link>
      <Link href="/chat" className="flex flex-col gap-px items-center">
        {pathname === "/chat" ? (
          <ChatBubbleOvalLeftEllipsisIconSolid className="size-7" />
        ) : (
          <ChatBubbleOvalLeftEllipsisIconOutline className="size-7" />
        )}
        <span>Chats</span>
      </Link>
      <Link href="/live" className="flex flex-col gap-px items-center">
        {pathname === "/live" ? (
          <VideoCameraIconSolid className="size-7" />
        ) : (
          <VideoCameraIconOutline className="size-7" />
        )}
        <span>Live</span>
      </Link>
      <Link href="/profile" className="flex flex-col gap-px items-center">
        {pathname === "/profile" ? (
          <UserIconSolid className="size-7" />
        ) : (
          <UserIconOutline className="size-7" />
        )}
        <span>My</span>
      </Link>
    </div>
  );
}
