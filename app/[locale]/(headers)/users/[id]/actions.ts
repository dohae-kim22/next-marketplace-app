"use server";

import { getSession } from "@/lib/session";
import db from "@/lib/db";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export async function createChatWithUser(userId: number) {
  const locale = await getLocale();
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
    return redirect({
      href: `/chats/${existingRoom.id}`,
      locale,
    });
  }

  const newRoom = await db.chatRoom.create({
    data: {
      buyerId: session.id,
      sellerId: userId,
    },
  });

  return redirect({
    href: `/chats/${newRoom.id}`,
    locale,
  });
}
