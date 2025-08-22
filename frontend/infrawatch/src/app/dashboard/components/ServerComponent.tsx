import React, { useRef } from "react";
import { Ellipsis, ZapIcon } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface IServerComponent {
  nameServer: string;
  status: "online" | "offline";
  index: number;
  lastIndex?: number;
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
  index,
  lastIndex,
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
      className={` dark:border-zinc-900 px-5 py-3 dark:bg-zinc-950 ${
        index === 1
          ? "rounded-t-lg border"
          : index === lastIndex
          ? "rounded-b-lg border-b border-x"
          : "border-b border-x"
      }  grid grid-cols-2 gap-y-5 pot:grid-cols-4 items-center`}
    >
      <div>
        <p className="dark:text-white text-lg font-medium">
          {nameServer}{" "}
          <Badge className="dark:bg-cyan-500/40 bg-cyan-600 text-white  border dark:border-cyan-200/50">
            <ZapIcon
              className="-ms-0.5 opacity-60"
              size={12}
              aria-hidden="true"
            />
            25% CPU
          </Badge>
        </p>
        <p className="dark:text-zinc-500 text-zinc-600 uppercase font-[450] text-[14.77px]">
          #chdwd45
        </p>
      </div>
      <div className="pot:order-2 order-3 text-end">
        <div className="flex  items-center gap-2 justify-start pot:justify-end">
          <p className="dark:text-white">Status</p>
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-sky-500"></span>
          </span>
        </div>
        <p className="text-zinc-500  text-[15px]">2min/5seg</p>
      </div>

      <div className="pot:order-3 order-4">
        <div className="flex flex-col items-end justify-end gap-1">
          <p className="dark:text-zinc-100 flex gap-2 items-center">
            Alerta
            <Badge className="bg-red-500/20 dark:text-white text-red-800">
              <ZapIcon
                className="-ms-0.5 opacity-60"
                size={12}
                aria-hidden="true"
              />
              0
            </Badge>
          </p>

          <p className="dark:text-zinc-500 text-zinc-600 text-[15px]">
            há 2:30 min
          </p>
        </div>
        {/* <div className="mt-2 flex items-center gap-2 text-[15px] text-zinc-500 justify-start  lal:justify-end">
          <p>Processando...</p>
          <span className="loader !w-3 !h-3 !border-2 !border-b-zinc-600"></span>
        </div> */}
      </div>
      <div className="flex pot:order-4 order-2 items-center justify-end">
        <div className="flex items-center gap-3">
          <p className="dark:text-zinc-300 text-nowrap">Mário Salembe</p>
          <Image
            src={"/app/male.svg"}
            width={100}
            height={100}
            alt="User Avatar"
            className="rounded-full size-7"
          />
        </div>
        <button className="dark:text-zinc-400 text-zinc-500 hover:text-black transition-all dark:hover:text-white cursor-pointer">
          <Ellipsis size={20} className=" ms-4" />
        </button>
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
