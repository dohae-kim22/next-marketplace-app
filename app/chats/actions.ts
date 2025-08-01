"use server";

import db from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
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
      buyer: { select: { id: true, userName: true, avatar: true } },
      seller: { select: { id: true, userName: true, avatar: true } },
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

  return rooms.map((room) => {
    const otherUser = room.buyer.id === session.id ? room.seller : room.buyer;

    return {
      ...room,
      otherUser,
    };
  });
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

export async function completeTradeAction(chatRoomId: string) {
  const session = await getSession();
  const room = await db.chatRoom.findUnique({
    where: { id: chatRoomId },
    select: {
      buyerId: true,
      sellerId: true,
      buyerCompleted: true,
      sellerCompleted: true,
      productId: true,
    },
  });

  if (!room || !session?.id) return;

  if (room.buyerId === session.id && !room.buyerCompleted) {
    await db.chatRoom.update({
      where: { id: chatRoomId },
      data: { buyerCompleted: true },
    });
  }

  if (room.sellerId === session.id && !room.sellerCompleted) {
    await db.chatRoom.update({
      where: { id: chatRoomId },
      data: { sellerCompleted: true },
    });
  }

  const updated = await db.chatRoom.findUnique({
    where: { id: chatRoomId },
  });

  if (
    updated?.buyerCompleted &&
    updated?.sellerCompleted &&
    updated?.productId
  ) {
    await db.product.update({
      where: { id: updated.productId },
      data: { status: "SOLD" },
    });
  }

  revalidatePath(`/chats/${chatRoomId}`);
}
