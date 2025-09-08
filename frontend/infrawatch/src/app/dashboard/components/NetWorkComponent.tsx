import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Braces,
  ChartArea,
  Ellipsis,
  Info,
  Network,
  OctagonAlert,
  ToggleLeft,
} from "lucide-react";
import { Device } from "../slices/Types/Network";
import { removeDoubleSlashes } from "@/components/AppComponents/API";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isEmpty } from "../slices/ServerComponents/ServerComponent";
import NetWorkSheet from "../slices/NetworkComponents/NetWorkSheetInfo";
import React from "react";

interface INetworkComponent {
  name: string;
  status: string | "UP" | "DOWN";
  firmware: string;
  manufacturer: string;
  totalInterfaces: number;
  activeInterfaces: number;
  downInterfaces: number;
  cpuUsage: number | string;
  temperature: number | string;
  device: Device;
}

const NetworkComponent: React.FC<INetworkComponent> = ({
  name,
  status,
  firmware,
  manufacturer,
  totalInterfaces,
  activeInterfaces,
  downInterfaces,
  cpuUsage,
  temperature,
  device,
}) => {
  const [openDetails, setOpenDetails] = React.useState(false);

  return (
    <div className="relative border flex-col border-zinc-300 dark:border-zinc-900 px-5 py-5 dark:bg-zinc-950 rounded-lg items-start flex justify-between">
      <span
        className={`border-background capitalize absolute -end-4 text-[12px] -top-4 font-semibold text-white py-[0.20rem] rounded-full px-2 ${
          status === "UP" ? "bg-green-600" : "bg-red-600"
        } `}
      >
        {status}
      </span>
      <header className="w-full">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2">
            <Network size={16} className="dark:text-zinc-500" />
          </p>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="dark:text-zinc-400 text-zinc-500 hover:text-black transition-all dark:hover:text-white cursor-pointer">
                  <Ellipsis size={20} className=" ms-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-40 me-5">
                <DropdownMenuItem
                  disabled={isEmpty(device.last_device)}
                  className="cursor-pointer"
                  onClick={() => setOpenDetails(true)}
                >
                  <Info size={16} className="opacity-60" aria-hidden="true" />
                  Detalhes
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={isEmpty(device.last_device)}
                  className="cursor-pointer"
                  // onClick={() => setOpenDetails(true)}
                >
                  <Braces size={16} className="opacity-60" aria-hidden="true" />
                  Todas as métricas
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setOpenDetails(true)}
                >
                  <ChartArea
                    size={16}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  Gráficos de desempenho
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  // onClick={() => setOpenDetails(true)}
                >
                  <ToggleLeft
                    size={16}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  Desativar monitoramento
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={isEmpty(device.last_device)}
                  className="disabled:cursor-not-allowed cursor-pointer !text-red-700 dark:!text-red-300"
                  // onClick={() => setOpenDetails(true)}
                >
                  <OctagonAlert
                    size={16}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  Mensagens de alerta
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="dark:text-zinc-200 pt-5">{name}</p>
        <p className="text-[15px] text-zinc-600 dark:text-zinc-500">
          {firmware} / {manufacturer}
        </p>
      </header>
      <div className="border-t flex flex-wrap gap-3 w-full dark:border-zinc-900 pt-2 mt-2">
        <div className="gap-2 py-[0.19rem] flex items-center  dark:text-white rounded-full">
          <p className="font-[420]">Status</p>
          <div
            className={`w-2 h-2 animate-pulse rounded-full ${
              status === "UP"
                ? "bg-green-500 ring-2 ring-green-500/50"
                : "bg-red-500 ring-2 ring-red-500/50"
            }`}
          ></div>
        </div>
        <Badge className="text-[14px] bg-transparent dark:text-white text-black border border-zinc-200 dark:border-zinc-900 px-2 font-[430] leading-none">
          Interfaces - {totalInterfaces} /{" "}
          <span className="text-green-500">{activeInterfaces}</span> /{" "}
          <span className="text-red-500">{downInterfaces}</span>
        </Badge>
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center w-full justify-between">
            <p className="dark:text-zinc-500 text-[15px]">Uso de CPU</p>
            <p className="dark:text-white">{cpuUsage}</p>
          </div>
          <div className="flex items-center w-full justify-between">
            <p className="dark:text-zinc-500 text-[15px]">Memória</p>
            <p className="dark:text-white">{temperature}</p>
          </div>
          <div className="flex items-center w-full justify-between">
            <p className="dark:text-zinc-500 text-[15px]">Uptime</p>
            <p className="dark:text-white text-[14px]">
              {removeDoubleSlashes(device.last_device.uptime).slice(3)} -{" "}
            </p>
          </div>
        </div>
        <footer className="w-full">
          <Button
            onClick={() => setOpenDetails(true)}
            className="w-full shadow-none text-base  cursor-pointer dark:hover:bg-zinc-900 bg-zinc-950 border dark:border-zinc-900 dark:text-white  hover:opacity-80"
          >
            Detalhes <Info size={16} />
          </Button>
        </footer>
      </div>

      <NetWorkSheet
        device={device}
        open={openDetails}
        setOpen={setOpenDetails}
      />
    </div>
  );
};

export default NetworkComponent;
