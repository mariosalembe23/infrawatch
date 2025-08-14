import React, { useRef } from "react";
import { ClipboardClock, Info } from "lucide-react";
import LogSheet from "./LogSheet";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface IServerComponent {
  nameServer: string;
  status: "online" | "offline";
}

const BetweenDiv = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-between w-full">{children}</div>
  );
};

const ColDiv = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col items-start w-full">{children}</div>;
};

const ServerComponent: React.FC<IServerComponent> = ({
  nameServer,
  status,
}) => {
  const [openLogs, setOpenLogs] = React.useState(false);
  const [openDetails, setOpenDetails] = React.useState(false);

  const [hasReadToBottom, setHasReadToBottom] = React.useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const content = contentRef.current;
    if (!content) return;

    const scrollPercentage =
      content.scrollTop / (content.scrollHeight - content.clientHeight);
    if (scrollPercentage >= 0.99 && !hasReadToBottom) {
      setHasReadToBottom(true);
    }
  };

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
          <button
            onClick={() => setOpenLogs(true)}
            className="px-3 gap-2 border border-zinc-900 transition-all hover:bg-zinc-900 cursor-pointer py-[0.19rem] flex items-center bg-black text-white rounded-md"
          >
            Logs <ClipboardClock size={16} />
          </button>
          <button
            onClick={() => setOpenDetails(true)}
            className="px-3 gap-2 border border-zinc-900 transition-all hover:bg-zinc-900 cursor-pointer py-[0.19rem] flex items-center bg-black text-white rounded-md"
          >
            Detalhes <Info size={16} />
          </button>
          {/* <DetailsDialog
            title={`Detalhes - Servidor ${nameServer}`}
            triggerText="Detalhes"
          >
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-zinc-400">Status:</span>
                <span
                  className={
                    status === "online" ? "text-green-500" : "text-red-500"
                  }
                >
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
          </DetailsDialog> */}
        </div>
        <div className="mt-2 flex items-center gap-2 text-[15px] text-zinc-500 justify-start  lal:justify-end">
          <p>Processando...</p>
          <span className="loader !w-3 !h-3 !border-2 !border-b-zinc-600"></span>
        </div>
      </div>

      <LogSheet
        openLogs={openLogs}
        setOpenLogs={setOpenLogs}
        nameServer={nameServer}
      />

      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent className="flex bg-[#060607] flex-col  border-zinc-900  gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-xl [&>button:last-child]:top-3.5">
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="border-b font-medium border-zinc-900 text-white px-6 py-4 text-base">
              Detalhes - Servidor {nameServer}
            </DialogTitle>
            <div
              ref={contentRef}
              onScroll={handleScroll}
              className="overflow-y-auto"
            >
              <DialogDescription asChild>
                <DialogDescription asChild>
                  <div className="pt-7 pb-10 font-mono  px-7 flex flex-col gap-5">
                    <ColDiv>
                      <p className="text-cyan-500  font-[450] ">
                        Nome do Servidor
                      </p>
                      <p className="text-base text-white text-[15px]">
                        {nameServer}
                      </p>
                    </ColDiv>
                    <BetweenDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        Versão
                      </p>
                      <p className="text-base text-white text-[15px]">
                        Beta #kde 1.0.0
                      </p>
                    </BetweenDiv>
                    <BetweenDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        Uptime
                      </p>
                      <p className="text-base text-white text-[15px]">
                        Há 2:30 min
                      </p>
                    </BetweenDiv>
                    <BetweenDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        Núcleos Físicos
                      </p>
                      <p className="text-base text-white text-[15px]">10</p>
                    </BetweenDiv>
                    <BetweenDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        Núcleos Lógicos
                      </p>
                      <p className="text-base text-white text-[15px]">15</p>
                    </BetweenDiv>
                    <ColDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        Uso de CPU
                      </p>
                      <p className="text-base text-[15px] text-white">20%</p>
                    </ColDiv>
                    <BetweenDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        Frequência do CPU
                      </p>
                      <p className="text-base text-[15px] text-white">
                        2.5 GHz
                      </p>
                    </BetweenDiv>
                    <ColDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        RAM
                      </p>
                      <p className="text-base  text-[15px]  text-white">
                        Total: 16GB/Usada: 4GB/Livre: 12GB
                      </p>
                    </ColDiv>
                    <ColDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        SWAP
                      </p>
                      <p className="text-base  text-[15px]  text-white">
                        Total: 16GB/Usada: 4GB/Livre: 12GB
                      </p>
                    </ColDiv>
                    <BetweenDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        Dados Enviados
                      </p>
                      <p className="text-base text-[15px] text-white">
                        1.2 GB/s
                      </p>
                    </BetweenDiv>
                    <BetweenDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        Dados Recebidos
                      </p>
                      <p className="text-base text-[15px] text-white">
                        800 MB/s
                      </p>
                    </BetweenDiv>
                    <ColDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        Interfaces Activadas
                      </p>
                      <p className="text-base  text-[15px]  text-white">12</p>
                    </ColDiv>
                    <BetweenDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        Temperatura da CPU
                      </p>
                      <p className="text-base text-[15px] text-white">45°C</p>
                    </BetweenDiv>
                    <ColDiv>
                      <p className="text-cyan-500  font-[450] text-[14px]">
                        Bateria
                      </p>
                      <p className="text-base  text-[15px]  text-white">
                        Conectado à fonte de alimentação{" "}
                        <span className="inline-flex w-2 h-2 rounded-full bg-red-500"></span>
                      </p>
                      <p className="text-base text-[15px] text-white">
                        Porcentagem: 50%
                      </p>
                    </ColDiv>
                  </div>
                </DialogDescription>
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className="border-t border-zinc-900 px-6 py-4 sm:items-center">
            <DialogClose asChild>
              <Button type="button" className="cursor-pointer">
                OK
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServerComponent;
