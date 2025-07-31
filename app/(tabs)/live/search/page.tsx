import db from "@/lib/db";
import ListStream from "@/components/ListStream";
import FormInput from "@/components/FormInput";

interface LiveSearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function LiveSearchPage({
  searchParams,
}: LiveSearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim();

  const streams = query
    ? await db.liveStream.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query,
              },
            },
            {
              description: {
                contains: query,
              },
            },
          ],
        },
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          title: true,
          streamId: true,
          user: {
            select: { userName: true },
          },
        },
      })
    : [];

  return (
    <div className="p-5 space-y-6">
      <h1 className="text-2xl font-bold text-white">Search Streams</h1>

      <form className="mb-4">
        <FormInput
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Find a stream..."
        />
      </form>

      {streams.length === 0 ? (
        <p className="text-neutral-400">No streams found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {streams.map((stream) => (
            <ListStream key={stream.id} {...stream} />
          ))}
        </div>
      )}
    </div>
  );
}
