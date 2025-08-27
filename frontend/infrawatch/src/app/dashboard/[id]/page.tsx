"use client";

import React, { useEffect } from "react";
import LateralBar from "../components/LateralBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import DashboardSlice from "../slices/DashboardSlice";
import MainHeader from "../components/MainHeader";
import ServerSlice from "../slices/ServerSlice";
import NetworkSlice from "../slices/NetworkSlice";
import EndpointSlice from "../slices/EndpointSlice";
import { useParams } from "next/navigation";
import axios from "axios";
import { APIS, GenericAxiosActions } from "@/components/AppComponents/API";
import { UserData, WorkSpaceProps } from "@/app/chooseWorkspace/[id]/page";
import LoadingComponent from "@/components/AppComponents/LoadComponent";
import { getCookie } from "cookies-next/client";
import { DashboardContext } from "./ContextProvider";
import { ThemeFunc } from "@/components/AppComponents/ThemeFunc";
import SettingsSlice from "../slices/SettingsSlice";
import MembersSlice from "../slices/MembersSlice";

export type Tabs =
  | "server"
  | "network"
  | "endpoint"
  | "dashboard"
  | "settings"
  | "members";

export default function Dashboard() {
  const [showSideBar, setShowSidebar] = React.useState(true);
  const [tabs, setTabs] = React.useState<Tabs>("dashboard");
  const [loading, setLoading] = React.useState<boolean>(true);
  const [workSpaceInfo, setWorkSpaceInfo] =
    React.useState<WorkSpaceProps | null>(null);
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [userLoading, setUserLoading] = React.useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(false);
  const { id } = useParams();
  const contextValue = {
    userData,
    workSpaceInfo,
    loading,
    userLoading,
    isDarkMode,
    setIsDarkMode,
  };
  const [workspaces, setWorkspaces] = React.useState<WorkSpaceProps[]>([]);
  const [loadingWork, setLoadingWork] = React.useState<boolean>(false);

  useEffect(() => {
    const getWorkSpaceInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://infra-watch-zeta.vercel.app/api/v1/workspace/each/${id}`,
          {
            headers: {
              Authorization: `Bearer ${getCookie("token")}`,
            },
          }
        );
        if (response.status === 200) {
          setWorkSpaceInfo(response.data);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        GenericAxiosActions({
          error,
          message: "Erro ao buscar informações do workspace",
        });
      }
    };

    const fetchUserData = async () => {
      try {
        setUserLoading(true);
        const response = await axios.get(APIS.GET_USER, {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        });
        setUserLoading(false);
        setUserData(response.data);
      } catch (error) {
        setUserLoading(false);
        GenericAxiosActions({
          error,
          message: "Erro ao buscar dados do usuário.",
        });
      }
    };

    const fecthWorkspaces = async () => {
      try {
        setLoadingWork(true);
        const response = await axios.get(APIS.GET_WORKSPACES, {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        });
        setLoadingWork(false);
        if (response.status === 200) {
          setWorkspaces(response.data || []);
        }
      } catch (error) {
        setLoadingWork(false);
        GenericAxiosActions({
          error,
          message: "Erro ao buscar espaços de trabalho.",
        });
      }
    };

    fecthWorkspaces();
    fetchUserData();
    getWorkSpaceInfo();
  }, [id]);

  useEffect(() => {
    ThemeFunc({ setIsDarkMode });
  }, []);

  return (
    <div
      className={`h-dvh w-full grid ${
        showSideBar
          ? "grid-cols-1 pot:grid-cols-[20%_80%] lal:grid-cols-[15%_85%]"
          : "grid-cols-1"
      } `}
    >
      {(loading || userLoading) && <LoadingComponent />}
      <DashboardContext.Provider value={contextValue}>
        <LateralBar
          showSideBar={showSideBar}
          setShowSidebar={setShowSidebar}
          setTabs={setTabs}
          userData={userData}
          workspacesData={{
            workspaces,
            loadingWork,
          }}
        />
        <ScrollArea className="overflow-y-auto w-full h-full">
          <MainHeader
            showSideBar={showSideBar}
            setTabs={setTabs}
            setShowSidebar={setShowSidebar}
            workspacesData={{
              workspaces,
              loadingWork,
            }}
          />
          {/*  */}
          <section className="ret:py-14 lal:px-20 ret:px-10 px-5 py-10">
            {tabs === "dashboard" && (
              <DashboardSlice showSideBar={showSideBar} />
            )}
            {tabs === "server" && <ServerSlice showSideBar={showSideBar} />}
            {tabs === "network" && <NetworkSlice />}
            {tabs === "endpoint" && <EndpointSlice showSideBar={showSideBar} />}
            {tabs === "settings" && <SettingsSlice showSideBar={showSideBar} />}
            {tabs === "members" && <MembersSlice showSideBar={showSideBar} />}
          </section>
        </ScrollArea>
      </DashboardContext.Provider>
    </div>
  );
}
