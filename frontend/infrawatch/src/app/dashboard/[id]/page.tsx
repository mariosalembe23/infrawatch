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
  const [isConnected, setIsConnected] = React.useState(false);
  const [messages, setMessages] = React.useState<string[]>([]);

  useEffect(() => {
    // 1. Inicialize a conexão Socket.IO
    socketRef.current = io("https://infrawatch-in5r.onrender.com/");

    // 2. Escute os eventos de conexão/desconexão
    socketRef.current.on("connect", () => {
      setIsConnected(true);
      console.log("Conectado ao servidor Socket.IO!");
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
      console.log("Desconectado do servidor Socket.IO!");
    });

    // 3. Escute o evento de mensagem do servidor
    socketRef.current.on("notification", (message) => {
      console.log("Mensagem recebida do servidor:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socketRef.current.onAny((event, ...args) => {
      console.log(`Evento recebido: ${event}`, args);
      setMessages((prevMessages) => [...prevMessages, `${event}: ${args}`]);
    });

    // 4. Limpeza (cleanup) quando o componente é desmontado
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []); // Array de dependências vazio para rodar apenas uma vez

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

    fecthWorkspaces();
    fetchUserData();
    getWorkSpaceInfo();
  }, [id]);

  useEffect(() => {
    ThemeFunc({ setIsDarkMode });
  }, []);

  // console.log("MESSAGES: ", workSpaceInfo);

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
            setMessageError={setMessageError}
          />
          {/*  */}
          <section className="ret:py-14 lal:px-20 ret:px-10 px-5 py-10">
            {tabs === "dashboard" && (
              <DashboardSlice
                showSideBar={showSideBar}
                setErrorMessage={setMessageError}
              />
            )}
            {tabs === "server" && (
              <ServerSlice
                showSideBar={showSideBar}
                setErrorMessage={setMessageError}
              />
            )}
            {tabs === "network" && <NetworkSlice />}
            {tabs === "endpoint" && (
              <EndpointSlice
                showSideBar={showSideBar}
                setErrorMessage={setMessageError}
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
            {tabs === "members" && <MembersSlice showSideBar={showSideBar} />}
          </section>
        </ScrollArea>
      </DashboardContext.Provider>
    </div>
  );
}
