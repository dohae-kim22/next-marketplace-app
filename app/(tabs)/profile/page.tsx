import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ListProduct from "@/components/ListProduct";
import ListPost from "@/components/ListPost";
import { formatToTimeAgo } from "@/lib/utils";
import { getUserWithContent, logOut } from "./actions";
import { getReceivedReviews } from "@/lib/reviews";
import {
  ArrowRightStartOnRectangleIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

export default async function ProfilePage() {
  const user = await getUserWithContent();
  if (!user) return notFound();

  const reviews = await getReceivedReviews(user.id);

  return (
    <div className="container-lg p-5 mb-30 flex flex-col gap-7 md:p-20 md:pt-0 md:mb-10 lg:p-50 lg:pt-10">
      <div className="flex items-center gap-4">
        <Image
          src={user.avatar || "/default-avatar.png"}
          width={70}
          height={70}
          className="rounded-full aspect-square object-cover"
          alt={user.userName}
        />

        <div>
          <h1 className="text-xl font-bold text-white">{user.userName}</h1>
          <p className="text-sm text-neutral-400">
            Joined {formatToTimeAgo(user.created_at.toISOString())}
          </p>
          <div className="flex gap-4 mt-3">
            <Link
              href="/profile/edit"
              className="flex gap-1 text-sm text-neutral-300 hover:text-neutral-400 border rounded-md px-2 py-1 justify-center items-center"
            >
              <PencilIcon className="size-4" />
              <span>Edit Profile</span>
            </Link>

            <form action={logOut}>
              <button className="text-sm text-red-500 hover:text-red-600 flex gap-1 border rounded-md px-2 py-1 justify-center items-center">
                <ArrowRightStartOnRectangleIcon className="size-4" />
                <span>Log out</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-2">
          Received Reviews
        </h2>
        {reviews.length === 0 ? (
          <p className="text-neutral-500">
            You haven&apos;t received any reviews.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-neutral-800 p-4 rounded-lg flex gap-4 items-start"
              >
                <Image
                  src={review.reviewer.avatar ?? "/default-user.png"}
                  alt={review.reviewer.userName}
                  width={40}
                  height={40}
                  className="rounded-full size-10"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">
                      {review.reviewer.userName}
                    </span>
                    <span className="text-yellow-400 text-sm">
                      {"★".repeat(review.rating)}{" "}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-300 mt-1">
                    {review.comment}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                    Product: <strong>{review.product.title}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-2">On Sale</h2>
        {user.products.filter((p) => p.status === "ON_SALE").length === 0 ? (
          <p className="text-neutral-500">You have no items on sale.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {user.products
              .filter((product) => product.status === "ON_SALE")
              .map((product) => (
                <ListProduct key={product.id} {...product} />
              ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-2">Sold Items</h2>
        {user.products.filter((p) => p.status === "SOLD").length === 0 ? (
          <p className="text-neutral-500">
            You haven&apos;t sold anything yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {user.products
              .filter((product) => product.status === "SOLD")
              .map((product) => (
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
