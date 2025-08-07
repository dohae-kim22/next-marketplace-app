"use client";

import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface CopyButtonProps {
  value: string;
  className?: string;
  iconSize?: number;
  withText?: boolean;
}

export default function CopyButton({
  value,
  className = "",
  iconSize = 16,
  withText = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex border border-neutral-500 justify-center items-center gap-1 p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer transition ${className}`}
      aria-label="Copy to clipboard"
      type="button"
    >
      {copied ? (
        <CheckIcon
          className={`text-orange-500`}
          width={iconSize}
          height={iconSize}
        />
      ) : (
        <ClipboardIcon
          className={`text-neutral-500`}
          width={iconSize}
          height={iconSize}
        />
      )}
      {withText && (
        <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
      )}
    </button>
  );
}
