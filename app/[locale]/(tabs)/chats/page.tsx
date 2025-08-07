import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { formatToTimeAgo } from "@/lib/utils";
import { getMyChatRooms } from "@/app/[locale]/(headers)/chats/actions";

export default async function ChatList({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const rooms = await getMyChatRooms();

  return (
    <div className="p-5 flex flex-col mb-20 gap-4 mx-auto md:max-w-lg lg:mt-10">
      <h1 className="text-xl font-semibold text-white mb-px">My Chats</h1>

      {rooms.length === 0 ? (
        <p className="text-neutral-400">No chat rooms yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rooms.map((room) => (
            <li key={room.id}>
              <Link
                href={`/chats/${room.id}`}
                className="flex items-center gap-4 bg-neutral-900 hover:bg-neutral-800 transition rounded-xl px-2 py-3 shadow-sm"
              >
                <div className="relative size-12 shrink-0">
                  <Image
                    src={room.otherUser.avatar || "/default-avatar.png"}
                    alt={room.otherUser.userName}
                    fill
                    className="rounded-full object-cover"
                  />
                  {room.product?.photos?.[0]?.url && (
                    <div className="absolute bottom-[-4px] right-[-4px] size-5 rounded-md border-1 border-neutral-800 overflow-hidden">
                      <Image
                        src={`${room.product.photos[0].url}/avatar`}
                        alt={room.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-start">
                    <h2 className="text-white font-semibold truncate">
                      {room.otherUser.userName}
                    </h2>
                    <span className="text-xs text-neutral-400 shrink-0 ml-2">
                      {room.messages[0]
                        ? formatToTimeAgo(
                            room.messages[0].created_at.toString(),
                            locale
                          )
                        : ""}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-xs text-neutral-400 truncate mt-0.5 font-medium">
                      {room.product ? room.product.title : "DM"}
                    </p>

                    {room._count.messages > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-[9px] font-medium rounded-full size-4 flex items-center justify-center">
                        {room._count.messages > 99
                          ? "99"
                          : room._count.messages}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-300 truncate mt-1">
                    {room.messages[0]?.content ?? "No messages yet"}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
