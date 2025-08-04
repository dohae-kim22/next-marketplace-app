import { getSession } from "@/lib/session";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import ReviewForm from "@/components/ReviewForm";

interface NewReviewPageProps {
  searchParams: Promise<{
    chatRoomId?: string;
  }>;
}

export default async function NewReviewPage({
  searchParams,
}: NewReviewPageProps) {
  const { chatRoomId } = await searchParams;
  if (!chatRoomId) redirect("/");

  const session = await getSession();
  const chatRoom = await db.chatRoom.findUnique({
    where: { id: chatRoomId },
    include: {
      buyer: true,
      seller: true,
      product: true,
    },
  });

  if (!chatRoom) redirect("/");

  const reviewerId = session.id;
  const reviewee =
    reviewerId === chatRoom.buyerId ? chatRoom.seller : chatRoom.buyer;

  return (
    <ReviewForm
      chatRoomId={chatRoom.id}
      productId={chatRoom.product!.id}
      revieweeId={reviewee.id}
    />
  );
}
