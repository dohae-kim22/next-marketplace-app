"use server";

import db from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma";
import {getSession} from "@/lib/session";
import { redirect } from "next/navigation";

export async function createOrGetChatRoom(formData: FormData) {
  const productId = Number(formData.get("productId"));
  const session = await getSession();

  if (!session?.id || isNaN(productId)) {
    throw new Error("Invalid data");
  }

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found");

  const existingRoom = await db.chatRoom.findFirst({
    where: { buyerId: session.id, productId },
  });

  if (existingRoom) {
    redirect(`/chats/${existingRoom.id}`);
  }

  const room = await db.chatRoom.create({
    data: { productId, buyerId: session.id!, sellerId: product.userId },
  });

  redirect(`/chats/${room.id}`);
}

export async function getMessages(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: { chatRoomId },
    orderBy: { created_at: "asc" },
    select: {
      id: true,
      content: true,
      created_at: true,
      read: true,
      sender: {
        select: {
          id: true,
          userName: true,
          avatar: true,
        },
      },
    },
  });

  return messages;
}

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

export async function saveMessage(content: string, chatRoomId: string) {
  const session = await getSession();
  await db.message.create({
    data: {
      content,
      chatRoomId,
      senderId: session.id!,
    },
    select: { id: true },
  });
}

export async function getMyChatRooms() {
  const session = await getSession();
  if (!session.id) return [];

  const rooms = await db.chatRoom.findMany({
    where: {
      OR: [{ buyerId: session.id }, { sellerId: session.id }],
    },
    include: {
      product: {
        select: {
          title: true,
          photos: { select: { url: true }, take: 1 },
        },
      },
      messages: {
        orderBy: { created_at: "desc" },
        take: 1,
        select: {
          content: true,
          created_at: true,
          read: true,
          senderId: true,
        },
      },
      _count: {
        select: {
          messages: {
            where: {
              read: false,
              senderId: { not: session.id },
            },
          },
        },
      },
    },
    orderBy: {
      updated_at: "desc",
    },
  });

  return rooms;
}

export async function markMessagesAsRead(chatRoomId: string) {
  const session = await getSession();

  await db.message.updateMany({
    where: {
      chatRoomId,
      senderId: { not: session.id }, // 내가 보낸 게 아닌 메시지들만
      read: false,
    },
    data: {
      read: true,
    },
  });
}
