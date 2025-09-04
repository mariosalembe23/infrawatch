import React from "react";
import {
  Braces,
  ChartArea,
  Check,
  Copy,
  Ellipsis,
  Info,
  OctagonAlert,
  Settings2,
  ToggleLeft,
  ZapIcon,
} from "lucide-react";
import LogSheet from "./LogSheet";

import { Badge } from "@/components/ui/badge";
import { ServerProps } from "../slices/Types/Server";
import { DataMode } from "../slices/Types/DataMod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DetailsServer from "../slices/ServerComponents/Details";

interface IServerComponent {
  server: ServerProps;
  index: number;
  lastIndex: number;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}

function isEmpty(obj: object) {
  return Object.keys(obj).length === 0;
}

const ServerComponent: React.FC<IServerComponent> = ({
  index,
  lastIndex,
  setSelectedItem,
  server,
}) => {
  const [openLogs, setOpenLogs] = React.useState(false);
  const [openDetails, setOpenDetails] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  return (
    <div
      className={` dark:border-zinc-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-950/20 px-5 py-3 dark:bg-zinc-950 ${
        index === 1
          ? "rounded-t-lg border"
          : index === lastIndex
          ? "rounded-b-lg border-b border-x"
          : "border-b border-x"
      }  grid grid-cols-2 gap-y-5 pot:grid-cols-4 items-center`}
    >
      <div>
        <p className="dark:text-white text-base font-[450]">
          {server.servername}{" "}
        </p>
        <div className="flex items-center gap-2">
          <p className="dark:text-zinc-500 text-zinc-600 text-[15px]">{server.id.slice(0, 8)}+</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(server.id);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="cursor-pointer transition-all hover:opacity-50"
          >
            {!copied ? (
              <Copy size={16} className="dark:text-zinc-100 text-zinc-900" />
            ) : (
              <Check
                size={16}
                className="dark:text-zinc-100 text-zinc-900"
              />
            )}
          </button>
        </div>
      </div>
      <div className="pot:order-2 order-3 text-start pot:text-end">
        <div className="flex items-center gap-2 justify-start pot:justify-end">
          <p className="dark:text-white">Status</p>
          <span className="relative flex size-2">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                server.is_busy ? "bg-sky-400" : "bg-zinc-500"
              }  opacity-75`}
            ></span>
            <span
              className={`relative inline-flex size-2 rounded-full ${
                server.is_busy ? "bg-sky-400" : "bg-zinc-500"
              } bg-sky-500`}
            ></span>
          </span>
        </div>
        <p className="text-zinc-500 leading-none  text-[15px]">
          {server.is_busy ? "Ocioso" : "Desconectado"}
        </p>
      </div>

      <div className="pot:order-3 order-4">
        <div className="flex flex-col items-end justify-end gap-1">
          <p className="dark:text-zinc-100 flex gap-1 items-center">
            <ZapIcon className=" opacity-60" size={12} aria-hidden="true" />
            Deploys
          </p>
          <Badge className="bg-red-500/20 dark:text-white text-red-800">
            <OctagonAlert
              className=" opacity-60"
              size={12}
              aria-hidden="true"
            />{" "}
            Alertas 0
          </Badge>
        </div>
      </div>
      <div className="flex pot:order-4 order-2 items-center justify-end">
        <div className="flex items-center gap-3">
          <p className="dark:text-zinc-400 text-zinc-700 text-[15px]">
            há {DataMode(server.created_at)} por msalembe
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="dark:text-zinc-400 text-zinc-500 hover:text-black transition-all dark:hover:text-white cursor-pointer">
              <Ellipsis size={20} className=" ms-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-40 me-5">
            <DropdownMenuItem
              disabled={isEmpty(server.last_metrics)}
              className="cursor-pointer"
              onClick={() => setOpenDetails(true)}
            >
              <Info size={16} className="opacity-60" aria-hidden="true" />
              Detalhes
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isEmpty(server.last_metrics)}
              className="cursor-pointer"
              onClick={() => setOpenDetails(true)}
            >
              <Braces size={16} className="opacity-60" aria-hidden="true" />
              Todas as métricas
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isEmpty(server.last_metrics)}
              className="cursor-pointer"
              onClick={() => setOpenDetails(true)}
            >
              <Settings2 size={16} className="opacity-60" aria-hidden="true" />
              Conf. de métricas
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isEmpty(server.last_metrics)}
              className="cursor-pointer"
              onClick={() =>
                setSelectedItem && setSelectedItem(server.id)
              }
            >
              <ChartArea size={16} className="opacity-60" aria-hidden="true" />
              Gráficos de desempenho
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setOpenDetails(true)}
            >
              <ToggleLeft size={16} className="opacity-60" aria-hidden="true" />
              Desativar monitoramento
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isEmpty(server.last_metrics)}
              className="disabled:cursor-not-allowed cursor-pointer !text-red-700 dark:!text-red-300"
              onClick={() => setOpenDetails(true)}
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

      <LogSheet
        openLogs={openLogs}
        setOpenLogs={setOpenLogs}
        nameServer={server.servername}
      />

      <DetailsServer
        openDetails={openDetails}
        setOpenDetails={setOpenDetails}
        server={server}
      />
    </div>
  );
};

export default ServerComponent;
