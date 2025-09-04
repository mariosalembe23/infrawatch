import React, { useRef } from "react";
import {
  ChartArea,
  Ellipsis,
  Info,
  OctagonAlert,
  Settings2,
  ToggleLeft,
  ZapIcon,
} from "lucide-react";
import LogSheet from "./LogSheet";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServerProps } from "../slices/Types/Server";
import { DataMode } from "../slices/Types/DataMod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IServerComponent {
  server: ServerProps;
  index: number;
  lastIndex: number;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}

const BetweenDiv = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-between w-full">{children}</div>
  );
};

const ColDiv = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col items-start w-full">{children}</div>;
};

const ServerComponent: React.FC<IServerComponent> = ({
  index,
  lastIndex,
  setSelectedItem,
  server,
}) => {
  const [openLogs, setOpenLogs] = React.useState(false);
  const [openDetails, setOpenDetails] = React.useState(false);

  const [hasReadToBottom, setHasReadToBottom] = React.useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const content = contentRef.current;
    if (!content) return;

    const scrollPercentage =
      content.scrollTop / (content.scrollHeight - content.clientHeight);
    if (scrollPercentage >= 0.99 && !hasReadToBottom) {
      setHasReadToBottom(true);
    }
  };

  return (
    <div
      className={` dark:border-zinc-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-950/20 px-5 py-3 dark:bg-zinc-950 ${
        index === 1
          ? "rounded-t-lg border"
          : index === lastIndex
          ? "rounded-b-lg border-b border-x"
          : "border-b border-x"
      }  grid grid-cols-2 gap-y-5 pot:grid-cols-4 items-center`}
    >
      <div>
        <p className="dark:text-white text-base font-[450]">
          {server.servername}{" "}
        </p>
        <p className="dark:text-zinc-500 text-zinc-600 uppercase font-[450] text-[13px]">
          <Badge className="dark:bg-cyan-500/40 bg-cyan-600 text-white  border dark:border-cyan-200/50">
            <ZapIcon
              className="-ms-0.5 opacity-60"
              size={12}
              aria-hidden="true"
            />
            {server.last_metrics.cpu_usage} CPU
          </Badge>
        </p>
      </div>
      <div className="pot:order-2 order-3 text-start pot:text-end">
        <div className="flex items-center gap-2 justify-start pot:justify-end">
          <p className="dark:text-white">Status</p>
          <span className="relative flex size-2">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                server.is_busy ? "bg-sky-400" : "bg-zinc-500"
              }  opacity-75`}
            ></span>
            <span
              className={`relative inline-flex size-2 rounded-full ${
                server.is_busy ? "bg-sky-400" : "bg-zinc-500"
              } bg-sky-500`}
            ></span>
          </span>
        </div>
        <p className="text-zinc-500 leading-none  text-[15px]">
          {server.is_busy ? "Ocioso" : "Desconectado"}
        </p>
      </div>

      <div className="pot:order-3 order-4">
        <div className="flex flex-col items-end justify-end gap-1">
          <p className="dark:text-zinc-100 flex gap-1 items-center">
            <ZapIcon className=" opacity-60" size={12} aria-hidden="true" />
            Deploys
          </p>
          <Badge className="bg-red-500/20 dark:text-white text-red-800">
            <OctagonAlert
              className=" opacity-60"
              size={12}
              aria-hidden="true"
            />{" "}
            Alertas 0
          </Badge>
        </div>
      </div>
      <div className="flex pot:order-4 order-2 items-center justify-end">
        <div className="flex items-center gap-3">
          <p className="text-zinc-400 text-[15px]">
            há {DataMode(server.created_at)} por msalembe
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="dark:text-zinc-400 text-zinc-500 hover:text-black transition-all dark:hover:text-white cursor-pointer">
              <Ellipsis size={20} className=" ms-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-40">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setOpenDetails(true)}
            >
              <Info size={16} className="opacity-60" aria-hidden="true" />
              Detalhes
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setOpenDetails(true)}
            >
              <Settings2 size={16} className="opacity-60" aria-hidden="true" />
              Conf. de métricas
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() =>
                setSelectedItem && setSelectedItem(server.servername)
              }
            >
              <ChartArea size={16} className="opacity-60" aria-hidden="true" />
              Gráficos de desempenho
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setOpenDetails(true)}
            >
              <ToggleLeft size={16} className="opacity-60" aria-hidden="true" />
              Desativar monitoramento
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <LogSheet
        openLogs={openLogs}
        setOpenLogs={setOpenLogs}
        nameServer={server.servername}
      />

      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent className="flex bg-[#060607] flex-col  border-zinc-900  gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-xl [&>button:last-child]:top-3.5">
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="border-b font-medium border-zinc-900 text-white px-6 py-4 text-base">
              Detalhes - Servidor {server.servername}
            </DialogTitle>
            <ScrollArea
              ref={contentRef}
              onScroll={handleScroll}
              className="overflow-y-auto scrollDiv"
            >
              <DialogDescription asChild>
                <DialogDescription asChild>
                  <div className="pt-7 pb-10 font-mono  px-7 flex flex-col gap-5">
                    <ColDiv>
                      <p className="text-cyan-500  font-[450] ">
                        Nome do Servidor
                      </p>
                      <p className="text-base text-white text-[15px]">
                        {server.servername}
                      </p>
                    </ColDiv>
                    <BetweenDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        Indetificador
                      </p>
                      <p className="text-base text-white text-[15px]">
                        {server.server_idenfier}
                      </p>
                    </BetweenDiv>
                    <BetweenDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        Uptime
                      </p>
                      <p className="text-base text-white text-[15px]">
                        {server.last_metrics.last_boot}
                      </p>
                    </BetweenDiv>
                    <BetweenDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        Núcleos Físicos
                      </p>
                      <p className="text-base text-white text-[15px]">
                        {server.last_metrics.fisical_nucleos}
                      </p>
                    </BetweenDiv>
                    <BetweenDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        Núcleos Lógicos
                      </p>
                      <p className="text-base text-white text-[15px]">
                        {server.last_metrics.logical_nucleos || "N/A"}
                      </p>
                    </BetweenDiv>
                    <ColDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        Uso de CPU
                      </p>
                      <p className="text-base text-[15px] text-white">
                        {server.last_metrics.cpu_usage}%
                      </p>
                    </ColDiv>
                    <BetweenDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        Frequência do CPU
                      </p>
                      <p className="text-base text-[15px] text-white">
                        {server.last_metrics.cpu_frequency}
                      </p>
                    </BetweenDiv>
                    <ColDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        RAM
                      </p>
                      <p className="text-base  text-[15px]  text-white">
                        Total: {server.last_metrics.ram_usage_total}/Usada:{" "}
                        {server.last_metrics.ram_usage_available}/Livre:{" "}
                        {server.last_metrics.ram_usage_free}
                      </p>
                    </ColDiv>
                    <ColDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        SWAP
                      </p>
                      <p className="text-base  text-[15px]  text-white">
                        Total: {server.last_metrics.swap_usage_total}/Usada:{" "}
                        {server.last_metrics.swap_usage_available}/Livre:{" "}
                        {server.last_metrics.swap_usage_free}
                      </p>
                    </ColDiv>
                    <BetweenDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        Dados Enviados
                      </p>
                      <p className="text-base text-[15px] text-white">
                        {server.last_metrics.sendData}
                      </p>
                    </BetweenDiv>
                    <BetweenDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        Dados Recebidos
                      </p>
                      <p className="text-base text-[15px] text-white">
                        {server.last_metrics.receiveData}
                      </p>
                    </BetweenDiv>
                    <ColDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        Interfaces Activadas
                      </p>
                      <p className="text-base  text-[15px]  text-white">
                        {server.last_metrics.activated_interfaces || "N/A"}
                      </p>
                    </ColDiv>
                    <BetweenDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        Temperatura da CPU
                      </p>
                      <p className="text-base text-[15px] text-white">
                        {server.last_metrics.cpu_temperature || "N/A"}
                      </p>
                    </BetweenDiv>
                    {server.last_metrics.battery_level !== "unknown" && (
                      <ColDiv>
                        <p className="text-cyan-500  font-[450] text-[14px]">
                          Bateria
                        </p>
                        <p className="text-base text-[15px]  text-white">
                          {server.last_metrics.battery_plugged === "false"
                            ? "Desconectado da fonte de alimentação"
                            : "Conectado à fonte de alimentação "}
                          <span
                            className={`inline-flex w-2 h-2 rounded-full ms-2 ${
                              server.last_metrics.battery_plugged === "false"
                                ? "bg-red-500"
                                : "bg-green-500"
                            } `}
                          ></span>
                        </p>
                        <p className="text-base text-[15px] text-white">
                          Porcentagem: {server.last_metrics.battery_level}
                        </p>
                      </ColDiv>
                    )}
                  </div>
                </DialogDescription>
              </DialogDescription>
            </ScrollArea>
          </DialogHeader>
          <DialogFooter className="border-t border-zinc-900 px-6 py-4 sm:items-center">
            <DialogClose asChild>
              <Button type="button" className="cursor-pointer">
                OK
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServerComponent;
