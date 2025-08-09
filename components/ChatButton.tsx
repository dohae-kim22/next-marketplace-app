"use client";

import { createChatWithUser } from "@/app/[locale]/(headers)/users/[id]/actions";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

export function ChatButton({ userId }: { userId: number }) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("chatButton");

  const handleChat = () => {
    startTransition(() => {
      createChatWithUser(userId);
    });
  };

  return (
    <button
      onClick={handleChat}
      disabled={isPending}
      className="flex h-9 items-center justify-center gap-1 bg-orange-500 hover:bg-orange-400 transition-colors text-white px-3 py-1 rounded-md text-sm font-medium disabled:opacity-50"
    >
      <PaperAirplaneIcon className="size-5" />
      <span>{isPending ? t("starting") : t("chat")}</span>
    </button>
  );
}
