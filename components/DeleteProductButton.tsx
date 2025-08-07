"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { useId } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface Props {
  productId: number;
  isMobile?: boolean;
  action: (formData: FormData) => void;
  label?: string;
}

export default function DeleteProductButton({
  productId,
  isMobile = false,
  action,
}: Props) {
  const formId = useId();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("productDetail");

  const handleClick = () => {
    const confirmed = confirm(t("deleteConfirm"));
    if (confirmed) {
      const form = document.getElementById(formId) as HTMLFormElement;
      form?.requestSubmit();
      if (pathname.startsWith("/products")) {
        router.push("/products");
      }
    }
  };

  const baseClass = `cursor-pointer border-2 border-neutral-700 hover:bg-neutral-700 flex justify-center items-center ${
    isMobile
      ? "p-2.5 rounded-full text-red-500"
      : "w-full p-2.5 rounded-full text-red-500 gap-2"
  }`;

  return (
    <>
      <form id={formId} action={action}>
        <input type="hidden" name="productId" value={productId} />
      </form>
      <button type="button" onClick={handleClick} className={baseClass}>
        <TrashIcon className="h-6" />
        {!isMobile && <span>{t("delete")}</span>}
      </button>
    </>
  );
}
