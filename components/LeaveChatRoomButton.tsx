"use client";

import { useTransition } from "react";
import {
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { leaveChatRoom } from "@/app/[locale]/(headers)/chats/actions";

export default function LeaveChatRoomButton({
  chatRoomId,
}: {
  chatRoomId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("chatRoomLeave");

  const onLeave = () => {
    if (confirm(t("confirm"))) {
      startTransition(() => {
        leaveChatRoom(chatRoomId);
      });
    }
  };

  return (
    <button
      type="button"
      onClick={onLeave}
      disabled={isPending}
      className="bg-transparent px-2 py-1 rounded-md text-red-400 font-semibold hover:text-red-500 flex items-center"
    >
      <XCircleIcon className="h-6" />
    </button>
  );
}
