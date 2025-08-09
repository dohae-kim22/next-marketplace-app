"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { useState, useTransition } from "react";
import { deleteStream } from "@/app/[locale]/(headers)/live/[id]/actions";
import { useTranslations } from "next-intl";
import ConfirmModal from "@/components/ConfirmModal";

export default function DeleteStreamButton({ streamId }: { streamId: number }) {
  const t = useTranslations("deleteStreamButton");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-transparent px-2 py-1 rounded-md text-red-500 font-semibold hover:bg-neutral-700 flex justify-center items-center cursor-pointer border-2 border-neutral-600 transition-colors gap-1"
      >
        <TrashIcon className="h-4" />
        <span className="text-sm">{t("delete")}</span>
      </button>

      <ConfirmModal
        isOpen={isOpen}
        title={t("delete")}
        message={t("confirm")}
        onCancel={() => setIsOpen(false)}
        onConfirm={async () => {
          await deleteStream(streamId);
        }}
      />
    </>
  );
}
