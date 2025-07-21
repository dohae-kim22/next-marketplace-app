import { useFormStatus } from "react-dom";

interface FormButtonProps {
  text: string;
}

export default function FormButton({ text }: FormButtonProps) {
  const {pending} = useFormStatus()
  return (
    <button
      disabled={pending}
      className="primary-btn h-10 disabled:bg-neutral-500 disabled:cursor-not-allowed"
    >
      {pending ? "Loading..." : text}
    </button>
  );
}
