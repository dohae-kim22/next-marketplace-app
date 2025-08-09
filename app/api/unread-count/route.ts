import { NextResponse } from "next/server";
import { getUnreadMessageCount } from "@/lib/unread";

export async function GET() {
  const count = await getUnreadMessageCount();
  return NextResponse.json({ count });
}