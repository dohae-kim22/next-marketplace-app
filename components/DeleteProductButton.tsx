"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ConfirmModal from "@/components/ConfirmModal";
import { useTranslations } from "next-intl";

interface Props {
  productId: number;
  isMobile?: boolean;
  action: (formData: FormData) => void;
}

export default function DeleteProductButton({
  productId,
  isMobile = false,
  action,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("productDetail");
  const [isOpen, setIsOpen] = useState(false);

  const baseClass = `cursor-pointer border-2 border-neutral-700 hover:bg-neutral-700 flex justify-center items-center ${
    isMobile
      ? "p-2.5 rounded-full text-red-500"
      : "w-full p-2.5 rounded-full text-red-500 gap-2"
  }`;

  return (
    <>
      <form id={`delete-product-${productId}`} action={action}>
        <input type="hidden" name="productId" value={productId} />
      </form>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={baseClass}
      >
        <TrashIcon className="h-6" />
        {!isMobile && <span>{t("delete")}</span>}
      </button>

      <ConfirmModal
        isOpen={isOpen}
        title={t("delete")}
        message={t("deleteConfirm")}
        onCancel={() => setIsOpen(false)}
        onConfirm={async () => {
          const form = document.getElementById(
            `delete-product-${productId}`
          ) as HTMLFormElement;
          form?.requestSubmit();
          if (pathname.startsWith("/products")) {
            router.push("/products");
          }
        }}
      />
    </>
  );
}
