"use client";

import { HeartIcon } from "@heroicons/react/24/solid";
import { useTransition, useState } from "react";
import { toggleLike } from "@/app/[locale]/(headers)/products/[id]/actions";

export default function LikeButton({
  productId,
  isLiked,
  likeCount,
}: {
  productId: number;
  isLiked: boolean;
  likeCount: number;
}) {
  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(likeCount);
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const nextLiked = !liked;
      setLiked(nextLiked);
      setCount((prev) => (nextLiked ? prev + 1 : prev - 1));
      await toggleLike(productId);
    });
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1 rounded-md px-1 ${
        liked ? "text-red-500" : "text-neutral-400"
      } hover:bg-neutral-700`}
      disabled={pending}
    >
      <HeartIcon className="size-4 lg:size-5" />
      {count}
    </button>
  );
}
