"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
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
