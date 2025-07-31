import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import TabBar from "@/components/TabBar";
import { getUnreadMessageCount } from "@/lib/unread";
import { ReactNode } from "react";

export default async function TabLayout({ children }: { children: ReactNode }) {
  const unreadCount = await getUnreadMessageCount();

  return (
    <>
      <Header unreadCount={unreadCount} />
      <SearchBar />
      {children}
      <TabBar unreadCount={unreadCount} />
    </>
  );
}
