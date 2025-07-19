interface FormInputProps {
  type: string;
  name: string;
  placeholder: string;
  required: boolean;
  errors?: string[];
  defaultValue?: string;
}

export default function FormInput({
  type,
  name,
  placeholder,
  required,
  errors,
  defaultValue,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <input
        className="bg-transparent border-none rounded-md focus:outline-none transition h-10 ring-1 ring-neutral-200 focus:ring-2 focus:ring-orange-500 placeholder:text-neutral-400"
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
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
