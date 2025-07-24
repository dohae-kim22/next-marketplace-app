import ListPost from "@/components/ListPost";
import db from "@/lib/db";

async function getPosts() {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      photo: true,
      _count: {
        select: {
          comments: true,
          postLikes: true,
        },
      },
    },
  });
  return posts;
}

export const metadata = {
  title: "Town",
};

export default async function Town() {
  const posts = await getPosts();
  return (
    <div className="p-5 flex flex-col">
      {posts.map((post) => (
        <ListPost key={post.id} {...post} />
      ))}
    </div>
  );
}
