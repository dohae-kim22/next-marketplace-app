import Header from "@/components/Header";
import { getUnreadMessageCount } from "@/lib/unread";
import { ReactNode } from "react";

export default async function HeaderLayout({
  children,
}: {
  children: ReactNode;
}) {
  const unreadCount = await getUnreadMessageCount();

  return (
    <>
      <Header unreadCount={unreadCount} />
      {children}
    </>
  );
}
