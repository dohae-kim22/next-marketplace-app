"use client";

import { completeTradeAction } from "@/app/[locale]/(headers)/chats/actions";
import { useState, useTransition } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { PencilIcon } from "@heroicons/react/24/outline";
import ConfirmModal from "@/components/ConfirmModal";
import { createClient } from "@supabase/supabase-js";

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
  const [confirmOpen, setConfirmOpen] = useState(false);

  const t = useTranslations("productCardInChat");

  const showButton =
    (isBuyer && !buyerCompleted) || (isSeller && !sellerCompleted);
  const tradeComplete = buyerCompleted && sellerCompleted;

  const handleClick = () => {
    setConfirmOpen(true);
  };

  const confirmTrade = async () => {
    startTransition(() => {
      completeTradeAction(chatRoomId).then(async () => {
        const client = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_API_KEY!
        );
        const ch = client.channel(`room-${chatRoomId}`);
        ch.subscribe();
        ch.send({
          type: "broadcast",
          event: "trade",
          payload: { roomId: chatRoomId },
        });
        ch.unsubscribe();
      });
    });
    setConfirmOpen(false);
  };

  return (
    <div className="border rounded-xl bg-neutral-900 p-4 flex items-center gap-4">
      <Link href={`/products/${product.id}`} className="shrink-0">
        <div className="relative size-20 aspect-square overflow-hidden rounded-md">
          <Image
            src={`${product.photo}/avatar`}
            alt={product.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      </Link>
      <div className="flex-1">
        <h3 className="text-white font-semibold line-clamp-1">
          {product.title}
        </h3>
        <p className="text-orange-400 font-bold text-sm">€ {product.price}</p>
        {tradeComplete ? (
          <div className="flex gap-2 justify-between items-center">
            <p className="text-green-400 text-sm mt-1">{t("tradeCompleted")}</p>
            {!alreadyReviewed && (
              <Link
                href={`/reviews/add?productId=${product.id}&chatRoomId=${chatRoomId}`}
                className="flex gap-1 text-xs px-5 py-1 rounded-full bg-blue-500 text-white text-center hover:bg-blue-400 transition-colors"
              >
                <PencilIcon className="size-4" />
                <span>{t("writeReview")}</span>
              </Link>
            )}
          </div>
        ) : showButton ? (
          <button
            onClick={handleClick}
            disabled={isPending}
            className="text-xs mt-2 px-3 py-1 cursor-pointer rounded-full bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 transition-colors"
          >
            {isBuyer ? t("markPurchased") : t("markSold")}
          </button>
        ) : (
          <p className="text-neutral-400 text-xs mt-1">{t("waitingOther")}</p>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        title={t("modal.title")}
        message={t("modal.message")}
        confirmText={t("modal.confirm")}
        cancelText={t("modal.cancel")}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmTrade}
      />
    </div>
  );
}
