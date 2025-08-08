"use client";

import { createReview } from "@/app/[locale]/(headers)/reviews/add/actions";
import { useState, useTransition } from "react";

interface Props {
  chatRoomId: string;
  productId: number;
  revieweeId: number;
}

export default function ReviewForm({
  chatRoomId,
  productId,
  revieweeId,
}: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    startTransition(() => {
      createReview(chatRoomId, productId, revieweeId, rating, comment).catch(
        (err: unknown) => {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to submit the review. Please try again.";
          setError(message);
        }
      );
    });
  };

  return (
    <div className="p-5 border rounded-xl flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Leave a review</h2>
      {error && (
        <div
          role="alert"
          className="rounded-md border border-red-500/40 bg-red-500/10 text-red-300 px-3 py-2 text-sm"
        >
          {error}
        </div>
      )}

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={star <= rating ? "text-orange-400" : "text-gray-400"}
            onClick={() => setRating(star)}
            type="button"
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        placeholder="Write your review..."
        className="p-2 rounded border bg-neutral-900 text-white"
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        disabled={isPending || comment.length < 2}
        onClick={handleSubmit}
        className="primary-btn disabled:opacity-50"
      >
        {isPending ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}
