"use client";

import { deletePost } from "@/app/[locale]/(headers)/posts/[id]/actions";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";
import { useTranslations } from "next-intl";

export default function DeletePostButton({ postId }: { postId: number }) {
  const t = useTranslations("postDetail");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="cursor-pointer border-2 border-neutral-700 hover:bg-neutral-700 flex justify-center items-center px-2 py-1 gap-2 rounded-full text-red-500 transition-colors"
      >
        <TrashIcon className="h-4" />
        <span className="text-sm">{t("delete")}</span>
      </button>

      <ConfirmModal
        isOpen={isOpen}
        title={t("delete")}
        message={t("deleteConfirm")}
        onCancel={() => setIsOpen(false)}
        onConfirm={async () => {
          await deletePost(postId);
        }}
      />
    </>
  );
}
