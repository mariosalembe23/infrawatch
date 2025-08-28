import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDownIcon,
  ChevronRight,
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
import ServerComponent from "../components/ServerComponent";
import NetworkComponent from "../components/NetWorkComponent";
import EndpointComponent from "../components/EndpointComponent";

interface IDashboardSlice {
  showSideBar: boolean;
}

const DashboardSlice: React.FC<IDashboardSlice> = ({ showSideBar }) => {
  return (
    <section>
      <header>
        <div className="flex items-start gap-5 flex-wrap justify-between mb-10">
          <div>
            <h2 className="dark:text-white ret:text-4xl text-2xl font-medium pot:font-semibold">
              Dashboard
            </h2>
            <div className="w-full ret:w-[30rem]">
              <p className="dark:text-zinc-500 text-zinc-700 font-[410]">
                Aqui você pode visualizar o estado geral da sua infraestrutura e
                acessar informações detalhadas sobre os seus servidores,
                serviços e redes.
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="cursor-pointer ret:w-auto w-full py-5 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-950 shadow-none">
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
      </header>
      <div className="mt-10">
        <div>
          <header className="flex flex-wrap items-center justify-between">
            <h3 className="dark:text-zinc-400 text-zinc-600 font-[410] text-base">
              Dados Recentes{" "}
              <Badge className="text-[14px] dark:bg-zinc-900 dark:text-white leading-none py-1 px-2">
                <ZapIcon
                  className="-ms-0.5 opacity-60"
                  size={12}
                  aria-hidden="true"
                />
                Servidores - 14
              </Badge>
            </h3>
            <Button className="cursor-pointer dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-950 shadow-none">
              Todos dados <ChevronRight size={16} className="text-zinc-400" />
            </Button>
          </header>
          <div className={`grid mt-4 grid-cols-1 `}>
            {Array.from({ length: 6 }, (_, index) => (
              <ServerComponent
                key={index}
                index={index + 1}
                lastIndex={6}
                nameServer={`SR ${index + 1}`}
                status={index % 2 === 0 ? "online" : "offline"}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-10">
        <div>
          <header className="flex items-center justify-between">
            <h3 className="dark:text-zinc-400 text-zinc-600 font-[410] text-lg">
              Dados Recentes{" "}
              <Badge className="text-[14px] dark:bg-zinc-900 dark:text-white leading-none py-1 px-2">
                <ZapIcon
                  className="-ms-0.5 opacity-60"
                  size={12}
                  aria-hidden="true"
                />
                Redes - 14
              </Badge>
            </h3>
            <Button className="cursor-pointer dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-950 shadow-none">
              Todos dados <ChevronRight size={16} className="text-zinc-400" />
            </Button>
          </header>
          <div className="grid mt-7 pot:grid-cols-3 ret:grid-cols-2 grid-cols-1 lal:grid-cols-5 gap-3">
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
            <h3 className="dark:text-zinc-400 text-zinc-600 font-[410] text-lg">
              Dados Recentes{" "}
              <Badge className="text-[14px] dark:bg-zinc-900 dark:text-white leading-none py-1 px-2">
                <ZapIcon
                  className="-ms-0.5 opacity-60"
                  size={12}
                  aria-hidden="true"
                />
                Endpoints - 14
              </Badge>
            </h3>
            <Button className="cursor-pointer dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-950 shadow-none">
              Todos dados <ChevronRight size={16} className="text-zinc-400" />
            </Button>
          </header>
          <div
            className={`grid mt-7 gap-1 ${
              showSideBar
                ? "pot:grid-cols-3 ret:grid-cols-2 grid-cols-1"
                : "lal:grid-cols-4 pot:grid-cols-3 ret:grid-cols-2 grid-cols-1"
            }`}
          >
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
