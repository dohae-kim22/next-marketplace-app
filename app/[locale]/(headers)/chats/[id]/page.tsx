import ChatMessagesList from "@/components/ChatMessagesList";
import { getSession } from "@/lib/session";
import { notFound } from "next/navigation";
import {
  getMessages,
  getReviewStatus,
  getRoom,
  getUserProfile,
} from "../actions";
import ProductCardInChat from "@/components/ProductCardInChat";
import ChatroomHeader from "@/components/ChatroomHeader";

export default async function ChatRoom({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = await getRoom(id);
  if (!room) {
    return notFound();
  }
  const initialMessages = await getMessages(id);
  const session = await getSession();
  const alreadyReviewed = await getReviewStatus(id, session.id!);

  const isBuyer = room.buyer.id === session.id;
  const opponent = isBuyer ? room.seller.userName : room.buyer.userName;
  const opponentId = isBuyer ? room.seller.id : room.buyer.id;
  const isParticipant =
    room.buyer.id === session.id || room.seller.id === session.id;

  const user = await getUserProfile();
  if (!user) {
    return notFound();
  }

  return (
    <div
      className="mx-auto md:max-w-lg flex flex-col relative overflow-hidden"
      style={{ height: "calc(100dvh - var(--header-h, 0px))" }}
    >
      <div className="sticky top-0 z-10 bg-neutral-900 p-4 pt-0">
        <div className="flex flex-col gap-2 w-full">
          <ChatroomHeader
            opponent={opponent}
            opponentId={opponentId}
            chatRoomId={id}
            showLeave={isParticipant}
          />
          {room.productId && room.product && (
            <ProductCardInChat
              product={room.product}
              isBuyer={isBuyer}
              isSeller={!isBuyer}
              buyerCompleted={room.buyerCompleted}
              sellerCompleted={room.sellerCompleted}
              chatRoomId={id}
              alreadyReviewed={alreadyReviewed}
            />
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ChatMessagesList
          chatRoomId={id}
          userId={session.id!}
          userName={user.userName}
          avatar={user.avatar!}
          initialMessages={initialMessages}
        />
      </div>
    </div>
  );
}
