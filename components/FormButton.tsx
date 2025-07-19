interface FormButtonProps {
  text: string;
  loading: boolean;
}

export default function FormButton({ text, loading }: FormButtonProps) {
  return (
    <button
      disabled={loading}
      className="primary-btn h-10 disabled:bg-neutral-500 disabled:cursor-not-allowed"
    >
      {loading ? "Loading..." : text}
    </button>
  );
}
