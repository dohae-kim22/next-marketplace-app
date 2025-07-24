import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ListProduct from "@/components/ListProduct";
import ListPost from "@/components/ListPost";
import { formatToTimeAgo } from "@/lib/utils";
import { logOut } from "./actions";

async function getUserWithContent() {
  const session = await getSession();
  if (!session?.id) return null;

  const user = await db.user.findUnique({
    where: { id: session.id },
    include: {
      products: {
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          title: true,
          price: true,
          photo: true,
          created_at: true,
          views: true,
          productLikes: true,
          location: true,
          status: true,
          type: true,
        },
      },
      posts: {
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          photo: true,
          created_at: true,
          views: true,
          _count: {
            select: {
              postLikes: true,
              comments: true,
            },
          },
        },
      },
    },
  });

  return user;
}

export default async function ProfilePage() {
  const user = await getUserWithContent();
  if (!user) return notFound();

  return (
    <div className="p-5 space-y-10">
      <div className="flex items-center gap-4">
        <Image
          src={user.avatar || "/default-avatar.png"}
          width={60}
          height={60}
          className="rounded-full aspect-square object-cover"
          alt={user.userName}
        />
        <div>
          <h1 className="text-xl font-bold text-white">{user.userName}</h1>
          <p className="text-sm text-neutral-400">
            Joined {formatToTimeAgo(user.created_at.toISOString())}
          </p>
          <Link
            href="/profile/edit"
            className="text-sm text-orange-400 hover:underline"
          >
            Edit Profile
          </Link>
        </div>
        <form action={logOut}>
          <button className="text-sm text-red-500 underline">Log out</button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-2">My Products</h2>
        {user.products.length === 0 ? (
          <p className="text-neutral-500">
            You haven&apos;t posted any products.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {user.products.map((product) => (
              <ListProduct key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-2">My Posts</h2>
        {user.posts.length === 0 ? (
          <p className="text-neutral-500">
            You haven&apos;t written any posts.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {user.posts.map((post) => (
              <ListPost key={post.id} {...post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
