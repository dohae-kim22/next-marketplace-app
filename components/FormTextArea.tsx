"use client";

import { TextareaHTMLAttributes, useEffect, useState } from "react";

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
  const [localErrors, setLocalErrors] = useState<string[]>(errors);
  const [value, setValue] = useState(defaultValue || "");
  const maxLength = 2000;

  useEffect(() => {
    if (JSON.stringify(localErrors) !== JSON.stringify(errors)) {
      setLocalErrors(errors);
    }
  }, [errors]);

  return (
    <div className="flex flex-col gap-1 relative">
      <textarea
        name={name}
        maxLength={maxLength}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setLocalErrors([]);
        }}
        className="bg-transparent border-none rounded-md focus:outline-none transition h-30 ring-1 ring-neutral-200 focus:ring-2 focus:ring-orange-500 placeholder:text-neutral-400 resize-none p-2"
        {...rest}
      />
      <div className="flex justify-end text-xs text-neutral-500 px-1">
        <span>
          {value ? value.length : 0} / {maxLength}
        </span>
      </div>
      {localErrors &&
        localErrors.map((error) => (
          <span key={error} className="text-red-500 text-sm">
            {error}
          </span>
        ))}
    </div>
  );
}
