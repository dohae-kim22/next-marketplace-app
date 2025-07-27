import ChatMessagesList from "@/components/ChatMessagesList";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { notFound } from "next/navigation";
import { getMessages } from "../actions";
import ProductCardInChat from "@/components/ProductCardInChat";

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

async function getReviewStatus(chatRoomId: string, userId: number) {
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

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);
  if (!room) {
    return notFound();
  }
  const initialMessages = await getMessages(params.id);
  const session = await getSession();
  const alreadyReviewed = await getReviewStatus(params.id, session.id!);

  const user = await getUserProfile();
  if (!user) {
    return notFound();
  }
  return (
    <div className="h-screen flex- flex-col">
      {room.productId && room.product && (
        <div className="p-4 border-b border-neutral-700 w-full">
          <ProductCardInChat
            product={room.product}
            isBuyer={room.buyer.id === session.id}
            isSeller={room.seller.id === session.id}
            buyerCompleted={room.buyerCompleted}
            sellerCompleted={room.sellerCompleted}
            chatRoomId={params.id}
            alreadyReviewed={alreadyReviewed}
          />
        </div>
      )}
      <div className="flex-1">
        <ChatMessagesList
          chatRoomId={params.id}
          userId={session.id!}
          userName={user.userName}
          avatar={user.avatar!}
          initialMessages={initialMessages}
        />
      </div>
    </div>
  );
}
