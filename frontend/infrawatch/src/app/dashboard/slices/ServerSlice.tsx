import { Button } from "@/components/ui/button";
import React from "react";
import ServerComponent from "../components/ServerComponent";
import { Badge } from "@/components/ui/badge";
import { Plus, Server } from "lucide-react";

interface IServerSlice {
  showSideBar: boolean;
}

const ServerSlice: React.FC<IServerSlice> = ({}) => {
  return (
    <section className="relative h-full">
      <header>
        <div className="flex items-start gap-5 flex-wrap justify-between mb-10">
          <div>
            <h2 className="text-white ret:text-4xl text-2xl font-medium pot:font-semibold">
              Servidores
            </h2>
            <div className="w-full ret:w-[30rem]">
              <p className="text-zinc-500 font-[410]">
                Aqui você pode gerenciar e monitorar todos os seus servidores,
                visualizar o status, logs e detalhes de cada um deles.
              </p>
            </div>
          </div>
          <div>
            <Button>
              <Server size={14} className="text-white size-4" />
              Adicionar Servidor
            </Button>
          </div>
        </div>
      </header>
      <div className="flex items-center justify-end">
        <p className="text-zinc-300 flex items-center gap-2">
          Total <Badge className="rounded-full">30</Badge>
        </p>
      </div>
      <div className={`grid mt-4 grid-cols-1`}>
        {
          // arrays of servers
          Array.from({ length: 30 }, (_, index) => (
            <ServerComponent
              key={index}
              index={index + 1}
              lastIndex={30}
              nameServer={`SR ${index + 1}`}
              status={index % 2 === 0 ? "online" : "offline"}
            />
          ))
        }
      </div>

      <div className="fixed bottom-5 pot:bottom-10 end-7 pot:end-12">
        <Button
          size={"icon"}
          className="rounded-full cursor-pointer size-9 hover:bg-white hover:opacity-80 bg-white text-black"
        >
          <Plus size={18} className="text-black size-5" />
        </Button>
      </div>
    </section>
  );
};

export default ServerSlice;
