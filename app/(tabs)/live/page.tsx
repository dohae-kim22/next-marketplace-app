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
    <div className="p-5 space-y-5">
      <h1 className="text-xl font-semibold text-white">Live Streams</h1>
      <div className="flex flex-col">
        {streams.map((stream) => (
          <Link
            key={stream.id}
            href={`/live/${stream.id}`}
            className="border-b border-neutral-700 rounded-lg overflow-hidden hover:bg-neutral-800 transition flex"
          >
            <div className="relative w-32">
              <Image
                src={`https://${process.env.NEXT_PUBLIC_CLOUDFLARE_DOMAIN}/${stream.streamId}/thumbnails/thumbnail.jpg?height=200`}
                alt={`${stream.title} thumbnail`}
                width={640}
                height={360}
                className="w-full aspect-video object-cover"
              />
              <PlayCircleIcon className="absolute z-2 size-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500 opacity-70" />
            </div>
            <div className="p-3">
              <h2 className="text-lg font-medium text-white truncate">
                {stream.title}
              </h2>
              <p className="text-sm text-neutral-400">
                Host: {stream.user.userName}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
