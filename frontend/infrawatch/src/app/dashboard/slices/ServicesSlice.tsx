import { Badge } from "@/components/ui/badge";
import { ArrowUp, ChevronDownIcon, HardDrive, Server } from "lucide-react";
import React, { useEffect } from "react";
import { DashboardContext } from "../[id]/ContextProvider";
import { ServerProps } from "./Types/Server";
import Graph from "./ServerComponents/Graph";
import { Tabs } from "../[id]/page";
import { isEmpty } from "./ServerComponents/ServerComponent";
import {
  removeDoubleSlashes,
  removeUnity,
} from "@/components/AppComponents/API";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IServicesSlice {
  showSideBar: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  servers: ServerProps[];
  setServers: React.Dispatch<React.SetStateAction<ServerProps[]>>;
  setTabs: React.Dispatch<React.SetStateAction<Tabs>>;
}

const calculatePercentage = (totalMemory: number, usedMemory: number) => {
  if (totalMemory === 0) return 0;
  const totalMemoryInMB = totalMemory * 1024;
  const percentage = (usedMemory / totalMemoryInMB) * 100;
  return percentage.toFixed(2);
};

const ServicesSlice: React.FC<IServicesSlice> = ({
  setErrorMessage,
  servers,
  setServers,
  setTabs,
}) => {
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

  const putOnTop = (id: string) => {
    const serverIndex = servers.findIndex((srv) => srv.id === id);
    if (serverIndex > -1) {
      const updatedServers = [...servers];
      const [selectedServer] = updatedServers.splice(serverIndex, 1);
      updatedServers.unshift(selectedServer);
      setServers(updatedServers);
    }
  };

  return selectedItem ? (
    <Graph
      setSelectedItem={setSelectedItem}
      server={selectedServer}
      setErrorMessage={setErrorMessage}
      workspace_id={workSpaceInfo?.id || ""}
      setServers={setServers}
    />
  ) : (
    <section className="max-w-7xl w-full mx-auto">
      <header className="mb-10 flex items-center justify-between flex-wrap">
        <div className="flex items-start gap-5 flex-wrap justify-between mb-5 pot:mb-10">
          <div>
            <h2 className="dark:text-white ret:text-4xl text-2xl font-medium pot:font-semibold">
              Serviços
            </h2>
            <div className="w-full ret:w-[30rem]">
              <p className="dark:text-zinc-500 text-zinc-700 font-[410]">
                Monitore os serviços que estão rodando em seus servidores e
                garanta que tudo esteja funcionando perfeitamente.
              </p>
            </div>
          </div>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"outline"}
                className="cursor-pointer ret:w-auto w-full  shadow-none"
              >
                Priorizar
                <ChevronDownIcon
                  className="-me-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {servers
                .filter((srv) => !isEmpty(srv.last_metrics))
                .map((server, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => putOnTop(server.id)}
                    className="cursor-pointer"
                  >
                    <ArrowUp size={16} className=" opacity-60" />
                    {server.servername.slice(0, 15)}
                    {server.servername.length > 15 ? "..." : ""}
                    <Badge className="min-w-3 size-4 ">
                      {server.last_metrics.services.split(",").length}
                    </Badge>
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {servers.filter((srv) => !isEmpty(srv.last_metrics)).length === 0 ? (
        <div className="max-w-xl w-full">
          <p>
            Nenhum serviço encontrado em seus servidores. Adicione servidores e
            comece a monitorar os serviços em execução.
          </p>
          <Button
            onClick={() => {
              setTabs("server");
            }}
            variant={"outline"}
            className="mt-4 dark:border-zinc-900 dark:hover:bg-zinc-900/30"
          >
            <Server size={14} className="dark:text-white size-4" />
            Servidores
          </Button>
        </div>
      ) : (
        <div className="mt-10 gap-10 grid grid-cols-1">
          {servers
            .filter((srv) => !isEmpty(srv.last_metrics))
            .map((server, index) => (
              <div key={index}>
                <header className="mb-5 flex items-center justify-between ">
                  <h4 className="text-xl">
                    <Server size={18} className="inline mr-2 mb-1" />
                    {server.servername}
                  </h4>
                  <div>
                    <p className="dark:text-zinc-400 text-zinc-700">
                      {server.last_metrics.services.split(",").length} Serviços
                    </p>
                  </div>
                </header>
                {removeDoubleSlashes(server.last_metrics.services)
                  .split(",")
                  .map((service, svcIndex) => {
                    const svc = service.split("/");
                    const porcent = calculatePercentage(
                      parseInt(svc[1]) || 0,
                      removeUnity(server.last_metrics.disk_space_size)
                    );
                    return (
                      <div
                        key={svcIndex}
                        className={`py-4  ${
                          svcIndex === 0 ? "border-y" : "border-b"
                        } flex items-center flex-wrap gap-4 justify-between dark:border-zinc-800`}
                      >
                        <div className="flex items-center gap-2">
                          <p className="capitalize">
                            <HardDrive
                              size={18}
                              className="inline text-zinc-500 mr-2 mb-1"
                            />
                            {svc[0] || "N/A"}
                          </p>
                          <Badge className="rounded bg-green-400/20 border-green-700 border text-green-800 dark:text-green-50">
                            Rodando
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 justify-end">
                          <p className="dark:text-zinc-300 font-medium text-[14px]">
                            {svc[1] || "0MB"} MB
                          </p>
                          <div>
                            <div className="w-32 rounded-full bg-gray-200 dark:bg-zinc-900 h-1">
                              <div
                                style={{
                                  width: `${parseFloat(String(porcent)) * 10}%`,
                                }}
                                className="dark:bg-zinc-100 bg-zinc-800  h-full rounded-full"
                              ></div>
                            </div>
                          </div>
                          <p className="dark:text-zinc-300 font-medium text-[14px]">
                            {porcent}% de {server.last_metrics.disk_space_size}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
        </div>
      )}
    </section>
  );
};
export default ServicesSlice;
