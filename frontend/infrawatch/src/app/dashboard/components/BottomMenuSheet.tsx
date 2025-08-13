import ButtonCustom from "./ButtonCustom";
import {
  Bolt,
  ChartArea,
  CircleUser,
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

type Tabs = "server" | "network" | "endpoint" | "dashboard";

interface IBottomMenuSheet {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTabs: React.Dispatch<React.SetStateAction<Tabs>>;
}

const BottomMenuSheet: React.FC<IBottomMenuSheet> = ({
  open,
  setOpen,
  setTabs,
}) => {
  const execAndClose = (tab: Tabs) => {
    setTabs(tab);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="bottom"
        className="bg-[#060607] border-none shadow-2xl h-full text-white"
      >
        <SheetHeader className="border-b  border-zinc-900">
          <SheetTitle className="text-white font-medium">Menu</SheetTitle>
        </SheetHeader>
        <div className="h-full  overflow-y-auto">
          <div className=" p-5 text-start">
            <div className="flex flex-col gap-6">
              <ButtonCustom
                onClick={() => execAndClose("dashboard")}
                title="Dashboard"
              >
                <LayoutDashboard size={18} className="text-white" />
              </ButtonCustom>
              <ButtonCustom
                onClick={() => execAndClose("server")}
                title="Servidores"
              >
                <Server size={18} className="text-white" />
              </ButtonCustom>
              <ButtonCustom
                onClick={() => execAndClose("network")}
                title="Aparelhos de Rede"
              >
                <Network size={18} className="text-white" />
              </ButtonCustom>
              <ButtonCustom
                onClick={() => execAndClose("endpoint")}
                title="Endpoints"
              >
                <Link2 size={18} className="text-white" />
              </ButtonCustom>
              <ButtonCustom title="Estatí. & Relatórios">
                <ChartArea size={18} className="text-white" />
              </ButtonCustom>
            </div>
          </div>
          <div className="mt-5 p-5 border-t border-zinc-900">
            <div className="flex mt-2 flex-col gap-6">
              <ButtonCustom title="Perfil">
                <CircleUser size={18} className="text-white" />
              </ButtonCustom>
              <ButtonCustom title="Configurações">
                <Bolt size={18} className="text-white" />
              </ButtonCustom>
              <ButtonCustom type="danger" title="Alertas">
                <OctagonAlert size={18} className="text-red-400" />
              </ButtonCustom>
              <ButtonCustom title="Aparelhos de Rede">
                <Network size={18} className="text-white" />
              </ButtonCustom>
              <ButtonCustom title="Utilizadores">
                <Users size={18} className="text-white" />
              </ButtonCustom>
            </div>
          </div>
          <div className="mt-5 p-5 border-t border-zinc-900">
            <div className="flex mt-2 flex-col pb-5 gap-6">
              <ButtonCustom title="Suporte">
                <Info size={18} className="text-white" />
              </ButtonCustom>
              <div>
                <p className="text-zinc-300 text-lg">Mário Salembe</p>
                <p className="text-zinc-500 text-[15px] font-[430]">
                  linomario199010@gmail.com
                </p>
                <Button className="w-full mt-3">Terminar Sessão</Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BottomMenuSheet;
