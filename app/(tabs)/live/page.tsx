import db from "@/lib/db";
import ListStream from "@/components/ListStream";

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
          <ListStream key={stream.id} {...stream} />
        ))}
      </div>
    </div>
  );
}
