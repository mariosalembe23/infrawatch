"use client";

import React, { useEffect, useRef } from "react";
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
import ServiceNotFound from "@/components/AppComponents/ServiceNotFound";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";
import { NotificationsProps } from "../components/Notifications";
import { toast } from "sonner";
import { ServerProps } from "../slices/Types/Server";
import ServicesSlice from "../slices/ServicesSlice";
import { EndpointProps } from "../slices/Types/Endpoint";
import { Device } from "../slices/Types/Network";

export type Tabs =
  | "server"
  | "network"
  | "endpoint"
  | "dashboard"
  | "settings"
  | "members"
  | "services";

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
  const [workspaces, setWorkspaces] = React.useState<WorkSpaceProps[]>([]);
  const [loadingWork, setLoadingWork] = React.useState<boolean>(false);
  const contextValue = React.useMemo(
    () => ({
      userData,
      workSpaceInfo,
      loading,
      userLoading,
      isDarkMode,
      setIsDarkMode,
    }),
    [userData, workSpaceInfo, loading, userLoading, isDarkMode]
  );
  const [messageError, setMessageError] = React.useState<string>("");
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  const [notification, setNotification] = React.useState<NotificationsProps>({
    title: "",
    content: "",
    workspaceId: "",
    created_at: "",
  });
  const [servers, setServers] = React.useState<ServerProps[]>([]);
  const [serversLoading, setServersLoading] = React.useState<boolean>(true);
  const [endpoints, setEndpoints] = React.useState<EndpointProps[]>([]);
  const [loadingEndpoints, setLoadingEndpoints] = React.useState<boolean>(true);
  const [lastLog, setLastLog] = React.useState<EndpointProps["last_log"]>({
    endpointId: "",
    workspaceId: "",
    url: "",
    status: "DOWN",
    statusResponse: "",
    timestamp: "",
    time_response: "",
  });
  // 192.168.2 - 6 => roteadoares
  // 192.168.7 - 11 => switches
  // 10.0.0.1 - 5 => firewalls
  // 192.168.20 - 25 => impressoras
  const [devices, setDevices] = React.useState<Device[]>([]);
  const [devicesLoading, setDevicesLoading] = React.useState<boolean>(true);

  useEffect(() => {
    socketRef.current = io("https://infrawatch-in5r.onrender.com/");

    socketRef.current.on("connect", () => {
      console.log("Conectado ao servidor Socket.IO!");
    });

    socketRef.current.on("disconnect", () => {
      console.log("Desconectado do servidor Socket.IO!");
    });

    socketRef.current.on("notification", (message) => {
      toast.success(`Nova notificação: ${message.title}`, {
        description: message.content,
        duration: 5000,
        position: "top-center",
      });
      setNotification(message);
    });

    socketRef.current.on("logEndpoint", (message) => {
      setLastLog(message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const getServers = async () => {
      if (!workSpaceInfo?.id) return;
      try {
        const response = await axios.get(APIS.GET_SERVERS + workSpaceInfo?.id, {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        });
        setServers(response.data || []);
        setServersLoading(false);
      } catch (error) {
        setServersLoading(false);
        console.error("Error fetching servers:", error);
        GenericAxiosActions({
          error,
          message: "Erro ao buscar servidores",
          setErrorMessage: setMessageError,
        });
      }
    };

    const getEndpoints = async () => {
      if (!workSpaceInfo?.id) return;
      try {
        const response = await axios.get(
          APIS.GET_ENDPOINTS + workSpaceInfo?.id,
          {
            headers: {
              Authorization: `Bearer ${getCookie("token")}`,
            },
          }
        );
        setEndpoints(response.data || []);
        setLoadingEndpoints(false);
      } catch (error) {
        setLoadingEndpoints(false);
        console.error("Error fetching endpoints:", error);
        GenericAxiosActions({
          error,
          message: "Erro ao buscar endpoints",
          setErrorMessage: setMessageError,
        });
      }
    };

    getServers();
    getEndpoints();
  }, [workSpaceInfo?.id, setMessageError]);

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
          setErrorMessage: setMessageError,
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
          setErrorMessage: setMessageError,
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
          setErrorMessage: setMessageError,
        });
      }
    };

    const fetchDevices = async () => {
      try {
        const response = await axios.get(APIS.GET_DEVICES + id, {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        });
        setDevicesLoading(false);
        setDevices(response.data || []);
        console.log("Devices:", response.data);
      } catch (error) {
        setDevicesLoading(false);
        console.error("Error fetching devices:", error);
        GenericAxiosActions({
          error,
          message: "Erro ao buscar dispositivos",
          setErrorMessage: setMessageError,
        });
      }
    };

    fecthWorkspaces();
    fetchUserData();
    getWorkSpaceInfo();
    fetchDevices();
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
      {messageError.length > 0 && (
        <ServiceNotFound messageError={messageError} />
      )}
      {(loading ||
        userLoading ||
        serversLoading ||
        loadingEndpoints ||
        devicesLoading) && <LoadingComponent />}
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
            setMessageError={setMessageError}
            notification={notification}
          />
          {/*  */}
          <section className="ret:py-14 lal:px-20 ret:px-10 px-5 py-10">
            {tabs === "dashboard" && (
              <DashboardSlice
                showSideBar={showSideBar}
                setErrorMessage={setMessageError}
                servers={servers}
                setServers={setServers}
                setTabs={setTabs}
                endpoints={endpoints}
                setEndpoints={setEndpoints}
                lastLog={lastLog}
                devices={devices}
                setDevices={setDevices}
              />
            )}
            {tabs === "server" && (
              <ServerSlice
                showSideBar={showSideBar}
                setErrorMessage={setMessageError}
                workspace_id={workSpaceInfo?.id || ""}
                servers={servers}
                setServers={setServers}
              />
            )}
            {tabs === "network" && (
              <NetworkSlice
                servers={servers}
                setErrorMessage={setMessageError}
                workspace_id={workSpaceInfo?.id || ""}
                devices={devices}
                setDevices={setDevices}
              />
            )}
            {tabs === "endpoint" && (
              <EndpointSlice
                showSideBar={showSideBar}
                setErrorMessage={setMessageError}
                workspace_id={workSpaceInfo?.id || ""}
                endpoints={endpoints}
                setEndpoints={setEndpoints}
                lastLog={lastLog}
              />
            )}
            {tabs === "settings" && (
              <SettingsSlice
                setWorkspaces={setWorkspaces}
                showSideBar={showSideBar}
                data={userData}
                setUserData={setUserData}
                workspaceInfo={workSpaceInfo}
                setWorkspaceInfo={setWorkSpaceInfo}
                workspaces={workspaces}
                setErrorMessage={setMessageError}
              />
            )}
            {tabs === "members" && (
              <MembersSlice
                showSideBar={showSideBar}
                setErrorMessage={setMessageError}
              />
            )}
            {tabs === "services" && (
              <ServicesSlice
                showSideBar={showSideBar}
                setErrorMessage={setMessageError}
                servers={servers}
                setServers={setServers}
                setTabs={setTabs}
              />
            )}
          </section>
        </ScrollArea>
      </DashboardContext.Provider>
    </div>
  );
}
