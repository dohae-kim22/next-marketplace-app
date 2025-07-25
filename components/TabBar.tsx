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

export default function TabBar({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();

  return (
    <div className="fixed z-10 bottom-0 flex justify-between w-full mx-auto max-w-sm px-5 py-3 border-neutral-600 border-t bg-neutral-900 *:text-white">
      <Link href="/products" className="flex flex-col gap-px items-center">
        {pathname.startsWith("/products") ? (
          <HomeIconSolid className="size-7" />
        ) : (
          <HomeIconOutline className="size-7" />
        )}
        <span>Home</span>
      </Link>
      <Link href="/posts" className="flex flex-col gap-px items-center">
        {pathname.startsWith("/posts") ? (
          <NewspaperIconSolid className="size-7" />
        ) : (
          <NewspaperIconOutline className="size-7" />
        )}
        <span>Town</span>
      </Link>
      <Link
        href="/chats"
        className="flex flex-col gap-px items-center relative"
      >
        {pathname.startsWith("/chats") ? (
          <ChatBubbleOvalLeftEllipsisIconSolid className="size-7" />
        ) : (
          <ChatBubbleOvalLeftEllipsisIconOutline className="size-7" />
        )}
        <span>Chats</span>
        {unreadCount > 0 && (
          <span className="flex justify-center items-center absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full size-4">
            {unreadCount > 99 ? "99" : unreadCount}
          </span>
        )}
      </Link>
      <Link href="/live" className="flex flex-col gap-px items-center">
        {pathname.startsWith("/live") ? (
          <VideoCameraIconSolid className="size-7" />
        ) : (
          <VideoCameraIconOutline className="size-7" />
        )}
        <span>Live</span>
      </Link>
      <Link href="/profile" className="flex flex-col gap-px items-center">
        {pathname.startsWith("/profile") ? (
          <UserIconSolid className="size-7" />
        ) : (
          <UserIconOutline className="size-7" />
        )}
        <span>My</span>
      </Link>
    </div>
  );
}
