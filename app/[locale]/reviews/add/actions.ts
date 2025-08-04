"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createReview(
  chatRoomId: string,
  productId: number,
  revieweeId: number,
  rating: number,
  comment: string
) {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");

  const existing = await db.review.findUnique({
    where: {
      chatRoomId_reviewerId: {
        chatRoomId,
        reviewerId: session.id!,
      },
    },
  });

  if (existing) throw new Error("You already reviewed this trade");

  await db.review.create({
    data: {
      chatRoomId,
      productId,
      reviewerId: session.id!,
      revieweeId,
      rating,
      comment,
    },
  });

  revalidatePath(`/chats/${chatRoomId}`);
  redirect(`/chats/${chatRoomId}`);
}
