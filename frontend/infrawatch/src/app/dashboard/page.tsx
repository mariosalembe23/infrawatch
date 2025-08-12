import React from "react";
import LateralBar from "./components/LateralBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import DashboardSlice from "./slices/Dashboard";
import MainHeader from "./components/MainHeader";

export default function Dashboard() {
  return (
    <div className="h-dvh w-full bg-[#060607] grid grid-cols-[15%_85%]">
      <LateralBar />
      <ScrollArea className="overflow-y-auto h-full">
        <MainHeader />
        <section className="p-14">
          <DashboardSlice />
        </section>
      </ScrollArea>
    </div>
  );
}
