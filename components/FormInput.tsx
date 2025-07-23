"use client";

import { InputHTMLAttributes, useEffect, useState } from "react";

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
  const [localErrors, setLocalErrors] = useState<string[]>(errors);

  useEffect(() => {
    if (JSON.stringify(localErrors) !== JSON.stringify(errors)) {
      setLocalErrors(errors);
    }
  }, [errors]);

  return (
    <div className="flex flex-col gap-2">
      <input
        className="bg-transparent border-none rounded-md focus:outline-none transition h-10 ring-1 ring-neutral-200 focus:ring-2 focus:ring-orange-500 placeholder:text-neutral-400"
        name={name}
        defaultValue={defaultValue}
        onChange={(e) => {
          rest.onChange?.(e);
          setLocalErrors([]);
        }}
        {...rest}
      />
      {localErrors &&
        localErrors.map((error) => (
          <span key={error} className="text-red-500 text-sm">
            {error}
          </span>
        ))}
    </div>
  );
}
