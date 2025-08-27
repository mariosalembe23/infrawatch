import { Button } from "@/components/ui/button";
import React from "react";
import ServerComponent from "../components/ServerComponent";
import {
  ArrowRightLeft,
  Cpu,
  EthernetPort,
  MemoryStick,
  Microchip,
  Network,
  Plus,
  Radio,
  Server,
  Settings2,
  Thermometer,
  Trash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface IServerSlice {
  showSideBar: boolean;
}

const DataItem: React.FC<{
  headerChildren: React.ReactNode;
  footerChildren: React.ReactNode;
}> = ({ headerChildren, footerChildren }) => {
  return (
    <div className="p-4 flex items-start justify-between flex-col rounded-2xl bg-[#060607] border border-zinc-900/40 h-52">
      <header>{headerChildren}</header>
      <footer>{footerChildren}</footer>
    </div>
  );
};

const ServerSlice: React.FC<IServerSlice> = ({}) => {
  const [selectedItem, setSelectedItem] = React.useState<string>("");

  return selectedItem ? (
    <section className="relative h-full">
      <header>
        <div className="flex items-start gap-5 flex-wrap justify-between mb-12">
          <div className="relative">
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
          <div className="bg-zinc-950 p-1 grid gap-1 pot:grid-cols-4 ret:grid-cols-3 grid-cols-1 lal:grid-cols-8 border border-zinc-900/40 rounded-2xl">
            <DataItem
              headerChildren={
                <div className="flex flex-col items-start">
                  <Cpu size={18} className="text-cyan-500 size-6 mb-3" />
                </div>
              }
              footerChildren={
                <div>
                  <p className="text-zinc-500 uppercase text-[14px]">
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
                  <Radio size={18} className="text-cyan-500 size-6 mb-3" />
                </div>
              }
              footerChildren={
                <div>
                  <p className="text-zinc-500 uppercase text-[14px]">
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
                    className="text-cyan-500 size-6 mb-3"
                  />
                </div>
              }
              footerChildren={
                <div>
                  <p className="text-zinc-500 uppercase text-[14px]">
                    RAM / Usada
                  </p>
                  <p className="text-xl font-medium">100 GB</p>
                  <p className="text-cyan-500 text-[14px] uppercase">
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
                    className="text-cyan-500 size-6 mb-3"
                  />
                </div>
              }
              footerChildren={
                <div>
                  <p className="text-zinc-500 uppercase text-[14px]">
                    Interfaces de Rede
                  </p>
                  <p className="text-xl font-medium">20</p>
                  <p className="text-cyan-500 text-[14px]">
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
                    className="text-cyan-500 size-6 mb-3"
                  />
                </div>
              }
              footerChildren={
                <div>
                  <p className="text-zinc-500 uppercase text-[14px]">
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
                    className="text-cyan-500 size-6 mb-3"
                  />
                </div>
              }
              footerChildren={
                <div>
                  <p className="text-zinc-500 uppercase text-[14px]">SWAP</p>
                  <p className="text-xl font-medium">32 GB</p>
                  <p className="text-cyan-500 text-[14px] uppercase">
                    Total de 100 GB
                  </p>
                </div>
              }
            />

            <DataItem
              headerChildren={
                <div className="flex flex-col items-start">
                  <Network size={18} className="text-cyan-500 size-6 mb-3" />
                </div>
              }
              footerChildren={
                <div>
                  <p className="text-zinc-500 uppercase text-[14px]">
                    Tráfego de Rede
                  </p>
                  <p className="text-base pt-2 flex items-start flex-col leading-none font-medium">
                    120 Mbps{" "}
                    <span className="text-sm text-cyan-500">Enviados</span>
                  </p>
                  <p className="text-base pt-2 flex items-start flex-col leading-none font-medium">
                    80 Mbps{" "}
                    <span className="text-sm text-cyan-500">Recebidos</span>
                  </p>
                </div>
              }
            />

            <DataItem
              headerChildren={
                <div className="flex flex-col items-start">
                  <Microchip size={18} className="text-cyan-500 size-6 mb-3" />
                </div>
              }
              footerChildren={
                <div>
                  <p className="text-zinc-500 uppercase text-[14px]">Núcleos</p>
                  <p className="text-base pt-2 flex items-start flex-col leading-none font-medium">
                    16
                    <span className="text-sm text-cyan-500">Físicos</span>
                  </p>
                  <p className="text-base pt-2 flex items-start flex-col leading-none font-medium">
                    32
                    <span className="text-sm text-cyan-500">Lógicos</span>
                  </p>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </section>
  ) : (
    <section className="relative h-full">
      <header>
        <div className="flex items-start gap-5 flex-wrap justify-between mb-12">
          <div>
            <h2 className="dark:text-white ret:text-4xl text-2xl font-medium pot:font-semibold">
              Servidores
            </h2>
            <div className="w-full ret:w-[30rem]">
              <p className="dark:text-zinc-500 text-zinc-700 font-[410]">
                Aqui você pode gerenciar e monitorar todos os seus servidores,
                visualizar o status, logs e detalhes de cada um deles.
              </p>
            </div>
          </div>
          <div>
            <Button className="cursor-pointer dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-950 shadow-none">
              <Server size={14} className="text-white size-4" />
              Adicionar Servidor
            </Button>
          </div>
        </div>
      </header>
      <div className="grid grid-cols-1 pot:grid-cols-2 gap-4">
        <div className={`grid mt-4 grid-cols-1`}>
          {Array.from({ length: 30 }, (_, index) => (
            <ServerComponent
              key={index}
              setSelectedItem={setSelectedItem}
              index={index + 1}
              lastIndex={30}
              nameServer={`SR ${index + 1}`}
              status={index % 2 === 0 ? "online" : "offline"}
            />
          ))}
        </div>
        <div className={`grid mt-4 grid-cols-1`}>
          {Array.from({ length: 30 }, (_, index) => (
            <ServerComponent
              key={index}
              setSelectedItem={setSelectedItem}
              index={index + 1}
              lastIndex={30}
              nameServer={`SR ${index + 1}`}
              status={index % 2 === 0 ? "online" : "offline"}
            />
          ))}
        </div>
      </div>

      <div className="fixed bottom-5 pot:bottom-10 end-7 pot:end-12">
        <Button
          size={"icon"}
          className="rounded-full cursor-pointer size-9 hover:bg-white hover:opacity-80 bg-white text-black"
        >
          <Plus size={18} className="text-black size-5" />
        </Button>
      </div>
    </section>
  );
};

export default ServerSlice;
