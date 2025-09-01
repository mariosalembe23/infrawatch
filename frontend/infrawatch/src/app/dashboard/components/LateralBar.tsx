import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Bolt,
  Container,
  DatabaseZap,
  Info,
  LayoutDashboard,
  Link2,
  Network,
  OctagonAlert,
  PanelLeft,
  Server,
  Users,
} from "lucide-react";
import React from "react";
import ButtonCustom from "./ButtonCustom";
import { UserData, WorkSpaceProps } from "@/app/chooseWorkspace/[id]/page";
import { DashboardContext } from "../[id]/ContextProvider";
import { Tabs } from "../[id]/page";
import SwitchWork from "./SwitchWork";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ILateralBar {
  showSideBar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setTabs: React.Dispatch<React.SetStateAction<Tabs>>;
  userData?: UserData | null;
  workspacesData: {
    workspaces: WorkSpaceProps[];
    loadingWork: boolean;
  };
}

const LateralBar: React.FC<ILateralBar> = ({
  showSideBar,
  setShowSidebar,
  setTabs,
  workspacesData,
}) => {
  const dashboardContext = React.useContext(DashboardContext);
  const userData = dashboardContext?.userData;
  const isDarkMode = dashboardContext?.isDarkMode;
  const [showCard, setShowCard] = React.useState<boolean>(false);
  const workSpaceInfo = dashboardContext?.workSpaceInfo;

  return (
    <ScrollArea
      className={`border-r  ${
        showSideBar ? "pot:block hidden" : "hidden"
      } dark:border-zinc-900 overflow-y-auto`}
    >
      <header className="sticky dark:bg-[#060607] bg-white top-0 left-0 w-full h-16">
        <div className="flex border-b items-center px-5 h-16 dark:border-zinc-900 justify-between">
          <svg
            className="dark:text-black text-white size-5"
            viewBox="0 0 56 56"
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="56"
              height="56"
              rx="7"
              fill={isDarkMode ? "#fff" : "#000"}
            />
            <path
              d="M10 37C10 31.4772 14.4772 27 20 27V27V56H10V37Z"
              fill="currentColor"
            />
            <path
              d="M23 24C23 18.4772 27.4772 14 33 14V14V56H23V24Z"
              fill="currentColor"
            />
            <path
              d="M36 17C36 11.4772 40.4772 7 46 7V7V56H36V17Z"
              fill="currentColor"
            />
          </svg>
          <Button
            onClick={() => setShowSidebar((prev) => !prev)}
            size={"icon"}
            className="rounded-full hover:bg-gray-200 bg-zinc-50 border size-8 cursor-pointer dark:bg-zinc-900 dark:hover:bg-zinc-950 dark:border-zinc-800"
          >
            <PanelLeft
              size={25}
              className="dark:text-white text-zinc-900 size-5"
            />
          </Button>
        </div>
      </header>

      <div className="mt-1 p-5 text-start h-full">
        <h2 className="dark:text-zinc-400">Menu</h2>
        <div className="flex mt-7 flex-col gap-6">
          <ButtonCustom onClick={() => setTabs("dashboard")} title="Dashboard">
            <LayoutDashboard size={18} className="dark:text-white" />
          </ButtonCustom>
          <ButtonCustom onClick={() => setTabs("server")} title="Servidores">
            <Server size={18} className="dark:text-white" />
          </ButtonCustom>
          <ButtonCustom
            onClick={() => setTabs("network")}
            title="Aparelhos de Rede"
          >
            <Network size={18} className="dark:text-white" />
          </ButtonCustom>
          <ButtonCustom onClick={() => setTabs("endpoint")} title="Endpoints">
            <Link2 size={18} className="dark:text-white" />
          </ButtonCustom>
          <ButtonCustom title="Serviços">
            <DatabaseZap size={18} className="dark:text-white" />
          </ButtonCustom>
        </div>
      </div>
      <div className="mt-5 p-5 border-t dark:border-zinc-900">
        <div className="flex mt-2 flex-col gap-6">
          <ButtonCustom
            onClick={() => setTabs("settings")}
            title="Configurações"
          >
            <Bolt size={18} className="dark:text-white" />
          </ButtonCustom>
          <ButtonCustom type="danger" title="Alertas">
            <OctagonAlert size={18} className="dark:text-white" />
          </ButtonCustom>
          <ButtonCustom
            disabled={workspacesData.loadingWork}
            onClick={() => setShowCard(true)}
            title="Workspaces"
          >
            {workspacesData.loadingWork && (
              <span className="loader !w-3 !h-3 !border-2 !border-b-white !border-zinc-600"></span>
            )}
            <Container size={18} className="dark:text-white" />
          </ButtonCustom>
          <ButtonCustom onClick={() => setTabs("members")} title="Membros">
            <Users size={18} className="dark:text-white" />
          </ButtonCustom>
        </div>
      </div>
      <div className="mt-5 p-5 border-t dark:border-zinc-900">
        <div className="flex mt-2 flex-col gap-6">
          <ButtonCustom title="Suporte">
            <Info size={18} className="dark:text-white" />
          </ButtonCustom>
          <div>
            <p className="dark:text-zinc-300 text-lg">{userData?.name}</p>
            <p className="dark:text-zinc-500 text-zinc-600 text-[15px] font-[430]">
              {userData?.email}
            </p>
            <Button
              onClick={() => {
                window.location.href = `/chooseWorkspace/${userData?.id}`;
              }}
              className="py-4 w-full mt-5 bg-red-600/40 border border-red-700 hover:bg-red-600/50 cursor-pointer text-red-800 dark:text-white"
            >
              <ArrowLeft size={18} className="" />
              Sair
            </Button>
          </div>
        </div>
      </div>
      <SwitchWork
        setShowInfo={setShowCard}
        showInfo={showCard}
        workName={workSpaceInfo?.workspace_name}
        description={workSpaceInfo?.about}
        workspaces={workspacesData.workspaces}
      />
    </ScrollArea>
  );
};

export default LateralBar;
