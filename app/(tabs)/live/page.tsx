import db from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {streams.map((stream) => (
          <Link
            key={stream.id}
            href={`/live/${stream.id}`}
            className="border border-neutral-700 rounded-lg overflow-hidden hover:bg-neutral-800 transition"
          >
            <Image
              src={`https://${process.env.CLOUDFLARE_DOMAIN}/${stream.streamId}/thumbnails/thumbnail.jpg?height=200`}
              alt={`${stream.title} thumbnail`}
              width={640}
              height={360}
              className="w-full aspect-video object-cover"
            />
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
