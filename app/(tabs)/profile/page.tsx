import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";
import { logOut } from "./actions";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });

    if (user) {
      return user;
    }
  }
  notFound();
}

export default async function Profile() {
  const user = await getUser();

  return (
    <>
      <h1>Welcome! {user?.userName}</h1>
      <form action={logOut}>
        <button>Log out</button>
      </form>
    </>
  );
}
