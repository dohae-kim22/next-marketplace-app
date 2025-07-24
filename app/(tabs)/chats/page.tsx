// app/chats/page.tsx
import Link from "next/link";
import Image from "next/image";
import { formatToTimeAgo } from "@/lib/utils";
import { getMyChatRooms } from "@/app/chats/actions";

export default async function ChatList() {
  const rooms = await getMyChatRooms();

  return (
    <div className="p-5 flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-white mb-4">My Chats</h1>

      {rooms.length === 0 ? (
        <p className="text-neutral-400">No chat rooms yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {rooms.map((room) => (
            <li key={room.id}>
              <Link
                href={`/chats/${room.id}`}
                className="flex items-center gap-4 bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition"
              >
                {room.product.photos.length > 0 ? (
                  <Image
                    src={`${room.product.photos[0].url}/avatar`}
                    width={48}
                    height={48}
                    alt={room.product.title}
                    className="size-12 rounded-md object-cover"
                  />
                ) : (
                  <div className="size-12 rounded-md bg-neutral-700" />
                )}

                <div className="flex-1">
                  <p className="text-white font-semibold">
                    {room.product.title}
                  </p>
                  <p className="text-neutral-400 text-sm truncate">
                    {room.messages[0]?.content ?? "No messages yet"}
                  </p>
                </div>

                <div className="text-xs text-neutral-500 whitespace-nowrap">
                  {room.messages[0]
                    ? formatToTimeAgo(room.messages[0].created_at.toString())
                    : ""}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
