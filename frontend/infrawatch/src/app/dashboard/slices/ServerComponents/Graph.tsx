import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronDownIcon,
  Cog,
  SquarePen,
  Trash,
} from "lucide-react";
import React from "react";
import CPUGRAPH from "./Graphcs/Graph1";
import Example from "./Graphcs/Graph2";
import TemperatureGraph from "./Graphcs/Graph3";
import DataGraph from "./Graphcs/Graph4";
import SpaceGraph from "./Graphcs/Graph5";
import { ServerProps } from "../Types/Server";
import HeaderInfo from "./HeaderInfo";
import ServerMetricConfig from "../../components/Metrics/ServerMetricsConfig";

interface GraphProps {
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
  server: ServerProps | null;
}

const Graph: React.FC<GraphProps> = ({ setSelectedItem, server }) => {
  const [showMetricConfig, setShowMetricConfig] =
    React.useState<boolean>(false);

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
                {server?.servername}
              </h2>
              <span className="border-background absolute -end-4 -top-0 size-3 rounded-full border-2 bg-cyan-500">
                <span className="sr-only">Online</span>
              </span>
            </div>
            <div>
              <p className="text-zinc-400">
                {server?.last_metrics.version} - {server?.server_idenfier}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={"outline"}
              className="dark:border-zinc-900 dark:hover:bg-zinc-800/20"
            >
              Editar
              <SquarePen
                size={16}
                className="dark:text-zinc-400 text-zinc-600"
              />
            </Button>
          </div>
        </div>
        <div className="mt-10 pb-5 flex items-center justify-end gap-2">
          <Button
            variant={"outline"}
            onClick={() => setShowMetricConfig(true)}
            className="dark:border-zinc-900 dark:hover:bg-zinc-800/20"
          >
            Configurações
            <Cog size={16} className="dark:text-zinc-400 text-zinc-600" />
          </Button>
          <Button
            variant={"outline"}
            className="dark:border-zinc-900 dark:hover:bg-red-800/20 bg-red-800/50 !border-red-700"
          >
            Deletar
            <Trash size={16} className="text-white" />
          </Button>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 gap-3">
          <HeaderInfo server={server} />
          <div className="grid pot:grid-cols-2 lal:grid-cols-3 grid-cols-1 gap-3">
            <div className="dark:bg-zinc-950 flex flex-col pot:h-96 h-[28rem] justify-between p-5  border dark:border-zinc-900/40 rounded-2xl">
              <header className="border-b dark:border-b-zinc-900/40 pb-2 flex items-center justify-between">
                <div>
                  <h2 className="text-lg dark:text-cyan-500 uppercase font-medium">
                    Armazenamento
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
              <Example />
              <footer className="flex items-center justify-start gap-4 flex-wrap">
                <p className="pt-5 flex items-center gap-2">
                  Total{" "}
                  <span className="inline-flex w-2 rounded-full h-2 bg-[#ffc658]"></span>
                </p>
                <p className="pt-5 flex items-center gap-2">
                  Usada{" "}
                  <span className="inline-flex w-2 rounded-full h-2 bg-[#82ca9d]"></span>
                </p>
                <p className="pt-5 flex items-center gap-2">
                  Livre{" "}
                  <span className="inline-flex w-2 rounded-full h-2 bg-[#8884d8]"></span>
                </p>
              </footer>
            </div>

            <div className="dark:bg-zinc-950 overflow-x-auto bg-[#fff] lal:col-span-2 flex flex-col justify-between px-5 pt-5 pot:h-96 h-[28rem] border dark:border-zinc-900/40 rounded-2xl">
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

              <div
                className="flex scrollable w-full  h-full 
                justify-end items-center "
              >
                <CPUGRAPH />
              </div>
            </div>

            <div className="dark:bg-zinc-950 flex flex-col  justify-between p-5  border dark:border-zinc-900/40 rounded-2xl">
              <header className="border-b mb-5 dark:border-b-zinc-900/40 pb-2 flex items-center justify-between">
                <div>
                  <h2 className="text-lg dark:text-cyan-500 uppercase font-medium">
                    Temper. da CPU
                  </h2>
                  <p className="dark:text-zinc-300 text-zinc-600 text-[15px]">
                    Estatísticas & Gráficos
                  </p>
                </div>
                <div>
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
              <div className="flex items-center justify-center">
                <TemperatureGraph />
              </div>
              <footer className="flex items-center justify-start gap-4 flex-wrap">
                <p className=" flex text-[15px] items-center gap-2">
                  Total{" "}
                  <span className="inline-flex w-2 rounded-full h-2 bg-[#ffc658]"></span>
                </p>
                <p className=" flex text-[15px] items-center gap-2">
                  Usada{" "}
                  <span className="inline-flex w-2 rounded-full h-2 bg-[#82ca9d]"></span>
                </p>
                <p className=" flex text-[15px] items-center gap-2">
                  Livre{" "}
                  <span className="inline-flex w-2 rounded-full h-2 bg-[#8884d8]"></span>
                </p>
              </footer>
            </div>

            <div className="pot:col-span-2 grid grid-cols-1 pot:grid-cols-2 gap-3">
              <div className="dark:bg-zinc-950 flex flex-col  justify-between p-5  border dark:border-zinc-900/40 rounded-2xl">
                <header className="border-b mb-5 dark:border-b-zinc-900/40 pb-2 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg dark:text-cyan-500 uppercase font-medium">
                      Dados
                    </h2>
                    <p className="dark:text-zinc-300 text-zinc-600 text-[15px]">
                      Estatísticas & Gráficos
                    </p>
                  </div>
                  <div>
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
                <div className="flex items-center justify-center">
                  <DataGraph />
                </div>
                <footer className="flex items-center justify-start gap-4 flex-wrap">
                  <p className=" flex text-[15px] items-center gap-2">
                    Dados Enviados{" "}
                    <span className="inline-flex w-2 rounded-full h-2 bg-[#00C49F]"></span>
                  </p>
                  <p className=" flex text-[15px] items-center gap-2">
                    Dados Recebidos{" "}
                    <span className="inline-flex w-2 rounded-full h-2 bg-[#8884d8]"></span>
                  </p>
                </footer>
              </div>{" "}
              <div className="dark:bg-zinc-950 pot:h-auto h-[28rem] flex flex-col  justify-between p-5  border dark:border-zinc-900/40 rounded-2xl">
                <header className="border-b mb-5 dark:border-b-zinc-900/40 pb-2 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg dark:text-cyan-500 uppercase font-medium">
                      Espaço
                    </h2>
                    <p className="dark:text-zinc-300 text-zinc-600 text-[15px]">
                      Estatísticas & Gráficos
                    </p>
                  </div>
                  <div>
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

                <div className="flex w-full h-full items-center justify-center">
                  <SpaceGraph />
                </div>
                <footer className="flex items-center justify-center gap-4 flex-wrap">
                  <p className=" flex text-[15px] items-center gap-2">
                    Total{" "}
                    <span className="inline-flex w-2 rounded-full h-2 bg-[#ffc658]"></span>
                  </p>
                  <p className=" flex text-[15px] items-center gap-2">
                    Usado{" "}
                    <span className="inline-flex w-2 rounded-full h-2 bg-[#82ca9d]"></span>
                  </p>
                  <p className=" flex text-[15px] items-center gap-2">
                    Livre{" "}
                    <span className="inline-flex w-2 rounded-full h-2 bg-[#82ca9d]"></span>
                  </p>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ServerMetricConfig
        open={showMetricConfig}
        setOpen={setShowMetricConfig}
        setWorkspaces={() => {}}
        workspace_id={""}
      />
    </section>
  );
};

export default Graph;
