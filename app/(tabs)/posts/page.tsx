import ListPost from "@/components/ListPost";
import db from "@/lib/db";
import { getUserWithLocation } from "@/lib/session";
import { getDistanceFromLatLonInKm } from "@/lib/utils";

async function getAllPosts() {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      photo: true,
      latitude: true,
      longitude: true,
      location: true,
      _count: {
        select: {
          comments: true,
          postLikes: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return posts;
}

async function getFilteredPostsByLocation() {
  const user = await getUserWithLocation();

  if (!user?.latitude || !user.longitude || !user.radius) {
    return getAllPosts();
  }

  const allPosts = await getAllPosts();

  return allPosts
    .map((post) => {
      if (post.latitude === null || post.longitude === null) return null;
      const distance = getDistanceFromLatLonInKm(
        user.latitude!,
        user.longitude!,
        post.latitude,
        post.longitude
      );
      return { ...post, distance };
    })
    .filter(
      (post) => post && post.distance! <= user.radius!
    ) as ((typeof allPosts)[0] & { distance: number })[];
}

export const metadata = {
  title: "Town",
};

export default async function Town() {
  const posts = await getFilteredPostsByLocation();

  return (
    <div className="p-5 flex flex-col mb-30">
      {posts.map((post) => (
        <ListPost key={post.id} {...post} />
      ))}
    </div>
  );
}
