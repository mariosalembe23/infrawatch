import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  ArrowRightLeft,
  ChevronDown,
  ChevronDownIcon,
  Cpu,
  EthernetPort,
  ListFilterPlus,
  MemoryStick,
  Microchip,
  Network,
  Radio,
  Settings2,
  Thermometer,
  Timer,
  Trash,
} from "lucide-react";
import React from "react";

const DataItem: React.FC<{
  headerChildren: React.ReactNode;
  footerChildren: React.ReactNode;
}> = ({ headerChildren, footerChildren }) => {
  return (
    <div className="p-4 flex items-start justify-between flex-col rounded-2xl bg-white dark:bg-[#060607] border dark:border-zinc-900/40 h-36 ret:h-52">
      <header>{headerChildren}</header>
      <footer>{footerChildren}</footer>
    </div>
  );
};

const GradeGraph: React.FC<{
  height: string;
  week: string;
  content?: string;
}> = ({ height, week, content }) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center p-1 h-full justify-end gap-3">
            <div
              style={{
                height: height,
              }}
              className="bg-gradient-to-t from-transparent dark:to-cyan-400/80 to-cyan-500 w-10  border-cyan-100/30 rounded-t-2xl "
            ></div>
            <p className="dark:text-zinc-300 text-[15px]">{week}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">
          {content} - {height} de Utilização
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface GraphProps {
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}

const Graph: React.FC<GraphProps> = ({ setSelectedItem }) => {
  return (
    <section className="relative h-full">
      <header>
        <div className="flex items-center gap-5 flex-wrap justify-between mb-12">
          <div className="relative flex flex-col items-start">
            <Button
              onClick={() => setSelectedItem("")}
              size={"icon"}
              className="rounded-full mb-5 cursor-pointer hover:bg-gray-200 bg-gray-50 shadow-none border dark:bg-zinc-900 dark:hover:bg-zinc-950 dark:border-zinc-800"
            >
              <ArrowLeft
                size={18}
                className="dark:text-white text-black size-5"
              />
            </Button>
            <div className="relative inline-flex">
              <h2 className="dark:text-white ret:text-4xl text-2xl font-medium pot:font-semibold">
                SR1
              </h2>
              <span className="border-background absolute -end-4 -top-0 size-3 rounded-full border-2 bg-cyan-500">
                <span className="sr-only">Online</span>
              </span>
            </div>
            <div>
              <p>Linux Ubuntu 20.04 LTS</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size={"icon"}
              className="rounded-full cursor-pointer hover:bg-gray-200 bg-gray-50 shadow-none border dark:bg-zinc-900 dark:hover:bg-zinc-950 dark:border-zinc-800"
            >
              <Settings2
                size={18}
                className="dark:text-white text-black size-5"
              />
            </Button>
            <Button
              size={"icon"}
              className="rounded-full hover:bg-gray-200 cursor-pointer bg-gray-50 shadow-none border dark:bg-red-500/40 dark:hover:bg-red-500/50 dark:border-red-500/40"
            >
              <Trash size={18} className="dark:text-white text-black size-5" />
            </Button>
          </div>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 gap-5">
          <div className="dark:bg-zinc-950 bg-[#f5f5f5] p-1 grid gap-1 pot:grid-cols-4 ret:grid-cols-3 grid-cols-1 lal:grid-cols-8 border dark:border-zinc-900/40 rounded-2xl">
            <DataItem
              headerChildren={
                <div className="flex flex-col items-start">
                  <Cpu size={18} className="dark:text-cyan-500 size-6 mb-3" />
                </div>
              }
              footerChildren={
                <div>
                  <p className="dark:text-zinc-500 text-zinc-600 uppercase text-[14px]">
                    Uso de CPU
                  </p>
                  <p className="text-xl font-medium">40.3%</p>
                  <Badge variant="outline" className="gap-1.5 border-cyan-600">
                    <span
                      className="size-1.5 rounded-full bg-cyan-500"
                      aria-hidden="true"
                    ></span>
                    Estável
                  </Badge>
                </div>
              }
            />

            <DataItem
              headerChildren={
                <div className="flex flex-col items-start">
                  <Radio size={18} className="dark:text-cyan-500 size-6 mb-3" />
                </div>
              }
              footerChildren={
                <div>
                  <p className="dark:text-zinc-500 text-zinc-600 uppercase text-[14px]">
                    Frequência CPU
                  </p>
                  <p className="text-xl font-medium">3.4 GHz</p>
                  <Badge variant="outline" className="gap-1.5 border-cyan-600">
                    <span
                      className="size-1.5 rounded-full bg-cyan-500"
                      aria-hidden="true"
                    ></span>
                    Estável
                  </Badge>
                </div>
              }
            />

            <DataItem
              headerChildren={
                <div className="flex flex-col items-start">
                  <MemoryStick
                    size={18}
                    className="dark:text-cyan-500 size-6 mb-3"
                  />
                </div>
              }
              footerChildren={
                <div>
                  <p className="text-zinc-500 uppercase text-[14px]">
                    RAM / Usada
                  </p>
                  <p className="text-xl font-medium">100 GB</p>
                  <p className="dark:text-cyan-500 text-cyan-600 text-[14px] uppercase">
                    Total de 256 GB
                  </p>
                </div>
              }
            />

            <DataItem
              headerChildren={
                <div className="flex flex-col items-start">
                  <EthernetPort
                    size={18}
                    className="dark:text-cyan-500 size-6 mb-3"
                  />
                </div>
              }
              footerChildren={
                <div>
                  <p className="dark:text-zinc-500 text-zinc-600 uppercase text-[14px]">
                    Interfaces de Rede
                  </p>
                  <p className="text-xl font-medium">20</p>
                  <p className="dark:text-cyan-500 text-cyan-600 text-[14px]">
                    12 Ativas / 8 Inativas
                  </p>
                </div>
              }
            />

            <DataItem
              headerChildren={
                <div className="flex flex-col items-start">
                  <Thermometer
                    size={18}
                    className="dark:text-cyan-500 size-6 mb-3"
                  />
                </div>
              }
              footerChildren={
                <div>
                  <p className="dark:text-zinc-500 text-zinc-600 uppercase text-[14px]">
                    Temperatura
                  </p>
                  <p className="text-xl font-medium">65°C</p>
                  <Badge variant="outline" className="gap-1.5 border-cyan-600">
                    <span
                      className="size-1.5 rounded-full bg-cyan-500"
                      aria-hidden="true"
                    ></span>
                    Estável
                  </Badge>
                </div>
              }
            />

            <DataItem
              headerChildren={
                <div className="flex flex-col items-start">
                  <ArrowRightLeft
                    size={18}
                    className="dark:text-cyan-500 size-6 mb-3"
                  />
                </div>
              }
              footerChildren={
                <div>
                  <p className="dark:text-zinc-500 text-zinc-600 uppercase text-[14px]">
                    SWAP
                  </p>
                  <p className="text-xl font-medium">32 GB</p>
                  <p className="dark:text-cyan-500 text-cyan-600 text-[14px] uppercase">
                    Total de 100 GB
                  </p>
                </div>
              }
            />

            <DataItem
              headerChildren={
                <div className="flex flex-col items-start">
                  <Network
                    size={18}
                    className="dark:text-cyan-500 size-6 mb-3"
                  />
                </div>
              }
              footerChildren={
                <div>
                  <p className="dark:text-zinc-500 text-zinc-600 uppercase text-[14px]">
                    Tráfego de Rede
                  </p>
                  <p className="text-base pt-2 flex items-start flex-col leading-none font-medium">
                    120 Mbps{" "}
                    <span className="text-sm text-cyan-600 dark:text-cyan-500">
                      Enviados
                    </span>
                  </p>
                  <p className="text-base pt-2 flex items-start flex-col leading-none font-medium">
                    80 Mbps{" "}
                    <span className="text-sm text-cyan-600 dark:text-cyan-500">
                      Recebidos
                    </span>
                  </p>
                </div>
              }
            />

            <DataItem
              headerChildren={
                <div className="flex flex-col items-start">
                  <Microchip
                    size={18}
                    className="dark:text-cyan-500 size-6 mb-3"
                  />
                </div>
              }
              footerChildren={
                <div>
                  <p className="dark:text-zinc-500 text-zinc-600 uppercase text-[14px]">
                    Núcleos
                  </p>
                  <p className="text-base pt-2 flex items-start flex-col leading-none font-medium">
                    16
                    <span className="text-sm text-cyan-600 dark:text-cyan-500">
                      Físicos
                    </span>
                  </p>
                  <p className="text-base pt-2 flex items-start flex-col leading-none font-medium">
                    32
                    <span className="text-sm text-cyan-600 dark:text-cyan-500">
                      Lógicos
                    </span>
                  </p>
                </div>
              }
            />
          </div>
          <div className="grid pot:grid-cols-2 lal:grid-cols-3 gap-3">
            <div className="dark:bg-zinc-950 flex flex-col justify-between p-5 h-96 border dark:border-zinc-900/40 rounded-2xl">
              <header className="border-b dark:border-b-zinc-900/40 pb-2 flex items-center justify-between">
                <div>
                  <h2 className="text-lg dark:text-cyan-500 uppercase font-medium">
                    USO de CPU
                  </h2>
                  <p className="dark:text-zinc-300 text-zinc-600 text-[15px]">
                    Estatísticas & Gráficos
                  </p>
                </div>
                <div>
                  <Button className="cursor-pointer rounded-full hover:bg-gray-100 bg-gray-50 dark:bg-[#060607] border dark:border-zinc-900/50 text-black dark:text-white dark:hover:bg-zinc-950 shadow-none">
                    Janeiro
                    <ChevronDownIcon
                      className="-me-1 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                  </Button>
                </div>
              </header>

              <div className="grid grid-cols-4 h-full gap-5">
                <GradeGraph height="70%" week="S1" content="Primeira Semana" />
                <GradeGraph height="50%" week="S2" content="Segunda Semana" />
                <GradeGraph height="80%" week="S3" content="Terceira Semana" />
                <GradeGraph height="30%" week="S4" content="Quarta Semana" />
              </div>
            </div>
            <div className="dark:bg-zinc-950 bg-[#fff] lal:col-span-2 flex flex-col justify-between px-5 pt-5 pot:h-96 h-[28rem] border dark:border-zinc-900/40 rounded-2xl">
              <header className="border-b dark:border-b-zinc-900/40 pb-2 flex items-center justify-between">
                <div>
                  <p className="text-[15px] flex items-center ">
                    <Timer
                      size={14}
                      className="dark:text-cyan-100 text-zinc-500 size-5 me-2"
                    />
                    Uptime - 34 dias, 4:23 min
                  </p>
                </div>
                <div>
                  <Button className="cursor-pointer rounded-full bg-gray-50 text-black dark:bg-[#060607] border dark:border-zinc-900/50 dark:text-white dark:hover:bg-zinc-950 shadow-none">
                    <ListFilterPlus
                      className="-me-1 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Filtro
                    <ChevronDownIcon
                      className="-me-1 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                  </Button>
                </div>
              </header>
              <div
                className="grid scrollable h-full gap-1
              overflow-y-auto grid-cols-1 lal:grid-cols-2 items-start pb-5 mt-5"
              >
                {Array.from({ length: 20 }, (_, index) => (
                  <LogComponent key={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const LogComponent = () => {
  return (
    <div className="py-3 ps-5 pe-3 flex items-center justify-between rounded-lg dark:bg-[#060607] border dark:border-zinc-900/40">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 justify-start pot:justify-end">
          <p className="dark:text-white">Status</p>
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-sky-500"></span>
          </span>
        </div>
        <div className="">
          <p className="text-zinc-500">
            /{" "}
            <span className="dark:text-white text-black ps-2 text-[15px]">
              20% CPU
            </span>
          </p>
        </div>
        <div>
          <p className="text-zinc-500">
            /{" "}
            <span className="dark:text-white text-black  ps-2 text-[15px]">
              40% RAM
            </span>
          </p>
        </div>
      </div>
      <div>
        <Button
          size={"icon"}
          className="cursor-pointer rounded-full bg-transparent hover:bg-gray-100 dark:bg-[#060607] border border-transparent text-zinc-800 dark:text-white dark:hover:bg-zinc-950 shadow-none"
        >
          <ChevronDown className="opacity-90" size={16} aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};

export default Graph;