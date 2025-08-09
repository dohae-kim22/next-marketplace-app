"use client";

import { XCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { leaveChatRoom } from "@/app/[locale]/(headers)/chats/actions";
import ConfirmModal from "@/components/ConfirmModal";

export default function LeaveChatRoomButton({
  chatRoomId,
}: {
  chatRoomId: string;
}) {
  const t = useTranslations("chatRoomLeave");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="bg-transparent cursor-pointer rounded-full text-red-400 font-semibold hover:bg-red-500/20 flex items-center transition-colors"
      >
        <XCircleIcon className="size-7" />
      </button>

      <ConfirmModal
        isOpen={isOpen}
        title={t("leave")}
        message={t("confirm")}
        onCancel={() => setIsOpen(false)}
        onConfirm={async () => {
          await leaveChatRoom(chatRoomId);
        }}
      />
    </>
  );
}
