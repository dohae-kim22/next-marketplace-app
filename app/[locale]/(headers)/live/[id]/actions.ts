"use server";

import { redirect } from "@/i18n/navigation";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { getLocale } from "next-intl/server";

export async function deleteStream(streamId: number) {
  const session = await getSession();
  const locale = await getLocale();

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

  redirect({
    href: "/live",
    locale,
  });
}
