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
      .min(PASSWORD_MIN_LENGTH, "Password must be at least 4 characters long.")
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "Password must be at least 4 characters long."),
  })
  .check(async (ctx) => {
    const userNameTaken = await db.user.findUnique({
      where: {
        userName: ctx.value.userName,
      },
      select: {
        id: true,
      },
    });

    if (userNameTaken) {
      ctx.issues.push({
        code: "custom",
        message: "Oops! This username is already in use.",
        input: ctx.value,
        path: ["userName"],
      });
      return;
    }

    const emailTaken = await db.user.findUnique({
      where: {
        email: ctx.value.email,
      },
      select: {
        id: true,
      },
    });

    if (emailTaken) {
      ctx.issues.push({
        code: "custom",
        message: "This email is already registered.",
        input: ctx.value,
        path: ["email"],
      });
      return;
    }

    if (ctx.value.password !== ctx.value.confirmPassword) {
      ctx.issues.push({
        code: "custom",
        message: "Passwords do not match",
        input: ctx.value,
        path: ["confirmPassword"],
      });
    }
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
        avatar: "/default-user.png",
      },
      select: {
        id: true,
      },
    });

    const session = await getSession();
    session.id = user.id;
    await session.save();
    redirect("/products");
  }
}
