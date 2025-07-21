import TabBar from "@/components/TabBar";
import { ReactNode } from "react";

export default function TabLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <TabBar />
    </>
  );
}
