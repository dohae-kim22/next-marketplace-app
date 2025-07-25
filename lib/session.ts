import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}

export async function getSession() {
  return getIronSession<SessionContent>(await cookies(), {
    cookieName: "session",
    password: process.env.COOKIE_PASSWORD!,
  });
}

export async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}
