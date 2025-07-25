import Header from "@/components/Header";
import TabBar from "@/components/TabBar";
import { getUnreadMessageCount } from "@/lib/unread";
import { ReactNode } from "react";

export default async function TabLayout({ children }: { children: ReactNode }) {
  const unreadCount = await getUnreadMessageCount();

  return (
    <>
      <Header />
      {children}
      <TabBar unreadCount={unreadCount} />
    </>
  );
}
