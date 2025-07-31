import db from "@/lib/db";
import ListPost from "@/components/ListPost";
import FormInput from "@/components/FormInput";

interface PostSearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function PostSearchPage({
  searchParams,
}: PostSearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim();

  const posts = query
    ? await db.post.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
          ],
        },
        orderBy: {
          created_at: "desc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          created_at: true,
          views: true,
          photo: true,
          _count: {
            select: {
              comments: true,
              postLikes: true,
            },
          },
        },
      })
    : [];

  return (
    <div className="p-5 space-y-4">
      <form>
        <FormInput
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search posts by keyword..."
        />
      </form>

      {posts.length === 0 ? (
        <p className="text-white">No posts found.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <ListPost key={post.id} {...post} />
          ))}
        </div>
      )}
    </div>
  );
}
