"use server";

import { redirect } from "next/navigation";
import validator from "validator";
import z from "zod";

interface ActionState {
  verificationCode: boolean;
}

const phoneSchema = z
  .string()
  .trim()
  .refine(validator.isMobilePhone, "Please enter a valid phone number.");
const verificationCodeSchema = z.coerce.number().min(100000).max(999999);

export async function SMSLogIn(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const verificationCode = formData.get("verificationCode");

  if (!prevState.verificationCode) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      const flatten = z.flattenError(result.error);
      return {
        verificationCode: false,
        error: flatten,
      };
    } else {
      return {
        verificationCode: true,
      };
    }
  } else {
    const result = verificationCodeSchema.safeParse(verificationCode);
    if (!result.success) {
      const flatten = z.flattenError(result.error);
      return {
        verificationCode: true,
        error: flatten,
      };
    } else {
      redirect("/");
    }
  }
}
