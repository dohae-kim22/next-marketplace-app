"use client";

import { createChatWithUser } from "@/app/[locale]/(headers)/users/[id]/actions";
import { useTransition } from "react";

export function ChatButton({ userId }: { userId: number }) {
  const [isPending, startTransition] = useTransition();

  const handleChat = () => {
    startTransition(() => {
      createChatWithUser(userId);
    });
  };

  return (
    <button
      onClick={handleChat}
      disabled={isPending}
      className="bg-orange-500 hover:bg-orange-400 transition-colors text-white px-2 py-1 rounded-md mt-2 text-sm font-medium disabled:opacity-50"
    >
      {isPending ? "Starting chat..." : "Chat with this user"}
    </button>
  );
}
