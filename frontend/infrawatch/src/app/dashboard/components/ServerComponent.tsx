import { ClipboardClock, Info } from "lucide-react";
import DetailsDialog from "../slices/DetailsDialog";

interface IServerComponent {
  nameServer: string;
  status: "online" | "offline";
}

const ServerComponent: React.FC<IServerComponent> = ({
  nameServer,
  status,
}) => {
  return (
    <div
      className={` border border-zinc-900 px-5 py-3 bg-zinc-950 rounded-lg flex-wrap items-start flex justify-between`}
    >
      <div>
        <p className="text-white text-lg font-medium">
          {nameServer}{" "}
          <span className="text-zinc-500 font-[410] text-[15px]">
            / há 2 horas
          </span>
        </p>
        <div className=" gap-2 py-[0.19rem] -mt-1 flex items-center  text-white rounded-full">
          <p className="font-[420]">Status</p>
          <div
            className={`w-2 h-2 animate-pulse rounded-full ${
              status === "online"
                ? "bg-green-500 ring-2 ring-green-500/50"
                : "bg-red-500 ring-2 ring-red-500/50"
            }`}
          ></div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <button className="px-3 gap-2 border border-zinc-900 transition-all hover:bg-zinc-900 cursor-pointer py-[0.19rem] flex items-center bg-black text-white rounded-md">
            Logs <ClipboardClock size={16} />
          </button>
          <DetailsDialog title={`Detalhes - ${nameServer}`} triggerText="Detalhes">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-zinc-400">Status:</span>
                <span className={status === "online" ? "text-green-500" : "text-red-500"}>
                  {status === "online" ? "Online" : "Offline"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Última atualização:</span>
                <span className="text-white">há 2 horas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">CPU:</span>
                <span className="text-white">45%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">RAM:</span>
                <span className="text-white">2.1GB / 8GB</span>
              </div>
            </div>
          </DetailsDialog>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[15px] text-zinc-500 pot:justify-start justify-end lal:justify-end">
          <p>Processando...</p>
          <span className="loader !w-3 !h-3 !border-2 !border-b-zinc-600"></span>
        </div>
      </div>
    </div>
  );
};

export default ServerComponent;
