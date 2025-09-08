import {
  Bolt,
  Braces,
  ChevronDownIcon,
  Ellipsis,
  Info,
  OctagonAlert,
  ToggleLeft,
  Trash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import React from "react";
import { removeDoubleSlashes } from "@/components/AppComponents/API";
import { EndpointProps } from "../Types/Endpoint";
import { isEmpty } from "../ServerComponents/ServerComponent";
import { DataMode } from "../Types/DataMod";
import Graph1 from "./Graph1";
import SpaceGraph from "./Graph2";

interface IEndpointComponent {
  endpoint: EndpointProps;
  index: number;
}

const EndpointComponent: React.FC<IEndpointComponent> = ({
  endpoint,
  index,
}) => {
  const [openDetails, setOpenDetails] = React.useState(false);

  return (
    <div
      className={` ${
        index === 0 ? "border-y" : "border-b"
      } py-4 flex items-center flex-wrap gap-4 px-3 justify-between`}
    >
      <div className="flex items-center pot:w-auto w-full gap-2">
        <div className="flex items-center gap-2 w-full">
          <p>
            {endpoint.identifier}{" "}
            <span className="text-[15px] text-zinc-500">
              {endpoint.url.slice(0, 25)}
              {endpoint.url.length > 25 ? "..." : ""}
            </span>
          </p>
          <Badge className="pot:inline-flex hidden">{endpoint.access}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="pot:hidden text-nowrap">
            <p className="text-zinc-500 text-[15px] font-[480]">há 3min</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="dark:text-zinc-400 pot:hidden inline-flex text-zinc-500 hover:text-black transition-all dark:hover:text-white cursor-pointer">
                <Ellipsis size={20} className=" ms-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-40 me-5">
              <DropdownMenuItem
                // disabled={isEmpty(server.last_metrics)}
                className="cursor-pointer"
                onClick={() => setOpenDetails(true)}
              >
                <Info size={16} className="opacity-60" aria-hidden="true" />
                Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem
                // disabled={isEmpty(server.last_metrics)}
                className="cursor-pointer"
                // onClick={() => setOpenDetails(true)}
              >
                <Braces size={16} className="opacity-60" aria-hidden="true" />
                Todas as métricas
              </DropdownMenuItem>

              <DropdownMenuItem
                // disabled={isEmpty(server.last_metrics)}
                className="disabled:cursor-not-allowed cursor-pointer !text-red-700 dark:!text-red-300"
                // onClick={() => setOpenDetails(true)}
              >
                <OctagonAlert
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
                Mensagens de alerta
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 pot:justify-end">
        {isEmpty(endpoint.last_log) ? (
          <p className="flex items-center gap-2">
            <span className="inline-flex w-2 h-2 rounded-full me-1 bg-zinc-600 animate-pulse"></span>
            Conectando-se
            <span className="loader !w-3 !h-3 !border-2 !border-zinc-800 !border-b-zinc-100"></span>
          </p>
        ) : (
          <>
            <div className="pot:inline-flex hidden">
              <p className="text-zinc-500 text-[15px] font-[480]">
                {DataMode(
                  new Date(removeDoubleSlashes(endpoint.last_log.timestamp))
                )}
              </p>
            </div>
            <div className="flex items-center pe-3 gap-2 justify-start pot:justify-end">
              <p className="dark:text-white text-[15px]">Status</p>
              <span className="relative flex size-2">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                    endpoint.last_log.status === "UP"
                      ? "bg-sky-400"
                      : "bg-red-500"
                  }  opacity-75`}
                ></span>
                <span
                  className={`relative inline-flex size-2 rounded-full ${
                    endpoint.last_log.status === "UP"
                      ? "bg-sky-400"
                      : "bg-red-500"
                  } `}
                ></span>
              </span>
            </div>
            <div>
              <p
                className={`px-2 text-white text-[13px] ${
                  parseInt(endpoint.last_log.statusResponse) === 200
                    ? "bg-green-600/20 border border-green-500"
                    : parseInt(endpoint.last_log.statusResponse) === 401
                    ? "bg-yellow-600/20 border border-yellow-500"
                    : "bg-red-600/20 border border-red-500"
                }  font-medium rounded leading-none py-1`}
              >
                HTTPS <span>{endpoint.last_log.statusResponse}</span>
              </p>
            </div>
            <div className="flex items-center  gap-1 flex-wrap">
              <p className="px-2 text-white text-[14px] bg-zinc-900  font-medium rounded leading-none py-1">
                Tempo de resposta{" "}
                <span className="text-cyan-500">
                  {endpoint.last_log.time_response}ms
                </span>
              </p>
            </div>
          </>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="dark:text-zinc-400 pot:inline-flex hidden text-zinc-500 hover:text-black transition-all dark:hover:text-white cursor-pointer">
              <Ellipsis size={20} className=" ms-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-40 me-5">
            <DropdownMenuItem
              // disabled={isEmpty(server.last_metrics)}
              className="cursor-pointer"
              onClick={() => setOpenDetails(true)}
            >
              <Info size={16} className="opacity-60" aria-hidden="true" />
              Detalhes
            </DropdownMenuItem>
            <DropdownMenuItem
              // disabled={isEmpty(server.last_metrics)}
              className="cursor-pointer"
              onClick={() => setOpenDetails(true)}
            >
              <Bolt size={16} className="opacity-60" aria-hidden="true" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              // disabled={isEmpty(server.last_metrics)}
              className="cursor-pointer"
              // onClick={() => setOpenDetails(true)}
            >
              <Braces size={16} className="opacity-60" aria-hidden="true" />
              Todas as métricas
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              // onClick={() => setOpenDetails(true)}
            >
              <ToggleLeft size={16} className="opacity-60" aria-hidden="true" />
              Desativar monitoramento
            </DropdownMenuItem>

            <DropdownMenuItem
              // disabled={isEmpty(server.last_metrics)}
              className="disabled:cursor-not-allowed cursor-pointer !text-red-700 dark:!text-red-300"
              // onClick={() => setOpenDetails(true)}
            >
              <OctagonAlert
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              Mensagens de alerta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Sheet open={openDetails} onOpenChange={setOpenDetails}>
        <SheetContent side="bottom" className="pot:h-[80vh] h-[90vh]">
          <SheetHeader className="border-b ">
            <div className="max-w-7xl w-full mx-auto">
              <SheetTitle className="font-medium">
                Endpoint - {endpoint.identifier}
              </SheetTitle>
              <SheetDescription className="-mt-1">
                {endpoint.description || "Descrição"}
              </SheetDescription>
            </div>
          </SheetHeader>
          <ScrollArea className="h-full px-5 overflow-y-auto">
            <header className="grid max-w-7xl w-full mx-auto mt-10 ret:grid-cols-2 grid-cols-1 pot:px-0 px-8 pot:grid-cols-4 gap-4">
              <div>
                <p className="dark:text-zinc-500 text-zinc-600">Endereço</p>
                <p className="dark:text-white break-words text-[14px] font-mono">
                  {endpoint.url}
                </p>
              </div>
              <div>
                <p className="dark:text-zinc-500 text-zinc-600">Status</p>
                <p className="dark:text-white flex items-center gap-2 break-words text-[14px] font-mono">
                  {endpoint.last_log.status === "UP" ? "Ativo" : "Inativo"}
                  <span className="relative flex size-2">
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                        endpoint.last_log.status === "UP"
                          ? "bg-sky-400"
                          : "bg-red-500"
                      }  opacity-75`}
                    ></span>
                    <span
                      className={`relative inline-flex size-2 rounded-full ${
                        endpoint.last_log.status === "UP"
                          ? "bg-sky-400"
                          : "bg-red-500"
                      } `}
                    ></span>
                  </span>
                </p>
              </div>
              <div>
                <p className="dark:text-zinc-500 text-zinc-600">Criado em</p>
                <p className="dark:text-white break-words text-[14px] font-mono">
                  {new Date(endpoint.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  (msalembe)
                </p>
              </div>
              <div>
                <p className="dark:text-zinc-500 text-zinc-600">
                  Última verificação
                </p>
                <p className="dark:text-white break-words text-[14px] font-mono">
                  há {DataMode(new Date(endpoint.last_log.timestamp))}
                </p>
              </div>
            </header>

            <div className="flex pot:px-0 px-8 flex-wrap max-w-7xl mx-auto w-full mt-10 items-center justify-between">
              <Button
                variant={"outline"}
                className="dark:border-zinc-900/50 dark:hover:bg-zinc-900/30"
              >
                <Bolt size={16} className="opacity-60" aria-hidden="true" />
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
                  <Trash size={18} className="" />
                  Deletar
                </Button>
              </div>
            </div>
            <div className="mt-16 max-w-7xl w-full mx-auto pot:px-0 px-5 pb-10 grid grid-cols-1 pot:grid-cols-2 gap-2">
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
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default EndpointComponent;
