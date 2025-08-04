"use client";

import { useTransition } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteStream } from "@/app/[locale]/(headers)/live/[id]/actions";

export default function DeleteStreamButton({ streamId }: { streamId: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (
      confirm("Are you sure you want to permanently delete this live stream?")
    ) {
      startTransition(() => {
        deleteStream(streamId);
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="bg-transparent px-2 py-1 rounded-md text-red-500 font-semibold hover:bg-neutral-700 flex justify-center items-center cursor-pointer border-2 border-neutral-600 gap-1"
    >
      <TrashIcon className="h-4" />
      <span className="text-sm">{isPending ? "Deleting..." : "Delete"}</span>
    </button>
  );
}
