import { Button } from "@/components/ui/button";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Network, Plus } from "lucide-react";
import NetworkComponent from "../components/NetWorkComponent";

// interface INetworkSlice {
//   showSideBar: boolean;
// }

const NetworkSlice: React.FC = () => {
  return (
    <section className="relative h-full">
      <header>
        <div className="flex items-start gap-5 flex-wrap justify-between mb-10">
          <div>
            <h2 className="text-white ret:text-4xl text-2xl font-medium pot:font-semibold">
              Aparelhos de Rede
            </h2>
            <div className="w-full ret:w-[30rem]">
              <p className="text-zinc-500 font-[410]">
                Aqui você pode gerenciar e monitorar todos os seus dispositivos
                de rede, visualizar o status, logs e detalhes de cada um deles.
              </p>
            </div>
          </div>
          <div>
            <Button>
              <Network size={14} className="text-white size-4" />
              Adicionar aparelho
            </Button>
          </div>
        </div>
      </header>
      <div className="flex items-center justify-end">
        <p className="text-zinc-300 flex items-center gap-2">
          Total <Badge className="rounded bg-cyan-600">30</Badge>
        </p>
      </div>
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

export default NetworkSlice;
