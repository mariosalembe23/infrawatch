import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ellipsis, Info, Network } from "lucide-react";

interface INetworkComponent {
  name: string;
  status: "operational" | "maintenance" | "offline";
  firmware: string;
  manufacturer: string;
  totalInterfaces: number;
  activeInterfaces: number;
  downInterfaces: number;
  cpuUsage: number;
  temperature: number;
}

const NetworkComponent: React.FC<INetworkComponent> = ({
  name,
  status,
  firmware,
  manufacturer,
  totalInterfaces,
  activeInterfaces,
  downInterfaces,
  cpuUsage,
  temperature,
}) => {
  return (
    <div className="relative border flex-col border-zinc-300 dark:border-zinc-900 px-5 py-5 dark:bg-zinc-950 rounded-lg items-start flex justify-between">
      <span
        className={`border-background capitalize absolute -end-4 text-[13px] -top-4 font-[490] text-white py-[0.20rem] rounded-full px-2 ${
          status === "operational"
            ? "bg-green-600"
            : status === "maintenance"
            ? "bg-orange-600"
            : "bg-red-600"
        } `}
      >
        {status}
      </span>
      <header className="w-full">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2">
            <Network size={16} className="dark:text-zinc-500" />
          </p>
          <div className="flex items-center gap-2">
            {/* <span className="loader !w-3 !h-3 !border-2 !border-b-zinc-600"></span>
            <button className="px-3 gap-2 border border-zinc-900 transition-all hover:bg-zinc-900 cursor-pointer py-[0.19rem] flex items-center bg-black text-white rounded-md">
              Logs <ClipboardClock size={16} />
            </button> */}
            <button className="dark:text-zinc-400 text-zinc-500 hover:text-black transition-all dark:hover:text-white cursor-pointer">
              <Ellipsis size={20} className=" ms-4" />
            </button>
          </div>
        </div>
        <p className="dark:text-zinc-200 pt-5">{name}</p>
        <p className="text-[15px] text-zinc-600 dark:text-zinc-500">
          {firmware} / {manufacturer}
        </p>
      </header>
      <div className="border-t flex flex-wrap gap-3 w-full dark:border-zinc-900 pt-2 mt-2">
        <div className="gap-2 py-[0.19rem] flex items-center  dark:text-white rounded-full">
          <p className="font-[420]">Status</p>
          <div
            className={`w-2 h-2 animate-pulse rounded-full ${
              status === "operational"
                ? "bg-green-500 ring-2 ring-green-500/50"
                : status === "maintenance"
                ? "bg-orange-500 ring-2 ring-orange-500/50"
                : "bg-red-500 ring-2 ring-red-500/50"
            }`}
          ></div>
        </div>
        <Badge className="text-[14px] bg-transparent dark:text-white text-black border border-zinc-200 dark:border-zinc-900 px-2 font-[430] leading-none">
          Interfaces - {totalInterfaces} /{" "}
          <span className="text-green-500">{activeInterfaces}</span> /{" "}
          <span className="text-red-500">{downInterfaces}</span>
        </Badge>
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center w-full justify-between">
            <p className="dark:text-zinc-500 text-[15px]">Uso de CPU</p>
            <p className="dark:text-white">{cpuUsage}%</p>
          </div>
          <div className="flex items-center w-full justify-between">
            <p className="dark:text-zinc-500 text-[15px]">Temperatura</p>
            <p className="dark:text-white">{temperature}C</p>
          </div>
          <div className="flex items-center w-full justify-between">
            <p className="dark:text-zinc-500 text-[15px]">Última atualização</p>
            <p className="dark:text-white">2 min</p>
          </div>
        </div>
        <footer className="w-full">
          <Button className="w-full shadow-none text-base  cursor-pointer dark:hover:bg-zinc-900 bg-zinc-950 border dark:border-zinc-900 dark:text-white  hover:opacity-80">
            Detalhes <Info size={16} />
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default NetworkComponent;
