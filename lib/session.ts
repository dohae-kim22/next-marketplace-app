import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import db from "./db";

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

export async function getUserWithLocation() {
  const session = await getSession();

  return db.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      location: true,
      latitude: true,
      longitude: true,
      radius: true,
    },
  });
}
