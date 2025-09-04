import { Button } from "@/components/ui/button";
import React from "react";
import { Cog, Plus, Server } from "lucide-react";
import ServerMetricConfig from "../components/Metrics/ServerMetricsConfig";
import Graph from "./ServerComponents/Graph";

interface IServerSlice {
  showSideBar: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  workspace_id: string;
}

const ServerSlice: React.FC<IServerSlice> = ({}) => {
  const [selectedItem, setSelectedItem] = React.useState<string>("");
  const [showMetricConfig, setShowMetricConfig] =
    React.useState<boolean>(false);

  return selectedItem ? (
    <Graph setSelectedItem={setSelectedItem} />
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
          <div className="w-full flex items-center flex-wrap gap-2">
            <Button className="cursor-pointer ret:w-auto w-full py-5 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-900/50 shadow-none">
              <Server size={14} className="text-white size-4" />
              Adicionar Servidor
            </Button>
            <Button
              onClick={() => setShowMetricConfig(true)}
              className="cursor-pointer py-5 ret:w-auto w-full hover:bg-gray-100 bg-white dark:bg-transparent border text-black dark:text-white dark:hover:bg-zinc-950 shadow-none"
            >
              Configurações{" "}
              <Cog size={16} className="dark:text-zinc-400 text-zinc-600" />
            </Button>
          </div>
        </div>
      </header>
      <div className="grid grid-cols-1 pot:grid-cols-2 gap-4"></div>

      <div className="fixed bottom-5 pot:bottom-10 end-7 pot:end-12">
        <Button
          size={"icon"}
          className="rounded-full cursor-pointer size-9 hover:bg-white hover:opacity-80 bg-white text-black"
        >
          <Plus size={18} className="text-black size-5" />
        </Button>
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

export default ServerSlice;
