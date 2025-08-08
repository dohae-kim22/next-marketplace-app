"use client";

import { completeTradeAction } from "@/app/[locale]/(headers)/chats/actions";
import { useTransition } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("productCardInChat");

  const showButton =
    (isBuyer && !buyerCompleted) || (isSeller && !sellerCompleted);
  const tradeComplete = buyerCompleted && sellerCompleted;

  const handleClick = () => {
    startTransition(() => completeTradeAction(chatRoomId));
  };

  return (
    <div className="border rounded-xl bg-neutral-900 p-4 flex items-center gap-4">
      <Link href={`/products/${product.id}`} className="shrink-0">
        <Image
          src={`${product.photo}/avatar`}
          alt={product.title}
          width={80}
          height={80}
          className="rounded-md object-cover"
        />
      </Link>
      <div className="flex-1">
        <h3 className="text-white font-semibold">{product.title}</h3>
        <p className="text-orange-400 font-bold text-sm">€ {product.price}</p>
        {tradeComplete ? (
          <div className="flex gap-2 justify-between items-center">
            <p className="text-green-400 text-sm mt-1">{t("tradeCompleted")}</p>
            {!alreadyReviewed && (
              <Link
                href={`/reviews/add?productId=${product.id}&chatRoomId=${chatRoomId}`}
                className="block text-xs px-5 py-1 rounded-full bg-blue-500 text-white text-center hover:bg-blue-400"
              >
                {t("writeReview")}
              </Link>
            )}
          </div>
        ) : showButton ? (
          <button
            onClick={handleClick}
            disabled={isPending}
            className="text-xs mt-2 px-3 py-1 cursor-pointer rounded-full bg-orange-500 hover:bg-orange-400 text-white disabled:opacity-50"
          >
            {isBuyer ? t("markPurchased") : t("markSold")}
          </button>
        ) : (
          <p className="text-neutral-400 text-xs mt-1">{t("waitingOther")}</p>
        )}
      </div>
    </div>
  );
}
