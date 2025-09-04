import ButtonCustom from "./ButtonCustom";
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
  Server,
  Users,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs } from "../[id]/page";
import { WorkSpaceProps } from "@/app/chooseWorkspace/[id]/page";
import SwitchWork from "./SwitchWork";
import { DashboardContext } from "../[id]/ContextProvider";
import { LogOut } from "@/components/AppComponents/decodeToken";

interface IBottomMenuSheet {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTabs: React.Dispatch<React.SetStateAction<Tabs>>;
  workspacesData: {
    workspaces: WorkSpaceProps[];
    loadingWork: boolean;
  };
}

const BottomMenuSheet: React.FC<IBottomMenuSheet> = ({
  open,
  setOpen,
  setTabs,
  workspacesData,
}) => {
  const execAndClose = (tab: Tabs) => {
    setTabs(tab);
    setOpen(false);
  };
  const [showCard, setShowCard] = React.useState<boolean>(false);
  const dashboardContext = React.useContext(DashboardContext);
  const workSpaceInfo = dashboardContext?.workSpaceInfo;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="bottom"
        className="dark:bg-[#060607] bg-white border-none shadow-2xl h-full dark:text-white"
      >
        <SheetHeader className="border-b  dark:border-zinc-900">
          <SheetTitle className="dark:text-white font-medium">Menu</SheetTitle>
        </SheetHeader>
        <div className="h-full  overflow-y-auto">
          <div className=" p-5 text-start">
            <div className="flex flex-col gap-6">
              <ButtonCustom
                onClick={() => execAndClose("dashboard")}
                title="Dashboard"
              >
                <LayoutDashboard size={18} className="dark:text-white" />
              </ButtonCustom>
              <ButtonCustom
                onClick={() => execAndClose("server")}
                title="Servidores"
              >
                <Server size={18} className="dark:text-white" />
              </ButtonCustom>
              <ButtonCustom
                onClick={() => execAndClose("network")}
                title="Aparelhos de Rede"
              >
                <Network size={18} className="dark:text-white" />
              </ButtonCustom>
              <ButtonCustom
                onClick={() => execAndClose("endpoint")}
                title="Endpoints"
              >
                <Link2 size={18} className="dark:text-white" />
              </ButtonCustom>
              <ButtonCustom
                onClick={() => execAndClose("services")}
                title="Serviços"
              >
                <DatabaseZap size={18} className="dark:text-white" />
              </ButtonCustom>
            </div>
          </div>
          <div className="mt-5 p-5 border-t dark:border-zinc-900">
            <div className="flex mt-2 flex-col gap-6">
              <ButtonCustom
                onClick={() => execAndClose("settings")}
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
              <ButtonCustom
                title="Membros"
                onClick={() => execAndClose("members")}
              >
                <Users size={18} className="dark:text-white" />
              </ButtonCustom>
            </div>
          </div>
          <div className="mt-5 p-5 border-t dark:border-zinc-900">
            <div className="flex mt-2 flex-col pb-5 gap-6">
              <ButtonCustom title="Suporte">
                <Info size={18} className="dark:text-white" />
              </ButtonCustom>
              <div>
                <p className="dark:text-zinc-300 text-lg">Mário Salembe</p>
                <p className="dark:text-zinc-500 text-zinc-600 text-[15px] font-[430]">
                  linomario199010@gmail.com
                </p>
                <Button
                  onClick={LogOut}
                  className="py-4 w-full mt-5 bg-red-600/40 border border-red-700 hover:bg-red-600/50 cursor-pointer text-red-800 dark:text-white"
                >
                  <ArrowLeft size={18} className="" />
                  Terminar sessão
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
      <SwitchWork
        setShowInfo={setShowCard}
        showInfo={showCard}
        workName={workSpaceInfo?.workspace_name}
        description={workSpaceInfo?.about}
        workspaces={workspacesData.workspaces}
      />
    </Sheet>
  );
};

export default BottomMenuSheet;
