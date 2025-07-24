import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import PostLikeButton from "@/components/PostLikeButton";
import CommentSection from "@/components/CommentSection";

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
          include: {
            user: { select: { userName: true } },
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
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  const post = await getCachedPost(id);
  if (!post) return notFound();

  const currentUser = await getUser();

  const { likeCount, isLiked } = await getLikeStatus(
    id,
    currentUser?.id ?? null
  );

  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        <Image
          width={28}
          height={28}
          className="size-7 rounded-full"
          src={post.user.avatar!}
          alt={post.user.userName}
        />
        <div>
          <span className="text-sm font-semibold">{post.user.userName}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>

      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>

        <PostLikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
      </div>
      <CommentSection
        postId={id}
        comments={post.comments}
        currentUserName={currentUser?.userName ?? "Anonymous"}
      />
    </div>
  );
}
