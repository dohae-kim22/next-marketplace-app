import { getSession } from "@/lib/session";
import db from "@/lib/db";
import ReviewForm from "@/components/ReviewForm";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

interface NewReviewPageProps {
  searchParams: Promise<{
    chatRoomId?: string;
  }>;
}

export default async function NewReviewPage({
  searchParams,
}: NewReviewPageProps) {
  const { chatRoomId } = await searchParams;
  const locale = await getLocale();

  if (!chatRoomId) {
    redirect({
      href: "/",
      locale,
    });
  }

  const session = await getSession();
  const chatRoom = await db.chatRoom.findUnique({
    where: { id: chatRoomId },
    include: {
      buyer: true,
      seller: true,
      product: true,
    },
  });

  if (!chatRoom) {
    redirect({
      href: "/",
      locale,
    });
    return null;
  }

  const reviewerId = session.id;
  const reviewee =
    reviewerId === chatRoom.buyerId ? chatRoom.seller : chatRoom.buyer;

  return (
    <div className="p-5 container-lg md:p-20 md:pt-10 lg:p-50 lg:pt-15">
      <ReviewForm
        chatRoomId={chatRoom.id}
        productId={chatRoom.product!.id}
        revieweeId={reviewee.id}
      />
    </div>
  );
}
