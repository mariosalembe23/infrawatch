import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BoltIcon,
  ChevronDownIcon,
  ChevronRight,
  ClipboardClock,
  CopyPlusIcon,
  FilesIcon,
  Info,
  Layers2Icon,
  LayoutDashboard,
  Link2,
  Network,
  Server,
  ZapIcon,
} from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface INetworkComponent {
  name: string;
  status: "operational" | "maintenance" | "offline";
  firmware: string;
  manufacturer: string;
  totalInterfaces: number;
  activeInterfaces: number;
  downInterfaces: number;
  cpuUsage: number;
  temperature: number;
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
}) => {
  return (
    <div className="relative border flex-col border-zinc-900 px-5 py-5 bg-zinc-950 rounded-lg items-start flex justify-between">
      <span
        className={`border-background capitalize absolute -end-4 text-[13px] -top-4 font-[490] text-white py-[0.20rem] rounded-full px-2 ${
          status === "operational"
            ? "bg-green-600"
            : status === "maintenance"
            ? "bg-orange-600"
            : "bg-red-600"
        } `}
      >
        {status}
      </span>
      <header className="w-full">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2">
            <Network size={16} className="text-zinc-500" />
          </p>
          <div className="flex items-center gap-2">
            <span className="loader !w-3 !h-3 !border-2 !border-b-zinc-600"></span>
            <button className="px-3 gap-2 border border-zinc-900 transition-all hover:bg-zinc-900 cursor-pointer py-[0.19rem] flex items-center bg-black text-white rounded-md">
              Logs <ClipboardClock size={16} />
            </button>
          </div>
        </div>
        <p className="text-zinc-200 pt-5">{name}</p>
        <p className="text-[15px] text-zinc-500">
          {firmware} / {manufacturer}
        </p>
      </header>
      <div className="border-t flex flex-wrap gap-3 w-full border-zinc-900 pt-2 mt-2">
        <div className="gap-2 py-[0.19rem] flex items-center  text-white rounded-full">
          <p className="font-[420]">Status</p>
          <div
            className={`w-2 h-2 animate-pulse rounded-full ${
              status === "operational"
                ? "bg-green-500 ring-2 ring-green-500/50"
                : status === "maintenance"
                ? "bg-orange-500 ring-2 ring-orange-500/50"
                : "bg-red-500 ring-2 ring-red-500/50"
            }`}
          ></div>
        </div>
        <Badge className="text-[14px] bg-transparent border border-zinc-900 px-2 font-[430] leading-none">
          Interfaces - {totalInterfaces} /{" "}
          <span className="text-green-500">{activeInterfaces}</span> /{" "}
          <span className="text-red-500">{downInterfaces}</span>
        </Badge>
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center w-full justify-between">
            <p className="text-zinc-500 text-[15px]">Uso de CPU</p>
            <p className="text-white">{cpuUsage}%</p>
          </div>
          <div className="flex items-center w-full justify-between">
            <p className="text-zinc-500 text-[15px]">Temperatura</p>
            <p className="text-white">{temperature}C</p>
          </div>
          <div className="flex items-center w-full justify-between">
            <p className="text-zinc-500 text-[15px]">Última atualização</p>
            <p className="text-white">2 min</p>
          </div>
        </div>
        <footer className="w-full">
          <Button className="w-full text-base cursor-pointer bg-white text-black hover:bg-white hover:opacity-80">
            Detalhes <Info size={16} />
          </Button>
        </footer>
      </div>
    </div>
  );
};

interface IEndpointComponent {
  url: string;
  responseTime: string;
  httpStatus: 200 | 401 | 500;
  status: "recheable" | "unreachable";
}

const EndpointComponent: React.FC<IEndpointComponent> = ({
  url,
  responseTime,
  httpStatus,
  status,
}) => {
  return (
    <div className="border py-3 px-5 flex flex-col border-zinc-900">
      <div>
        <p className="text-white">{url}</p>
        <div className="flex items-center mt-1 gap-1 flex-wrap">
          <p className="px-2 text-white text-[14px] bg-zinc-900  font-medium rounded leading-none py-1">
            Tempo de resposta{" "}
            <span className="text-cyan-500">{responseTime}s</span>
          </p>
          <p
            className={`px-2 text-white text-[14px] ${
              httpStatus === 200
                ? "bg-green-600"
                : httpStatus === 401
                ? "bg-yellow-600"
                : "bg-red-600"
            }  font-medium rounded leading-none py-1`}
          >
            HTTP <span>{httpStatus}</span>
          </p>
          <p className="px-2 uppercase text-white text-[14px] bg-green-600  font-medium rounded leading-none py-1">
            {status}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between mt-5">
        <div className="flex items-center gap-2">
          <button className="px-3 gap-2 border border-zinc-900 transition-all hover:bg-zinc-900 cursor-pointer py-[0.19rem] flex items-center bg-black text-white rounded-md">
            Logs <ClipboardClock size={16} />
          </button>
          <button className="px-3 gap-2 border border-zinc-900 transition-all hover:bg-zinc-900 cursor-pointer py-[0.19rem] flex items-center bg-black text-white rounded-md">
            Detalhes <Info size={17} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-zinc-500 text-[15px]">há 3 min</p>
          <span className="loader !w-3 !h-3 !border-2 !border-b-zinc-600"></span>
        </div>
      </div>
    </div>
  );
};

const DashboardSlice = () => {
  return (
    <section>
      <header>
        <div className="flex items-start justify-between mb-10">
          <div>
            <h2 className="text-white text-4xl font-semibold">Dashboard</h2>
            <div className="w-[30rem]">
              <p className="text-zinc-500 font-[410]">
                Aqui você pode visualizar o estado geral da sua infraestrutura e
                acessar informações detalhadas sobre os seus servidores,
                serviços e redes.
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="cursor-pointer">
                Adicionar
                <ChevronDownIcon
                  className="-me-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="cursor-pointer">
                <Server size={16} className="opacity-60" aria-hidden="true" />
                Servidor
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Network size={16} className="opacity-60" aria-hidden="true" />
                Aparelh. de Rede
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Link2 size={16} className="opacity-60" aria-hidden="true" />
                Endpoint
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          <header className="flex items-center justify-between">
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
            <Button className="cursor-pointer">
              Todos dados <ChevronRight size={16} className="text-zinc-400" />
            </Button>
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
          <header className="flex items-center justify-between">
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
            <Button className="cursor-pointer">
              Todos dados <ChevronRight size={16} className="text-zinc-400" />
            </Button>
          </header>
          <div className="grid mt-7 pot:grid-cols-4 grid-cols-1 lal:grid-cols-5 gap-3">
            <NetworkComponent
              name="SW-CORE-01"
              status="operational"
              firmware="15.2(7)E4"
              manufacturer="Cisco Systems"
              totalInterfaces={10}
              activeInterfaces={4}
              downInterfaces={6}
              cpuUsage={23}
              temperature={41}
            />
            <NetworkComponent
              name="SW-CORE-02"
              status="maintenance"
              firmware="15.2(7)E4"
              manufacturer="Cisco Systems"
              totalInterfaces={10}
              activeInterfaces={6}
              downInterfaces={4}
              cpuUsage={18}
              temperature={39}
            />
            <NetworkComponent
              name="SW-CORE-03"
              status="operational"
              firmware="15.2(7)E4"
              manufacturer="Cisco Systems"
              totalInterfaces={10}
              activeInterfaces={8}
              downInterfaces={2}
              cpuUsage={12}
              temperature={36}
            />
            <NetworkComponent
              name="SW-CORE-04"
              status="offline"
              firmware="15.2(7)E4"
              manufacturer="Cisco Systems"
              totalInterfaces={10}
              activeInterfaces={0}
              downInterfaces={10}
              cpuUsage={0}
              temperature={0}
            />
            <NetworkComponent
              name="SW-CORE-05"
              status="operational"
              firmware="15.2(7)E4"
              manufacturer="Cisco Systems"
              totalInterfaces={10}
              activeInterfaces={5}
              downInterfaces={5}
              cpuUsage={20}
              temperature={38}
            />
          </div>
        </div>
      </div>
      <div className="mt-10">
        <div>
          <header className="flex items-center justify-between">
            <h3 className="text-zinc-400 font-[410] text-lg">
              Dados Recentes{" "}
              <Badge className="text-[14px] leading-none py-1 px-2">
                <ZapIcon
                  className="-ms-0.5 opacity-60"
                  size={12}
                  aria-hidden="true"
                />
                Endpoints
              </Badge>
            </h3>
            <Button className="cursor-pointer">
              Todos dados <ChevronRight size={16} className="text-zinc-400" />
            </Button>
          </header>
          <div className="grid mt-7 pot:grid-cols-4 gap-1 grid-cols-1 lal:grid-cols-3">
            <EndpointComponent
              url="https://api.infrawatch.com/endpoint/1"
              responseTime="0.234"
              httpStatus={200}
              status="recheable"
            />
            <EndpointComponent
              url="https://api.infrawatch.com/endpoint/2"
              responseTime="0.456"
              httpStatus={401}
              status="unreachable"
            />
            <EndpointComponent
              url="https://api.infrawatch.com/endpoint/3"
              responseTime="0.789"
              httpStatus={500}
              status="unreachable"
            />
            <EndpointComponent
              url="https://api.infrawatch.com/endpoint/4"
              responseTime="0.123"
              httpStatus={200}
              status="recheable"
            />
            <EndpointComponent
              url="https://api.infrawatch.com/endpoint/5"
              responseTime="0.345"
              httpStatus={200}
              status="recheable"
            />
            <EndpointComponent
              url="https://api.infrawatch.com/endpoint/6"
              responseTime="0.567"
              httpStatus={200}
              status="recheable"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default DashboardSlice;
