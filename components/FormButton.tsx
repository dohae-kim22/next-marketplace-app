"use client";

import { useFormStatus } from "react-dom";

interface FormButtonProps {
  text: string;
  onClick?: () => void;
}

export default function FormButton({ text, onClick }: FormButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      onClick={onClick}
      className="primary-btn h-10 disabled:bg-neutral-500 disabled:cursor-not-allowed"
    >
      {pending ? "Loading..." : text}
    </button>
  );
}
