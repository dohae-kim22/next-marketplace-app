"use server";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

const checkPasswords = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => password === confirmPassword;

const checkUniqueUserName = async (userName: string) => {
  const user = await db.user.findUnique({
    where: {
      userName,
    },
    select: {
      id: true,
    },
  });

  return !user;
};

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  return !user;
};

const formSchema = z
  .object({
    userName: z
      .string({
        error: "Please enter your username.",
      })
      .min(3, "Username must be at least 3 characters.")
      .max(10, "Username must be at most 10 characters.")
      .trim()
      .toLowerCase()
      .refine(checkUniqueUserName, "Oops! This username is already in use."),
    email: z
      .email("Please enter a valid email address.")
      .toLowerCase()
      .refine(checkUniqueEmail, "This email is already registered."),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "Password must be at least 4 characters long.")
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "Password must be at least 4 characters long."),
  })
  .refine(checkPasswords, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    userName: formData.get("userName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    const flatten = z.flattenError(result.error);

    return {
      fieldErrors: flatten.fieldErrors,
      values: data,
    };
  } else {
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    const user = await db.user.create({
      data: {
        userName: result.data.userName,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });

    const cookie = await getIronSession(await cookies(), {
      cookieName: "session",
      password: process.env.COOKIE_PASSWORD!,
    });

    cookie.id = user.id;
    await cookie.save();
    redirect("/profile");
  }
}
