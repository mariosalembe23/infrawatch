"use client";

import React from "react";
import LateralBar from "./components/LateralBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import DashboardSlice from "./slices/DashboardSlice";
import MainHeader from "./components/MainHeader";

export default function Dashboard() {
  const [showSideBar, setShowSidebar] = React.useState(true);

  return (
    <div
      className={`h-dvh w-full bg-[#060607] grid ${
        showSideBar ? "grid-cols-1 pot:grid-cols-[20%_80%] lal:grid-cols-[15%_85%]" : "grid-cols-1"
      } `}
    >
      <LateralBar showSideBar={showSideBar} setShowSidebar={setShowSidebar} />
      <ScrollArea className="overflow-y-auto h-full">
        <MainHeader showSideBar={showSideBar} setShowSidebar={setShowSidebar} />
        <section className="ret:py-14 ret:px-14 px-5 py-10">
          <DashboardSlice showSideBar={showSideBar} />
        </section>
      </ScrollArea>
    </div>
  );
}
