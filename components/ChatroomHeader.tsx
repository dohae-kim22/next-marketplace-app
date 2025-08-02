import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function ChatroomHeader({ opponent }: { opponent: string }) {
  return (
    <div className="flex items-center border-b border-neutral-700 py-3">
      <Link href={"/chats"}>
        <ChevronLeftIcon className="size-5 text-white hover:text-neutral-400" />
      </Link>
      <h1 className="absolute left-1/2 -translate-x-1/2">{opponent}</h1>
    </div>
  );
}
