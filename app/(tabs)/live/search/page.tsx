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
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          title: true,
          streamId: true,
          description: true,
          user: {
            select: { userName: true },
          },
        },
      })
    : [];

  return (
    <div className="p-5 flex flex-col gap-5 md:p-15 md:pt-0 lg:max-w-4xl lg:mx-auto">
      <form className="md:hidden">
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
