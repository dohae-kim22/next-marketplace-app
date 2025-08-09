"use server";

import { redirect } from "@/i18n/navigation";
import db from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma";
import { getSession } from "@/lib/session";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";

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

  const locale = await getLocale();

  if (existingRoom) {
    redirect({
      href: `/chats/${existingRoom.id}`,
      locale,
    });
  }

  const room = await db.chatRoom.create({
    data: { productId, buyerId: session.id!, sellerId: product.userId },
  });

  redirect({
    href: `/chats/${room.id}`,

    locale,
  });
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
      NOT: [
        { buyerId: session.id, buyerLeft: true },
        { sellerId: session.id, sellerLeft: true },
      ],
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
            where: { read: false, senderId: { not: session.id } },
          },
        },
      },
    },
  });

  const enriched = rooms.map((room) => {
    const otherUser = room.buyer.id === session.id ? room.seller : room.buyer;
    const lastMessageAt =
      room.messages.length > 0 ? room.messages[0].created_at : room.updated_at;
    return { ...room, otherUser, lastMessageAt };
  });

  enriched.sort(
    (a, b) =>
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );

  return enriched;
}

export async function markMessagesAsRead(chatRoomId: string) {
  const session = await getSession();

  await db.message.updateMany({
    where: {
      chatRoomId,
      senderId: { not: session.id },
      read: false,
    },
    data: {
      read: true,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/chats", "layout");
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

export async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      buyer: {
        select: { id: true, userName: true },
      },
      seller: {
        select: { id: true, userName: true },
      },
      product: {
        select: {
          id: true,
          title: true,
          photo: true,
          price: true,
          status: true,
        },
      },
    },
  });

  if (!room) return null;

  const session = await getSession();
  const sessionId = session.id;

  const canSee = room.buyer.id === sessionId || room.seller.id === sessionId;

  if (!canSee) {
    return null;
  }

  return room;
}

export async function getUserProfile() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id!,
    },
    select: {
      userName: true,
      avatar: true,
    },
  });
  return user;
}

export async function getReviewStatus(chatRoomId: string, userId: number) {
  const review = await db.review.findUnique({
    where: {
      chatRoomId_reviewerId: {
        chatRoomId,
        reviewerId: userId,
      },
    },
  });
  return !!review;
}

export async function leaveChatRoom(chatRoomId: string) {
  const session = await getSession();
  if (!session?.id) throw new Error("Unauthorized");

  const room = await db.chatRoom.findUnique({
    where: { id: chatRoomId },
    select: {
      buyerId: true,
      sellerId: true,
      buyerLeft: true,
      sellerLeft: true,
    },
  });
  if (!room) throw new Error("Chat room not found");

  const isBuyer = room.buyerId === session.id;
  const isSeller = room.sellerId === session.id;
  if (!isBuyer && !isSeller) throw new Error("Not authorized");

  if (isBuyer && !room.buyerLeft) {
    await db.chatRoom.update({
      where: { id: chatRoomId },
      data: { buyerLeft: true },
    });
  }
  if (isSeller && !room.sellerLeft) {
    await db.chatRoom.update({
      where: { id: chatRoomId },
      data: { sellerLeft: true },
    });
  }

  const updated = await db.chatRoom.findUnique({
    where: { id: chatRoomId },
    select: { buyerLeft: true, sellerLeft: true },
  });

  if (updated?.buyerLeft && updated?.sellerLeft) {
    await db.message.deleteMany({ where: { chatRoomId } });
    await db.review.deleteMany({ where: { chatRoomId } });
    await db.chatRoom.delete({ where: { id: chatRoomId } });
  }

  revalidatePath("/chats");
  const locale = await getLocale();
  redirect({ href: "/chats", locale });
}
