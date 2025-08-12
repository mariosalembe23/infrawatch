import { Button } from "@/components/ui/button";
import { Bolt, ClipboardClock, Info } from "lucide-react";
import React from "react";
import Image from "next/image";
import LateralBar from "./components/LateralBar";

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
          <button className="px-3 gap-2 border border-zinc-900 transition-all hover:bg-zinc-900 cursor-pointer py-[0.19rem] flex items-center bg-black text-white rounded-full">
            Logs <ClipboardClock size={16} />
          </button>
          <button className="px-3 gap-2 border border-zinc-900 transition-all hover:bg-zinc-900 cursor-pointer py-[0.19rem] flex items-center bg-black text-white rounded-full">
            Detalhes <Info size={17} />
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2 text-zinc-500 justify-end">
          <p>Processando...</p>
          <span className="loader !w-4 !h-4 !border-2 !border-b-zinc-600"></span>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="h-dvh w-full bg-[#060607] grid grid-cols-[15%_85%]">
      <LateralBar />
      <main>
        <header className="sticky top-0 left-0 w-full h-16 border-b border-zinc-900 flex items-center justify-between px-7">
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
                    Dados Recentes
                  </h3>
                </header>
                <div className="grid mt-4 grid-cols-3 gap-3">
                  <ServerComponent nameServer="SR1" status="online" />
                  <ServerComponent nameServer="SR2" status="offline" />
                  <ServerComponent nameServer="SR3" status="online" />
                  <ServerComponent nameServer="SR4" status="online" />
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
