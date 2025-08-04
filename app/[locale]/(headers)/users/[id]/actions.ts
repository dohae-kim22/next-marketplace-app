"use server";

import { getSession } from "@/lib/session";
import db from "@/lib/db";
import { redirect } from "next/navigation";

export async function createChatWithUser(userId: number) {
  const session = await getSession();
  if (!session?.id || session.id === userId) return;

  const existingRoom = await db.chatRoom.findFirst({
    where: {
      buyerId: session.id,
      sellerId: userId,
      productId: null,
    },
  });

  if (existingRoom) {
    return redirect(`/chats/${existingRoom.id}`);
  }

  const newRoom = await db.chatRoom.create({
    data: {
      buyerId: session.id,
      sellerId: userId,
    },
  });

  return redirect(`/chats/${newRoom.id}`);
}
