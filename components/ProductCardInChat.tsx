"use client";

import { completeTradeAction } from "@/app/chats/actions";
import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardInChatProps {
  product: {
    id: number;
    title: string;
    price: number;
    photo: string;
    status: "ON_SALE" | "SOLD";
  };
  isBuyer: boolean;
  isSeller: boolean;
  buyerCompleted: boolean;
  sellerCompleted: boolean;
  chatRoomId: string;
  alreadyReviewed: boolean;
}

export default function ProductCardInChat({
  product,
  isBuyer,
  isSeller,
  buyerCompleted,
  sellerCompleted,
  chatRoomId,
  alreadyReviewed,
}: ProductCardInChatProps) {
  const [isPending, startTransition] = useTransition();
  const showButton =
    (isBuyer && !buyerCompleted) || (isSeller && !sellerCompleted);
  const tradeComplete = buyerCompleted && sellerCompleted;

  const handleClick = () => {
    startTransition(() => completeTradeAction(chatRoomId));
  };

  return (
    <div className="border rounded-xl bg-neutral-900 p-4 flex items-center gap-4">
      <Image
        src={`${product.photo}/avatar`}
        alt={product.title}
        width={80}
        height={80}
        className="rounded-md object-cover"
      />
      <div className="flex-1">
        <h3 className="text-white font-semibold">{product.title}</h3>
        <p className="text-orange-400 font-bold text-sm">€ {product.price}</p>
        {tradeComplete ? (
          <>
            <p className="text-green-400 text-sm mt-1">✅ Trade completed</p>
            {!alreadyReviewed && (
              <Link
                href={`/reviews/add?productId=${product.id}&chatRoomId=${chatRoomId}`}
                className="block text-xs px-3 py-1 rounded-full bg-blue-500 text-white text-center hover:bg-blue-400"
              >
                Write a Review
              </Link>
            )}
          </>
        ) : showButton ? (
          <button
            onClick={handleClick}
            disabled={isPending}
            className="text-xs mt-2 px-3 py-1 rounded-full bg-orange-500 text-white disabled:opacity-50"
          >
            {isBuyer ? "Mark as Purchased" : "Mark as Sold"}
          </button>
        ) : (
          <p className="text-neutral-400 text-xs mt-1">
            Waiting for other to confirm...
          </p>
        )}
      </div>
    </div>
  );
}
