"use server";

import { redirect } from "@/i18n/navigation";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";

export async function createReview(
  chatRoomId: string,
  productId: number,
  revieweeId: number,
  rating: number,
  comment: string
) {
  const session = await getSession();
  const locale = await getLocale();
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
  redirect({
    href: `/chats/${chatRoomId}`,
    locale,
  });
}
