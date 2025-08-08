"use server";

import { redirect } from "@/i18n/navigation";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { getLocale } from "next-intl/server";
import { revalidateTag } from "next/cache";

export async function likePost(postId: number) {
  const session = await getSession();
  try {
    await db.postLike.create({
      data: {
        postId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {
    console.error(e);
  }
}

export async function dislikePost(postId: number) {
  try {
    const session = await getSession();
    await db.postLike.delete({
      where: {
        postId_userId: {
          postId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {
    console.error(e);
  }
}

export async function createComment(
  postId: number,
  content: string,
  parentId?: number
) {
  const session = await getSession();
  if (!session.id || !content.trim()) return;

  await db.comment.create({
    data: {
      content,
      postId,
      userId: session.id,
      parentId: parentId ?? null,
    },
  });

  revalidateTag(`comments-${postId}`);
}

export async function deletePost(postId: number) {
  const session = await getSession();
  const post = await db.post.findUnique({ where: { id: postId } });
  const locale = await getLocale();

  if (!post || post.userId !== session.id) {
    throw new Error("Not authorized to delete this post");
  }

  await db.post.delete({ where: { id: postId } });

  redirect({
    href: "/posts",
    locale,
  });
}

export async function deleteComment(commentId: number, postId: number) {
  const session = await getSession();
  const comment = await db.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment || comment.userId !== session.id) {
    throw new Error("Not authorized to delete this comment");
  }

  await db.comment.update({
    where: { id: commentId },
    data: { content: "This comment has been deleted." },
  });

  revalidateTag(`comments-${postId}`);
}
