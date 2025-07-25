import ChatMessagesList from "@/components/ChatMessagesList";
import db from "@/lib/db";
import {getSession} from "@/lib/session";
import { notFound } from "next/navigation";
import { getMessages } from "../actions";

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      buyer: {
        select: { id: true },
      },
      seller: {
        select: { id: true },
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

async function getUserProfile() {
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

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);
  if (!room) {
    return notFound();
  }
  const initialMessages = await getMessages(params.id);
  const session = await getSession();
  const user = await getUserProfile();
  if (!user) {
    return notFound();
  }
  return (
    <ChatMessagesList
      chatRoomId={params.id}
      userId={session.id!}
      userName={user.userName}
      avatar={user.avatar!}
      initialMessages={initialMessages}
    />
  );
}
