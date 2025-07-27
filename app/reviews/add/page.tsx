import { getSession } from "@/lib/session";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import ReviewForm from "@/components/ReviewForm";

export default async function NewReviewPage({
  searchParams,
}: {
  searchParams: { chatRoomId: string };
}) {
  const session = await getSession();
  const chatRoom = await db.chatRoom.findUnique({
    where: { id: searchParams.chatRoomId },
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
