import { Button } from "@/components/ui/button";
import React from "react";
import { Plus, Server } from "lucide-react";
import EndpointComponent from "../components/EndpointComponent";
import { EndpointProps } from "./Types/Endpoint";
import CreateEndpoint from "./EndpointComponents/CreateEndpoint";

interface IEndpointSlice {
  showSideBar: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  workspace_id: string;
  endpoints: EndpointProps[];
  setEndpoints: React.Dispatch<React.SetStateAction<EndpointProps[]>>;
}

const EndpointSlice: React.FC<IEndpointSlice> = ({
  endpoints,
  workspace_id,
  setErrorMessage,
  setEndpoints,
}) => {
  const [createEndpoint, setCreateEndpoint] = React.useState<boolean>(false);

  return (
    <section className="relative h-full">
      <header>
        <div className="flex items-start gap-5 flex-wrap justify-between mb-12">
          <div>
            <h2 className="dark:text-white ret:text-4xl text-2xl font-medium pot:font-semibold">
              Endpoints / URLs
            </h2>
            <div className="w-full ret:w-[30rem]">
              <p className="dark:text-zinc-500 text-zinc-700 font-[410]">
                Aqui você pode gerenciar e monitorar todos os seus endpoints e
                URLs, visualizar o status, logs e detalhes de cada um deles.
              </p>
            </div>
          </div>
          <div>
            <Button
              onClick={() => setCreateEndpoint(true)}
              variant={"outline"}
              className="cursor-pointer ret:w-auto w-full py-5 dark:hover:bg-zinc-900/30 dark:text-white dark:border-zinc-900/80 shadow-none"
            >
              <Server size={14} className="text-white size-4" />
              Adicionar Endpoint
            </Button>
          </div>
        </div>
      </header>
      <div className={`grid mt-7 gap-1 grid-cols-1`}>
        {endpoints.map((endpoint, index) => (
          <EndpointComponent key={index} endpoint={endpoint} index={index} />
        ))}
      </div>

      <div className="fixed bottom-5 pot:bottom-10 end-7 pot:end-12">
        <Button
          onClick={() => setCreateEndpoint(true)}
          size={"icon"}
          className="rounded-full cursor-pointer size-9 hover:bg-white hover:opacity-80 bg-white text-black"
        >
          <Plus size={18} className="text-black size-5" />
        </Button>
      </div>

      <CreateEndpoint
        open={createEndpoint}
        setOpen={setCreateEndpoint}
        mode="CREATE"
        setEndpoints={setEndpoints}
        workspace_id={workspace_id || ""}
        setErrorMessage={setErrorMessage}
      />
    </section>
  );
};

export default EndpointSlice;
