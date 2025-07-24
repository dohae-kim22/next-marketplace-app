import db from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { PlayCircleIcon } from "@heroicons/react/24/solid";

export default async function Live() {
  const streams = await db.liveStream.findMany({
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      title: true,
      streamId: true,
      user: {
        select: { userName: true },
      },
    },
  });

  return (
    <div className="p-5 space-y-6">
      <h1 className="text-2xl font-bold text-white">Live Streams</h1>

      <div className="flex flex-col gap-4">
        {streams.map((stream) => (
          <Link
            key={stream.id}
            href={`/live/${stream.id}`}
            className="flex items-start gap-4 bg-neutral-800 hover:bg-neutral-700 transition rounded-xl overflow-hidden p-3"
          >
            <div className="relative w-32 shrink-0">
              <Image
                src={`https://${process.env.NEXT_PUBLIC_CLOUDFLARE_DOMAIN}/${stream.streamId}/thumbnails/thumbnail.jpg?height=200`}
                alt={`${stream.title} thumbnail`}
                width={640}
                height={360}
                className="w-full aspect-video object-cover rounded-md"
              />
              <PlayCircleIcon className="absolute size-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500 opacity-80" />
            </div>

            <div className="flex flex-col justify-between flex-1 min-w-0">
              <h2 className="text-white text-base font-semibold truncate">
                {stream.title}
              </h2>
              <p className="text-sm text-neutral-400 mt-1 truncate">
                Host: {stream.user.userName}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
