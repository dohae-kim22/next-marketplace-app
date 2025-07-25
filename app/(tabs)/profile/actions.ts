"use server";

import {getSession} from "@/lib/session";
import { redirect } from "next/navigation";

export async function logOut() {
  const session = await getSession();
  session.destroy();
  redirect("/");
}
