import { Button } from "@/components/ui/button";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Plus, Server } from "lucide-react";
import EndpointComponent from "../components/EndpointComponent";

interface IEndpointSlice {
  showSideBar: boolean;
}

const EndpointSlice: React.FC<IEndpointSlice> = ({ showSideBar }) => {
  return (
    <section className="relative h-full">
      <header>
        <div className="flex items-start gap-5 flex-wrap justify-between mb-10">
          <div>
            <h2 className="text-white text-4xl font-medium pot:font-semibold">
              Endpoints / URLs
            </h2>
            <div className="w-full ret:w-[30rem]">
              <p className="text-zinc-500 font-[410]">
                Aqui você pode gerenciar e monitorar todos os seus endpoints e
                URLs, visualizar o status, logs e detalhes de cada um deles.
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
          Total <Badge className="rounded bg-cyan-600">30</Badge>
        </p>
      </div>
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

export default EndpointSlice;
