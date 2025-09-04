import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDownIcon,
  ChevronRight,
  Link2,
  Network,
  Plus,
  Server,
  ZapIcon,
} from "lucide-react";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateServer from "./ServerComponents/CreateServer";
import { DashboardContext } from "../[id]/ContextProvider";
import { ServerProps } from "./Types/Server";
import ServerComponent from "../components/ServerComponent";
import Graph from "./ServerComponents/Graph";
import { Tabs } from "../[id]/page";

interface IDashboardSlice {
  showSideBar: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  servers: ServerProps[];
  setServers: React.Dispatch<React.SetStateAction<ServerProps[]>>;
  setTabs: React.Dispatch<React.SetStateAction<Tabs>>;
}

const DashboardSlice: React.FC<IDashboardSlice> = ({
  setErrorMessage,
  servers,
  setServers,
  setTabs,
}) => {
  const [createServerOpen, setCreateServerOpen] = React.useState(false);
  const dashboardContext = React.useContext(DashboardContext);
  const workSpaceInfo = dashboardContext?.workSpaceInfo;
  const [selectedItem, setSelectedItem] = React.useState<string>("");
  const [selectedServer, setSelectedServer] =
    React.useState<ServerProps | null>(null);

  useEffect(() => {
    if (selectedItem) {
      const server = servers.find((srv) => srv.id === selectedItem);
      if (server) {
        setSelectedServer(server);
      }
    } else {
      setSelectedServer(null);
    }
  }, [selectedItem, servers]);

  return selectedItem ? (
    <Graph setSelectedItem={setSelectedItem} server={selectedServer} />
  ) : (
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
              <Button
                variant={"outline"}
                className="cursor-pointer ret:w-auto w-full  shadow-none"
              >
                Adicionar
                <ChevronDownIcon
                  className="-me-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setCreateServerOpen(true)}
              >
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
          <header className="flex mb-5 flex-wrap items-center justify-between gap-3">
            <h3 className="dark:text-zinc-400 text-zinc-600 font-[410]  text-base">
              Dados Recentes{" "}
              <Badge className="text-[14px] dark:bg-zinc-900 dark:text-white leading-none py-1 px-2">
                <ZapIcon
                  className="-ms-0.5 opacity-60"
                  size={12}
                  aria-hidden="true"
                />
                Servidores - {servers.length}
              </Badge>
            </h3>
            <Button
              onClick={() => setTabs("server")}
              className="cursor-pointer bg-white dark:bg-transparent hover:bg-gray-100 border dark:text-white text-black dark:hover:bg-zinc-950 shadow-none"
            >
              Todos dados <ChevronRight size={16} className="text-zinc-400" />
            </Button>
          </header>

          {servers.length === 0 ? (
            <div className="flex flex-wrap  items-center gap-2">
              <div className="items-center  ret:w-auto w-full gap-2 flex-wrap  border rounded-lg inline-flex px-5 py-2 dark:border-zinc-900 dark:bg-zinc-950">
                <Server size={16} className="dark:text-white text-zinc-900" />
                Sem servidores registrados
              </div>
              <Button
                onClick={() => setCreateServerOpen(true)}
                className=" ret:w-auto w-full py-[1.2rem]  bg-cyan-600/40 border border-cyan-700 hover:bg-cyan-600/50 cursor-pointer text-cyan-800 dark:text-white"
              >
                Adicionar
                <Plus size={18} className="" />
              </Button>
            </div>
          ) : (
            servers
              .slice(0, 6)
              .map((server, index) => (
                <ServerComponent
                  key={index}
                  index={index + 1}
                  lastIndex={servers.slice(0, 6).length}
                  server={server}
                  setSelectedItem={setSelectedItem}
                />
              ))
          )}
        </div>
      </div>
      <div className="mt-10">
        <div>
          <header className="flex items-center gap-3 justify-between">
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
            <Button
              onClick={() => setTabs("network")}
              className="cursor-pointer bg-white dark:bg-transparent hover:bg-gray-100 border dark:text-white text-black dark:hover:bg-zinc-950 shadow-none"
            >
              Todos dados <ChevronRight size={16} className="text-zinc-400" />
            </Button>
          </header>
          <div className="flex flex-wrap mt-5 items-center gap-2">
            <div className="items-center  ret:w-auto w-full gap-3 border rounded-lg inline-flex px-5 py-2 dark:border-zinc-900 dark:bg-zinc-950">
              <Network size={16} className="dark:text-white text-zinc-900" />
              Sem aparelhos de rede registrados
            </div>
            <Button className=" ret:w-auto w-full py-[1.2rem]  bg-cyan-600/40 border border-cyan-700 hover:bg-cyan-600/50 cursor-pointer text-cyan-800 dark:text-white">
              Adicionar
              <Plus size={18} className="" />
            </Button>
          </div>
          {/* <div className="grid mt-7 pot:grid-cols-3 ret:grid-cols-2 grid-cols-1 lal:grid-cols-5 gap-3">
            
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
          </div> */}
        </div>
      </div>
      <div className="mt-10">
        <div>
          <header className="flex items-center gap-3 justify-between">
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
            <Button
              onClick={() => setTabs("endpoint")}
              className="cursor-pointer bg-white dark:bg-transparent hover:bg-gray-100 border dark:text-white text-black dark:hover:bg-zinc-950 shadow-none"
            >
              Todos dados <ChevronRight size={16} className="text-zinc-400" />
            </Button>
          </header>
          <div className="flex mt-5 items-center flex-wrap gap-2">
            <div className="items-center ret:w-auto w-full gap-2  border rounded-lg inline-flex px-5 py-2 dark:border-zinc-900 dark:bg-zinc-950">
              <Link2 size={16} className="dark:text-white text-zinc-900" />
              Sem endpoints registrados
            </div>
            <Button className=" ret:w-auto w-full py-[1.2rem]  bg-cyan-600/40 border border-cyan-700 hover:bg-cyan-600/50 cursor-pointer text-cyan-800 dark:text-white">
              Adicionar
              <Plus size={18} className="" />
            </Button>
          </div>
          {/* <div
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
            
           
          </div> */}
        </div>
      </div>
      <CreateServer
        open={createServerOpen}
        setOpen={setCreateServerOpen}
        setServers={setServers}
        workspace_id={workSpaceInfo?.id || ""}
        setErrorMessage={setErrorMessage}
      />
    </section>
  );
};
export default DashboardSlice;
