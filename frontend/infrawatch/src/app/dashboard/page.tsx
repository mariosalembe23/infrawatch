import { Button } from "@/components/ui/button";
import { Bolt, ClipboardClock, Info, Network, ZapIcon } from "lucide-react";
import React from "react";
import Image from "next/image";
import LateralBar from "./components/LateralBar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IContainerData {
  title: string;
  length: number;
}

const ContainerData: React.FC<IContainerData> = ({ title, length }) => {
  return (
    <div className="px-5 py-3 rounded-lg bg-zinc-950 border border-zinc-900">
      <div className="flex items-center gap-2">
        <p className="text-cyan-500 text-2xl font-semibold">{length} </p>
        <p className="text-white/70">/ {title}</p>
      </div>
    </div>
  );
};

interface IServerComponent {
  nameServer: string;
  status: "online" | "offline";
}

const ServerComponent: React.FC<IServerComponent> = ({
  nameServer,
  status,
}) => {
  return (
    <div
      className={` border border-zinc-900 px-5 py-3 bg-zinc-950 rounded-lg items-start flex justify-between`}
    >
      <div>
        <p className="text-white text-lg font-medium">
          {nameServer}{" "}
          <span className="text-zinc-500 font-[410] text-[15px]">
            / há 2 horas
          </span>
        </p>
        <div className=" gap-2 py-[0.19rem] -mt-1 flex items-center  text-white rounded-full">
          <p className="font-[420]">Status</p>
          <div
            className={`w-2 h-2 animate-pulse rounded-full ${
              status === "online"
                ? "bg-green-500 ring-2 ring-green-500/50"
                : "bg-red-500 ring-2 ring-red-500/50"
            }`}
          ></div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <button className="px-3 gap-2 border border-zinc-900 transition-all hover:bg-zinc-900 cursor-pointer py-[0.19rem] flex items-center bg-black text-white rounded-md">
            Logs <ClipboardClock size={16} />
          </button>
          <button className="px-3 gap-2 border border-zinc-900 transition-all hover:bg-zinc-900 cursor-pointer py-[0.19rem] flex items-center bg-black text-white rounded-md">
            Detalhes <Info size={17} />
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[15px] text-zinc-500 justify-end">
          <p>Processando...</p>
          <span className="loader !w-3 !h-3 !border-2 !border-b-zinc-600"></span>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="h-dvh w-full bg-[#060607] grid grid-cols-[15%_85%]">
      <LateralBar />
      <ScrollArea className="overflow-y-auto h-full">
        <header className="sticky bg-[#060607] top-0 left-0 w-full h-16 border-b border-zinc-900 flex items-center justify-between px-7">
          <div className="flex items-center gap-3">
            <h1 className="text-white text-xl">Infra Watch</h1>
            <p className="text-cyan-500">RCS ANGOLA</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-full bg-[#161616] border border-zinc-800 flex gap-3 items-center">
              <Image
                src={"/app/male.svg"}
                width={100}
                height={100}
                alt="User Avatar"
                className="rounded-full size-7"
              />
              <p className="pe-3 text-white">Mário Salembe</p>
            </div>
            <Button
              size={"icon"}
              className="rounded-full border border-zinc-800"
            >
              <Bolt size={18} className="text-white size-5" />
            </Button>
          </div>
        </header>
        <section className="p-14">
          <section>
            <header>
              <div>
                <h2 className="text-white text-4xl font-semibold">Dashboard</h2>
                <div className="w-[30rem]">
                  <p className="text-zinc-500 font-[410]">
                    Aqui você pode visualizar o estado geral da sua
                    infraestrutura e acessar informações detalhadas sobre os
                    seus servidores, serviços e redes.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-5 mt-10">
                <ContainerData title="Servidores Conectados" length={12} />
                <ContainerData title="Aparelhos Registados" length={8} />
                <ContainerData title="Endpoints Rodando" length={5} />
                <ContainerData title="Relatórios Prontos" length={3} />
              </div>
            </header>
            <div className="mt-10">
              <div>
                <header>
                  <h3 className="text-zinc-400 font-[410] text-lg">
                    Dados Recentes{" "}
                    <Badge className="text-[14px] leading-none py-1 px-2">
                      <ZapIcon
                        className="-ms-0.5 opacity-60"
                        size={12}
                        aria-hidden="true"
                      />
                      Servidores
                    </Badge>
                  </h3>
                </header>
                <div className="grid mt-4 grid-cols-3 gap-3">
                  <ServerComponent nameServer="SR1" status="online" />
                  <ServerComponent nameServer="SR2" status="offline" />
                  <ServerComponent nameServer="SR3" status="online" />
                  <ServerComponent nameServer="SR4" status="online" />
                  <ServerComponent nameServer="SR5" status="online" />
                  <ServerComponent nameServer="SR6" status="offline" />
                </div>
              </div>
            </div>
            <div className="mt-10">
              <div>
                <header>
                  <h3 className="text-zinc-400 font-[410] text-lg">
                    Dados Recentes{" "}
                    <Badge className="text-[14px] leading-none py-1 px-2">
                      <ZapIcon
                        className="-ms-0.5 opacity-60"
                        size={12}
                        aria-hidden="true"
                      />
                      Redes
                    </Badge>
                  </h3>
                </header>
                <div className="grid mt-4 pot:grid-cols-4 grid-cols-1 lal:grid-cols-5 gap-3">
                  <div className="relative border flex-col border-zinc-900 px-5 py-5 bg-zinc-950 rounded-lg items-start flex justify-between">
                    <span className="border-background absolute -end-4 text-[13px] -top-4 font-[490] text-white py-[0.20rem] rounded-full px-2 bg-green-600">
                      Operational
                    </span>
                    <header className="w-full">
                      <div className="flex items-center justify-between">
                        <Network size={16} className="text-zinc-500" />
                        <button className="px-3 gap-2 border border-zinc-900 transition-all hover:bg-zinc-900 cursor-pointer py-[0.19rem] flex items-center bg-black text-white rounded-md">
                          Logs <ClipboardClock size={16} />
                        </button>
                      </div>
                      <p className="text-zinc-200 pt-5">
                        Cisco Catalyst 2960X-48FPS-L
                      </p>
                      <p className="text-[15px] text-zinc-500">
                        15.2(7)E4 / Cisco Systems
                      </p>
                    </header>
                    <div className="border-t flex flex-wrap gap-3 w-full border-zinc-900 pt-2 mt-2">
                      <div className="gap-2 py-[0.19rem] flex items-center  text-white rounded-full">
                        <p className="font-[420]">Status</p>
                        <div
                          className={`w-2 h-2 animate-pulse rounded-full ${
                            "online" === "online"
                              ? "bg-green-500 ring-2 ring-green-500/50"
                              : "bg-red-500 ring-2 ring-red-500/50"
                          }`}
                        ></div>
                      </div>
                      <Badge className="text-[14px] bg-transparent border border-zinc-900 px-2 font-[430] leading-none">
                        Interfaces - 10 /{" "}
                        <span className="text-green-500">4</span> /{" "}
                        <span className="text-red-500">6</span>
                      </Badge>
                      <div className="flex w-full flex-col gap-3">
                        <div className="flex items-center w-full justify-between">
                          <p className="text-zinc-500 text-[15px]">
                            Uso de CPU
                          </p>
                          <p className="text-white">23%</p>
                        </div>
                        <div className="flex items-center w-full justify-between">
                          <p className="text-zinc-500 text-[15px]">
                            Temperatura
                          </p>
                          <p className="text-white">41C</p>
                        </div>
                      </div>
                      <footer className="w-full">
                        <Button className="w-full text-base cursor-pointer bg-white text-black hover:bg-white hover:opacity-80">
                          Detalhes <Info size={16} />
                        </Button>
                      </footer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </ScrollArea>
    </div>
  );
}
