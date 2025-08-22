"use client";

import React from "react";
import LateralBar from "./components/LateralBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import DashboardSlice from "./slices/DashboardSlice";
import MainHeader from "./components/MainHeader";
import ServerSlice from "./slices/ServerSlice";
import NetworkSlice from "./slices/NetworkSlice";
import EndpointSlice from "./slices/EndpointSlice";
type Tabs = "server" | "network" | "endpoint" | "dashboard";

export default function Dashboard() {
  const [showSideBar, setShowSidebar] = React.useState(true);
  const [tabs, setTabs] = React.useState<Tabs>("dashboard");

  return (
    <div
      className={`h-dvh w-full bg-[#060607] grid ${
        showSideBar
          ? "grid-cols-1 pot:grid-cols-[20%_80%] lal:grid-cols-[15%_85%]"
          : "grid-cols-1"
      } `}
    >
      <LateralBar
        showSideBar={showSideBar}
        setShowSidebar={setShowSidebar}
        setTabs={setTabs}
      />
      <ScrollArea className="overflow-y-auto w-full h-full">
        <MainHeader
          showSideBar={showSideBar}
          setTabs={setTabs}
          setShowSidebar={setShowSidebar}
        />
        <section className="ret:py-14 ret:px-20 px-5 py-10">
          {tabs === "dashboard" && <DashboardSlice showSideBar={showSideBar} />}
          {tabs === "server" && <ServerSlice showSideBar={showSideBar} />}
          {tabs === "network" && <NetworkSlice />}
          {tabs === "endpoint" && <EndpointSlice showSideBar={showSideBar} />}
        </section>
      </ScrollArea>
    </div>
  );
}
