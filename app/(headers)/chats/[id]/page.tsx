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

  const user = await getUserProfile();
  if (!user) {
    return notFound();
  }

  return (
    <div className="flex flex-col mx-auto md:max-w-lg relative">
      <div className="flex flex-col gap-2 p-4 pt-0 w-full sticky top-[64px] md:top-[146px] z-10 bg-neutral-900">
        <ChatroomHeader opponent={opponent} />
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

      <div className="flex-1">
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
