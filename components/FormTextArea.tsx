import { TextareaHTMLAttributes } from "react";

interface FormTextareaProps {
  name: string;
  errors?: string[];
  defaultValue?: string;
}

export default function FormTextarea({
  name,
  errors = [],
  defaultValue,
  ...rest
}: FormTextareaProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="flex flex-col gap-2">
      <textarea
        name={name}
        defaultValue={defaultValue}
        className="bg-transparent border-none rounded-md focus:outline-none transition h-30 ring-1 ring-neutral-200 focus:ring-2 focus:ring-orange-500 placeholder:text-neutral-400 resize-none p-2"
        {...rest}
      />
      {errors &&
        errors.map((error) => (
          <span key={error} className="text-red-500 text-sm">
            {error}
          </span>
        ))}
    </div>
  );
}
