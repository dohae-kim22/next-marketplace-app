import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { formatShortAddress, formatToTimeAgo } from "@/lib/utils";
import { EyeIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import PostLikeButton from "@/components/PostLikeButton";
import CommentSection from "@/components/CommentSection";
import { Link } from "@/i18n/navigation";

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: {
        user: {
          select: {
            userName: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
        comments: {
          where: { parentId: null },
          include: {
            user: { select: { userName: true, avatar: true, id: true } },
            replies: {
              include: {
                user: { select: { userName: true, avatar: true, id: true } },
              },
              orderBy: { created_at: "asc" },
            },
          },
          orderBy: { created_at: "desc" },
        },
      },
    });
    return post;
  } catch (e) {
    return null;
  }
}

async function getUser() {
  const session = await getSession();
  const currentUser = await db.user.findUnique({
    where: { id: session.id },
  });
  return currentUser;
}

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
  revalidate: 60,
});

async function getLikeStatus(postId: number, userId: number | null) {
  const session = await getSession();
  const isLiked = userId
    ? await db.postLike.findUnique({
        where: {
          postId_userId: {
            postId,
            userId: session.id!,
          },
        },
      })
    : null;

  const likeCount = await db.postLike.count({
    where: { postId },
  });

  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

export default async function PostDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (isNaN(numericId)) return notFound();

  const post = await getCachedPost(numericId);
  if (!post) return notFound();

  const currentUser = await getUser();

  const { likeCount, isLiked } = await getLikeStatus(
    numericId,
    currentUser?.id ?? null
  );

  return (
    <div className="container-lg p-5 text-white md:p-20 md:pt-0 lg:p-50 lg:pt-0">
      <Link
        href={`/users/${post.userId}`}
        className="flex items-center gap-2 mb-3"
      >
        <Image
          width={30}
          height={30}
          className="size-9 rounded-full"
          src={post.user.avatar!}
          alt={post.user.userName}
        />
        <div className="flex flex-col justify-center text-neutral-300">
          <span className="text-sm font-semibold">{post.user.userName}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </Link>

      <div className="flex flex-col gap-2 md:gap-3 md:mb-5">
        <h2 className="text-lg font-semibold">{post.title}</h2>
        <p className="text-sm text-justify mb-2">{post.description}</p>
        {post.photo ? (
          <div className="relative w-full mx-auto h-60 md:w-lg md:h-80">
            <Image
              src={`${post.photo}/public`}
              fill
              className="absolute object-cover"
              alt={post.title}
            />
          </div>
        ) : null}
      </div>

      <div className="flex gap-2 text-neutral-400 text-sm font-semibold mt-3 items-center">
        <MapPinIcon className="size-5" />
        <span>{formatShortAddress(post.location)}</span>
      </div>

      <div className="flex gap-4 items-center justify-between mt-1">
        <div className="flex items-center gap-2 text-neutral-400 text-xs">
          <EyeIcon className="size-5" />
          <span>{post.views} Views</span>
        </div>

        <PostLikeButton
          isLiked={isLiked}
          likeCount={likeCount}
          postId={numericId}
        />
      </div>
      <CommentSection
        postId={numericId}
        comments={post.comments}
        currentUserName={currentUser?.userName ?? "Anonymous"}
        currentUserAvatar={currentUser?.avatar ?? "/default-user.png"}
        currentUserId={currentUser?.id ?? 9999999}
      />
    </div>
  );
}
