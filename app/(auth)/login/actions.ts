"use server";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import {getSession} from "@/lib/session";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import z from "zod";

const checkEmailExist = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  return user;
};

const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address.")
    .toLowerCase()
    .refine(checkEmailExist, "This email address is not registered with us."),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function login(prevState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = await loginSchema.safeParseAsync(data);
  if (!result.success) {
    const flatten = z.flattenError(result.error);

    return {
      fieldErrors: flatten.fieldErrors,
      values: data,
    };
  } else {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    const ok = await bcrypt.compare(result.data.password, user!.password ?? "");

    if (ok) {
      const session = await getSession();
      session.id = user!.id;
      await session.save();
      redirect("/profile");
    } else {
      return {
        fieldErrors: {
          password: ["Incorrect password. Please try again."],
        },
        values: data,
      };
    }
  }
}
