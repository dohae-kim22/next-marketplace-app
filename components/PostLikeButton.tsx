"use client";

import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { useOptimistic, startTransition } from "react";
import {
  dislikePost,
  likePost,
} from "@/app/[locale]/(headers)/posts/[id]/actions";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

export default function PostLikeButton({
  isLiked,
  likeCount,
  postId,
}: LikeButtonProps) {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (prevState) => ({
      isLiked: !prevState.isLiked,
      likeCount: prevState.isLiked
        ? prevState.likeCount - 1
        : prevState.likeCount + 1,
    })
  );

  const onClick = () => {
    startTransition(() => {
      reducerFn(undefined);
    });

    if (state.isLiked) {
      void dislikePost(postId);
    } else {
      void likePost(postId);
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full px-2 py-1 transition-colors ${
        state.isLiked
          ? "bg-orange-500 text-white border-orange-500"
          : "hover:bg-neutral-800"
      }`}
    >
      {state.isLiked ? (
        <HandThumbUpIcon className="size-4" />
      ) : (
        <OutlineHandThumbUpIcon className="size-4" />
      )}
      {state.isLiked ? (
        <span className="text-xs">{state.likeCount}</span>
      ) : (
        <span className="text-xs">Like ({state.likeCount})</span>
      )}
    </button>
  );
}
