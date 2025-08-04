"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function deleteStream(streamId: number) {
  const session = await getSession();

  const stream = await db.liveStream.findUnique({
    where: {
      id: streamId,
    },
    select: {
      userId: true,
    },
  });

  if (!stream || stream.userId !== session.id) {
    throw new Error("Unauthorized");
  }

  await db.liveStream.delete({
    where: {
      id: streamId,
    },
  });

  redirect("/live");
}
