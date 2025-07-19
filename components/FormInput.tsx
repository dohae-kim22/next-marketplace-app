import { InputHTMLAttributes } from "react";

interface FormInputProps {
  name: string;
  errors?: string[];
  defaultValue?: string;
}

export default function FormInput({
  name,
  errors = [],
  defaultValue,
  ...rest
}: FormInputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <input
        className="bg-transparent border-none rounded-md focus:outline-none transition h-10 ring-1 ring-neutral-200 focus:ring-2 focus:ring-orange-500 placeholder:text-neutral-400"
        name={name}
        defaultValue={defaultValue}
        {...rest}
      />
      {errors &&
        errors.map((error) => (
          <span key={error} className="text-red-500">
            {error}
          </span>
        ))}
    </div>
  );
}
