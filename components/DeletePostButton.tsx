"use client";

import { deletePost } from "@/app/[locale]/(headers)/posts/[id]/actions";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

export default function DeletePostButton({ postId }: { postId: number }) {
  const t = useTranslations("postDetail");

  return (
    <form
      action={async () => {
        if (!confirm(t("deleteConfirm"))) return;
        await deletePost(postId);
      }}
    >
      <button
        type="submit"
        className="cursor-pointer border-2 border-neutral-700 hover:bg-neutral-700 flex justify-center items-center px-2 py-1 gap-2 rounded-full text-red-500"
      >
        <TrashIcon className="h-4" />
        <span className="text-sm">{t("delete")}</span>
      </button>
    </form>
  );
}
