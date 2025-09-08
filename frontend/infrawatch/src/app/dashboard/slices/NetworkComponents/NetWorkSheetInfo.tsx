import { removeDoubleSlashes } from "@/components/AppComponents/API";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ChevronDownIcon, ToggleLeft } from "lucide-react";
import React from "react";
import Graph1 from "../EndpointComponents/Graph1";
import { Device } from "../Types/Network";
import SpaceGraph from "../EndpointComponents/Graph2";

interface INetWorkSheetInfo {
  device: Device;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NetWorkSheet: React.FC<INetWorkSheetInfo> = ({
  device,
  open,
  setOpen,
}) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className=" h-[100vh]">
        <SheetHeader className="border-b ">
          <div className="max-w-[95rem] w-full mx-auto">
            <SheetTitle className="font-medium">
              Endpoint - {device.device_name}
            </SheetTitle>
            <SheetDescription className="-mt-1">
              {device.description || "Descrição"}
            </SheetDescription>
          </div>
        </SheetHeader>
        <ScrollArea className="h-full px-5 overflow-y-auto">
          <div className="pt-16 max-w-[95rem] gap-16 w-full mx-auto items-start grid grid-cols-1 pot:grid-cols-2">
            <header>
              <div>
                <h4 className="text-2xl font-semibold">Informações</h4>
              </div>
              <div className="flex pot:px-0 px-8 flex-wrap max-w-7xl mx-auto w-full mt-10 items-center justify-between">
                <Button
                  variant={"outline"}
                  className="dark:border-zinc-900/50 dark:hover:bg-zinc-900/30"
                >
                  Editar
                </Button>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant={"outline"}
                    className="dark:border-zinc-900/50 dark:hover:bg-zinc-900/30"
                  >
                    <ToggleLeft
                      size={16}
                      className="opacity-60"
                      aria-hidden="true"
                    />
                    Desativar monitoramento
                  </Button>
                  <Button className="py-4 bg-red-600/40 border border-red-700 hover:bg-red-600/50 cursor-pointer text-red-800 dark:text-white">
                    Deletar
                  </Button>
                </div>
              </div>
              <div className="grid  mt-10 grid-cols-1 gap-7">
                <div className="flex items-center justify-between">
                  <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                    Identificador(nome)
                  </p>
                  <p className="dark:text-white text-[15px] text-black">
                    {device.device_name || "Sem nome"}
                  </p>
                </div>
                <div className="flex max-w-1/2  w-full items-start flex-col">
                  <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                    Descrição
                  </p>
                  <p className="dark:text-white text-[15px] text-black">
                    {device.description || "Sem nome"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                    Tipo de despositivo
                  </p>
                  <p className="dark:text-white text-[15px] text-black">
                    {device.device_type || "Sem nome"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                    Sistema
                  </p>
                  <p className="dark:text-white text-[15px] text-black">
                    {device.sys_name || "Sem nome"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                    Host(SNMP)
                  </p>
                  <p className="dark:text-white text-[15px] text-black">
                    {device.last_device.host || "Sem nome"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                    Processo de monitoramento
                  </p>
                  <p className="dark:text-white text-[15px] text-black">
                    <Checkbox id={"monitoramento"} checked={device.toggle} />
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                    Registrado em
                  </p>
                  <p className="dark:text-white text-[15px] text-black">
                    {new Date(device.created_at).toLocaleDateString("pt-BR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    }) || "Sem nome"}{" "}
                    <span className="text-zinc-500">({device.username})</span>
                  </p>
                </div>
                <footer className="mt-5 pt-7 border-t dark:border-zinc-900">
                  <div>
                    <h4 className="text-xl font-semibold">
                      Últimas Atualizações
                    </h4>
                  </div>
                </footer>
                <div className="flex items-center justify-between">
                  <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                    Interfaces
                  </p>
                  <p className="dark:text-white text-[15px] text-black">
                    {device.interfaces.length}
                  </p>
                </div>{" "}
                <div className="flex items-center justify-between">
                  <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                    Uptime
                  </p>
                  <p className="dark:text-white text-[15px] text-black">
                    {removeDoubleSlashes(device.last_device.uptime) || "Down"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                    Uso de CPU
                  </p>
                  <p className="dark:text-white text-[15px] text-black">
                    {device.last_device.cpu}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                    Memória
                  </p>
                  <p className="dark:text-white text-[15px] text-black">
                    {device.last_device.memory}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                    Status
                  </p>
                  <div
                    className={`w-2 h-2 animate-pulse rounded-full ${
                      status === "UP"
                        ? "bg-green-500 ring-2 ring-green-500/50"
                        : "bg-red-500 ring-2 ring-red-500/50"
                    }`}
                  ></div>
                </div>
                {device.device_type === "SWITCH" && (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                        VLANS
                      </p>
                      <p className="dark:text-white text-[15px] text-black">
                        {device.last_device.switch_vlans || "Down"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                        Tabela MAC
                      </p>
                      <p className="dark:text-white text-[15px] text-black">
                        {device.last_device.switch_macTableSize || "Down"}
                      </p>
                    </div>
                  </>
                )}
                {device.device_type === "ROUTER" && (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                        Rotas
                      </p>
                      <p className="dark:text-white text-[15px] text-black">
                        {device.last_device.router_routes || "Down"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                        BGP Peers
                      </p>
                      <p className="dark:text-white text-[15px] text-black">
                        {device.last_device.router_bgpPeers || "Down"}
                      </p>
                    </div>
                  </>
                )}
                {device.device_type === "FIREWALL" && (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                        Sessões Ativas
                      </p>
                      <p className="dark:text-white text-[15px] text-black">
                        {device.last_device.firewall_sessions || "Down"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                        Rendimento (Mbps)
                      </p>
                      <p className="dark:text-white text-[15px] text-black">
                        {device.last_device.firewall_throughput || "Down"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                        Túnel(s) VPN Ativo(s)
                      </p>
                      <p className="dark:text-white text-[15px] text-black">
                        {device.last_device.firewall_vpn_activeTunnels ||
                          "Down"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                        Status VPN
                      </p>
                      <p className="dark:text-white text-[15px] text-black">
                        {device.last_device.firewall_vpn_status || "Down"}
                      </p>
                    </div>
                  </>
                )}
                {device.device_type === "PRINTER" && (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                        Páginas Impressas
                      </p>
                      <p className="dark:text-white text-[15px] text-black">
                        {device.last_device.printer_pagesPrinted || "Down"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                        Quant. de Papel
                      </p>
                      <p className="dark:text-white text-[15px] text-black">
                        {device.last_device.printer_paper || "Down"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="dark:text-zinc-500 text-zinc-700 text-[15px]">
                        Toner
                      </p>
                      <p className="dark:text-white text-[15px] text-black">
                        {device.last_device.printer_toner || "Down"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </header>
            <section className="grid grid-cols-1">
              <div>
                <h4 className="text-2xl font-semibold">
                  Gráficos & Estatísticas
                </h4>
              </div>

              <div className="mt-16 max-w-7xl w-full mx-auto pot:px-0 px-5 pb-10 grid grid-cols-1  gap-2">
                <div className="h-[28rem] p-5 bg-[#f5f5f5] dark:bg-zinc-950/50 dark:border-zinc-900/50 border rounded-2xl flex flex-col items-center justify-between">
                  <header className="border-b mb-10 w-full mx-auto dark:border-b-zinc-900/40 pb-2 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg dark:text-cyan-500 ">
                        Velocidade de Resposta
                      </h2>
                      <p className="dark:text-zinc-300 text-zinc-600 text-[15px]">
                        Estatísticas & Gráficos
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <Button className="cursor-pointer rounded-lg hover:bg-gray-100 bg-gray-50 dark:bg-[#060607] border dark:border-zinc-900/50 text-black dark:text-white dark:hover:bg-zinc-950 shadow-none">
                        Janeiro
                        <ChevronDownIcon
                          className="-me-1 opacity-60"
                          size={16}
                          aria-hidden="true"
                        />
                      </Button>
                    </div>
                  </header>
                  <div className="h-full w-full">
                    <Graph1 />
                  </div>
                </div>
                <div className="h-[28rem] p-5 bg-[#f5f5f5] dark:bg-zinc-950/50 dark:border-zinc-900/50 border rounded-2xl flex flex-col items-center justify-between">
                  <header className="border-b mb-10 w-full mx-auto dark:border-b-zinc-900/40 pb-2 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg dark:text-cyan-500 ">
                        Respostas por Status
                      </h2>
                      <p className="dark:text-zinc-300 text-zinc-600 text-[15px]">
                        Estatísticas & Gráficos
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <Button className="cursor-pointer rounded-lg hover:bg-gray-100 bg-gray-50 dark:bg-[#060607] border dark:border-zinc-900/50 text-black dark:text-white dark:hover:bg-zinc-950 shadow-none">
                        Janeiro
                        <ChevronDownIcon
                          className="-me-1 opacity-60"
                          size={16}
                          aria-hidden="true"
                        />
                      </Button>
                    </div>
                  </header>
                  <div className="h-full w-full">
                    <SpaceGraph />
                  </div>
                  <footer className="flex py-5 items-center justify-center gap-4 flex-wrap">
                    <p className=" flex text-[14px] items-center gap-2">
                      400 - 499{" "}
                      <span className="inline-flex w-2 rounded-full h-2 bg-[#ffc658]"></span>
                    </p>
                    <p className=" flex text-[15px] items-center gap-2">
                      200 - 299{" "}
                      <span className="inline-flex w-2 rounded-full h-2 bg-[#82ca9d]"></span>
                    </p>
                    <p className=" flex text-[15px] items-center gap-2">
                      500 - 541{" "}
                      <span className="inline-flex w-2 rounded-full h-2 bg-[#d85c53]"></span>
                    </p>
                  </footer>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NetWorkSheet;
