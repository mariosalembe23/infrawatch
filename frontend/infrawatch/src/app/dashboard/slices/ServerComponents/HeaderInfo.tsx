import {
  ArrowRightLeft,
  Cpu,
  EthernetPort,
  MemoryStick,
  Microchip,
  Network,
  Radio,
  Thermometer,
} from "lucide-react";
import { ServerProps } from "../Types/Server";
import { Badge } from "@/components/ui/badge";

const DataItem: React.FC<{
  headerChildren: React.ReactNode;
  footerChildren: React.ReactNode;
}> = ({ headerChildren, footerChildren }) => {
  return (
    <div className="p-4 flex items-start justify-between flex-col rounded-2xl bg-white dark:bg-[#060607] border dark:border-zinc-900/40 h-48 ret:h-52">
      <header>{headerChildren}</header>
      <footer>{footerChildren}</footer>
    </div>
  );
};

const HeaderInfo: React.FC<{
  server: ServerProps | null;
}> = ({ server }) => {
  return (
    <div className="dark:bg-zinc-950 bg-[#f5f5f5] p-1 grid gap-1 pot:grid-cols-4 ret:grid-cols-3 grid-cols-1 lal:grid-cols-8 border dark:border-zinc-900/40 rounded-2xl">
      <DataItem
        headerChildren={
          <div className="flex flex-col items-start">
            <Cpu size={18} className="dark:text-cyan-500 size-6 mb-3" />
          </div>
        }
        footerChildren={
          <div>
            <p className="dark:text-zinc-500 text-zinc-600 uppercase text-[14px]">
              Uso de CPU
            </p>
            <p className="text-xl font-medium">
              {server?.last_metrics.cpu_usage}
            </p>
            <Badge variant="outline" className="gap-1.5 border-cyan-600">
              <span
                className="size-1.5 rounded-full bg-cyan-500"
                aria-hidden="true"
              ></span>
              Estável
            </Badge>
          </div>
        }
      />

      <DataItem
        headerChildren={
          <div className="flex flex-col items-start">
            <Radio size={18} className="dark:text-cyan-500 size-6 mb-3" />
          </div>
        }
        footerChildren={
          <div>
            <p className="dark:text-zinc-500 text-zinc-600 uppercase text-[14px]">
              Frequência CPU
            </p>
            <p className="text-xl font-medium">
              {server?.last_metrics.cpu_frequency}
            </p>
            <Badge variant="outline" className="gap-1.5 border-cyan-600">
              <span
                className="size-1.5 rounded-full bg-cyan-500"
                aria-hidden="true"
              ></span>
              Estável
            </Badge>
          </div>
        }
      />

      <DataItem
        headerChildren={
          <div className="flex flex-col items-start">
            <MemoryStick size={18} className="dark:text-cyan-500 size-6 mb-3" />
          </div>
        }
        footerChildren={
          <div>
            <p className="text-zinc-500 uppercase text-[14px]">RAM / Usada</p>
            <p className="text-xl font-medium">
              {server?.last_metrics.ram_usage_available}
            </p>
            <p className="dark:text-cyan-500 text-cyan-600 text-[14px] uppercase">
              Total de {server?.last_metrics.ram_usage_total}
            </p>
          </div>
        }
      />

      <DataItem
        headerChildren={
          <div className="flex flex-col items-start">
            <EthernetPort
              size={18}
              className="dark:text-cyan-500 size-6 mb-3"
            />
          </div>
        }
        footerChildren={
          <div>
            <p className="dark:text-zinc-500 text-zinc-600 uppercase text-[14px]">
              Interfaces de Rede
            </p>
            <p className="text-xl font-medium">
              {server?.last_metrics.interfaces_total}
            </p>
            <p className="dark:text-cyan-500 text-cyan-600 text-[14px]">
              {server?.last_metrics.interfaces_active} Ativa(s) /{" "}
              {server?.last_metrics.interfaces_inactive} Inactiva(s)
            </p>
          </div>
        }
      />

      <DataItem
        headerChildren={
          <div className="flex flex-col items-start">
            <Thermometer size={18} className="dark:text-cyan-500 size-6 mb-3" />
          </div>
        }
        footerChildren={
          <div>
            <p className="dark:text-zinc-500 text-zinc-600 uppercase text-[14px]">
              Temperatura
            </p>
            <p className="text-xl font-medium">
              {server?.last_metrics.cpu_temperature}
            </p>
            <Badge variant="outline" className="gap-1.5 border-cyan-600">
              <span
                className="size-1.5 rounded-full bg-cyan-500"
                aria-hidden="true"
              ></span>
              Estável
            </Badge>
          </div>
        }
      />

      <DataItem
        headerChildren={
          <div className="flex flex-col items-start">
            <ArrowRightLeft
              size={18}
              className="dark:text-cyan-500 size-6 mb-3"
            />
          </div>
        }
        footerChildren={
          <div>
            <p className="dark:text-zinc-500 text-zinc-600 uppercase text-[14px]">
              SWAP
            </p>
            <p className="text-xl font-medium">
              {server?.last_metrics.swap_usage_available}
            </p>
            <p className="dark:text-cyan-500 text-cyan-600 text-[14px] uppercase">
              Total de {server?.last_metrics.swap_usage_total}
            </p>
          </div>
        }
      />

      <DataItem
        headerChildren={
          <div className="flex flex-col items-start">
            <Network size={18} className="dark:text-cyan-500 size-6 mb-3" />
          </div>
        }
        footerChildren={
          <div>
            <p className="dark:text-zinc-500 text-zinc-600 uppercase text-[14px]">
              Tráfego de Rede
            </p>
            <p className="text-[15px] pt-2 flex items-start flex-col leading-none font-medium">
              {server?.last_metrics.sendData}
              <span className="text-sm text-cyan-600 dark:text-cyan-500">
                Enviados
              </span>
            </p>
            <p className="text-[15px] pt-2 flex items-start flex-col leading-none font-medium">
              {server?.last_metrics.receiveData}
              <span className="text-sm text-cyan-600 dark:text-cyan-500">
                Recebidos
              </span>
            </p>
          </div>
        }
      />

      <DataItem
        headerChildren={
          <div className="flex flex-col items-start">
            <Microchip size={18} className="dark:text-cyan-500 size-6 mb-3" />
          </div>
        }
        footerChildren={
          <div>
            <p className="dark:text-zinc-500 text-zinc-600 uppercase text-[14px]">
              Núcleos
            </p>
            <p className="text-base pt-2 flex items-start flex-col leading-none font-medium">
              {server?.last_metrics.fisical_nucleos}
              <span className="text-sm text-cyan-600 dark:text-cyan-500">
                Físicos
              </span>
            </p>
            <p className="text-base pt-2 flex items-start flex-col leading-none font-medium">
              {server?.last_metrics.logical_nucleos}
              <span className="text-sm text-cyan-600 dark:text-cyan-500">
                Lógicos
              </span>
            </p>
          </div>
        }
      />
    </div>
  );
};

export default HeaderInfo;
