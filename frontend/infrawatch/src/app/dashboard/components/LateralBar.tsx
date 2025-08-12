import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bolt,
  ChartArea,
  ChevronRight,
  CircleUser,
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

interface IButtonCustom {
  children: React.ReactNode;
  title: string;
  type?: "normal" | "danger";
}

const ButtonCustom: React.FC<IButtonCustom> = ({
  children,
  title,
  type = "normal",
}) => {
  return type === "normal" ? (
    <button className="flex items-center flex-nowrap font-[430] justify-between transition-all hover:opacity-80 cursor-pointer">
      <span className="flex items-center text-start gap-2 text-white">
        {children}
        {title}
      </span>
      <ChevronRight size={19} className="text-zinc-400" />
    </button>
  ) : (
    <button className="flex items-center font-[430] justify-between transition-all hover:opacity-80 cursor-pointer">
      <span className="flex items-center gap-2 text-red-400">
        {children}
        <p className="flex items-center gap-2">
          {title}
          <Badge className="min-w-5 bg-red-500 text-white px-1">6</Badge>
        </p>
      </span>
      <ChevronRight size={19} className="text-zinc-400" />
    </button>
  );
};

interface ILateralBar {
  showSideBar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const LateralBar: React.FC<ILateralBar> = ({ showSideBar, setShowSidebar }) => {
  return (
    <nav
      className={`border-r ${
        showSideBar ? "block" : "hidden"
      } border-zinc-900 overflow-y-auto`}
    >
      <header className="sticky bg-[#060607] top-0 left-0 w-full h-16">
        <div className="flex border-b items-center px-5 h-16 border-zinc-900 justify-between">
          <svg
            className="text-black size-5"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="56" height="56" rx="7" fill="#fff" />
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
            className="rounded-full border size-8 cursor-pointer border-zinc-800"
          >
            <PanelLeft size={25} className="text-white size-5" />
          </Button>
        </div>
      </header>

      <div className="mt-1 p-5 text-start">
        <h2 className="text-zinc-400">Menu</h2>
        <div className="flex mt-7 flex-col gap-6">
          <ButtonCustom title="Dashboard">
            <LayoutDashboard size={18} className="text-white" />
          </ButtonCustom>
          <ButtonCustom title="Servidores">
            <Server size={18} className="text-white" />
          </ButtonCustom>
          <ButtonCustom title="Aparelhos de Rede">
            <Network size={18} className="text-white" />
          </ButtonCustom>
          <ButtonCustom title="Endpoints">
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
        <div className="flex mt-2 flex-col gap-6">
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
    </nav>
  );
};

export default LateralBar;
