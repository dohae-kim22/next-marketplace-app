import { getSession } from "@/lib/session";
import db from "@/lib/db";

export async function getUnreadMessageCount() {
  const session = await getSession();
  if (!session?.id) return 0;

  const count = await db.message.count({
    where: {
      read: false,
      senderId: { not: session.id },
      chatRoom: {
        OR: [{ buyerId: session.id }, { sellerId: session.id }],
      },
    },
  });

  return count;
}
