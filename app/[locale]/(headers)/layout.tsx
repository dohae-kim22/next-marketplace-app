import Header from "@/components/Header";
import NavigationBar from "@/components/NavigationBar";
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
