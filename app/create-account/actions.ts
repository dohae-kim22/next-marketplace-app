"use server";

import z from "zod";

const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);

const formSchema = z
  .object({
    userName: z
      .string({
        error: "Please enter your username.",
      })
      .min(3, "Username must be at least 3 characters.")
      .max(10, "Username must be at most 10 characters.")
      .trim()
      .toLowerCase(),
    email: z.email("Please enter a valid email address.").toLowerCase(),
    password: z
      .string()
      .min(4, "Password must be at least 4 characters long.")
      .regex(
        passwordRegex,
        "Password must include uppercase, lowercase, digit, and special character."
      ),
    confirmPassword: z
      .string()
      .min(4, "Password must be at least 4 characters long."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    userName: formData.get("userName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const result = formSchema.safeParse(data);

  if (!result.success) {
    const flatten = z.flattenError(result.error);

    return {
      fieldErrors: flatten.fieldErrors,
      values: data,
    };
  } else {
    return {
      values: { userName: "", email: "", password: "", confirmPassword: "" },
    };
  }
}
