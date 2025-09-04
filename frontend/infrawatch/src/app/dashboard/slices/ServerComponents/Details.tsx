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
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useRef } from "react";
import { ServerProps } from "../Types/Server";

const BetweenDiv = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-between w-full">{children}</div>
  );
};

const ColDiv = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col items-start w-full">{children}</div>;
};

const DetailsServer: React.FC<{
  openDetails: boolean;
  setOpenDetails: React.Dispatch<React.SetStateAction<boolean>>;
  server: ServerProps;
}> = ({ openDetails, setOpenDetails, server }) => {
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
    <Dialog open={openDetails} onOpenChange={setOpenDetails}>
      <DialogContent className="flex dark:bg-[#060607] flex-col  dark:border-zinc-900  gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b font-medium dark:border-zinc-900 dark:text-white px-6 py-4 text-base">
            Detalhes - Servidor {server.servername}
          </DialogTitle>
          <ScrollArea
            ref={contentRef}
            onScroll={handleScroll}
            className="overflow-y-auto scrollDiv"
          >
            <DialogDescription asChild>
              <DialogDescription asChild>
                <div className="pt-7 pb-10 font-mono  px-7 flex flex-col gap-5">
                  <ColDiv>
                    <p className="dark:text-cyan-500 text-black  font-[450] ">
                      Nome do Servidor
                    </p>
                    <p className="text-base dark:text-white text-zinc-700 text-[15px]">
                      {server.servername}
                    </p>
                  </ColDiv>
                  <BetweenDiv>
                    <p className="dark:text-cyan-500 text-black  font-[450] text-[14px]">
                      Indetificador
                    </p>
                    <p className="text-base dark:text-white text-zinc-700 text-[15px]">
                      {server.server_idenfier}
                    </p>
                  </BetweenDiv>
                  <BetweenDiv>
                    <p className="dark:text-cyan-500 text-black  font-[450] text-[14px]">
                      Uptime
                    </p>
                    <p className="text-base dark:text-white text-zinc-700 text-[15px]">
                      {server.last_metrics.last_boot}
                    </p>
                  </BetweenDiv>
                  <BetweenDiv>
                    <p className="dark:text-cyan-500 text-black  font-[450] text-[14px]">
                      Núcleos Físicos
                    </p>
                    <p className="text-base dark:text-white text-zinc-700 text-[15px]">
                      {server.last_metrics.fisical_nucleos}
                    </p>
                  </BetweenDiv>
                  <BetweenDiv>
                    <p className="dark:text-cyan-500 text-black  font-[450] text-[14px]">
                      Núcleos Lógicos
                    </p>
                    <p className="text-base dark:text-white text-zinc-700 text-[15px]">
                      {server.last_metrics.logical_nucleos || "N/A"}
                    </p>
                  </BetweenDiv>
                  <ColDiv>
                    <p className="dark:text-cyan-500 text-black  font-[450] text-[14px]">
                      Uso de CPU
                    </p>
                    <p className="text-base text-[15px] dark:text-white text-zinc-700">
                      {server.last_metrics.cpu_usage}%
                    </p>
                  </ColDiv>
                  <BetweenDiv>
                    <p className="dark:text-cyan-500 text-black  font-[450] text-[14px]">
                      Frequência do CPU
                    </p>
                    <p className="text-base text-[15px] dark:text-white text-zinc-700">
                      {server.last_metrics.cpu_frequency}
                    </p>
                  </BetweenDiv>
                  <ColDiv>
                    <p className="dark:text-cyan-500 text-black  font-[450] text-[14px]">
                      RAM
                    </p>
                    <p className="text-base  text-[15px]  dark:text-white text-zinc-700">
                      Total: {server.last_metrics.ram_usage_total}/Usada:{" "}
                      {server.last_metrics.ram_usage_available}/Livre:{" "}
                      {server.last_metrics.ram_usage_free}
                    </p>
                  </ColDiv>
                  <ColDiv>
                    <p className="dark:text-cyan-500 text-black  font-[450] text-[14px]">
                      SWAP
                    </p>
                    <p className="text-base  text-[15px]  dark:text-white text-zinc-700">
                      Total: {server.last_metrics.swap_usage_total}/Usada:{" "}
                      {server.last_metrics.swap_usage_available}/Livre:{" "}
                      {server.last_metrics.swap_usage_free}
                    </p>
                  </ColDiv>
                  <BetweenDiv>
                    <p className="dark:text-cyan-500 text-black  font-[450] text-[14px]">
                      Dados Enviados
                    </p>
                    <p className="text-base text-[15px] dark:text-white text-zinc-700">
                      {server.last_metrics.sendData}
                    </p>
                  </BetweenDiv>
                  <BetweenDiv>
                    <p className="dark:text-cyan-500 text-black  font-[450] text-[14px]">
                      Dados Recebidos
                    </p>
                    <p className="text-base text-[15px] dark:text-white text-zinc-700">
                      {server.last_metrics.receiveData}
                    </p>
                  </BetweenDiv>
                  <ColDiv>
                    <p className="dark:text-cyan-500 text-black  font-[450] text-[14px]">
                      Interfaces Activadas
                    </p>
                    <p className="text-base  text-[15px]  dark:text-white text-zinc-700">
                      {server.last_metrics.activated_interfaces || "N/A"}
                    </p>
                  </ColDiv>
                  <BetweenDiv>
                    <p className="dark:text-cyan-500 text-black  font-[450] text-[14px]">
                      Temperatura da CPU
                    </p>
                    <p className="text-base text-[15px] dark:text-white text-zinc-700">
                      {server.last_metrics.cpu_temperature || "N/A"}
                    </p>
                  </BetweenDiv>
                  {server.last_metrics.battery_level !== "unknown" && (
                    <ColDiv>
                      <p className="dark:text-cyan-500 text-black  font-[450] text-[14px]">
                        Bateria
                      </p>
                      <p className="text-base text-[15px]  dark:text-white text-zinc-700">
                        {server.last_metrics.battery_plugged === "false"
                          ? "Desconectado da fonte de alimentação"
                          : "Conectado à fonte de alimentação "}
                        <span
                          className={`inline-flex w-2 h-2 rounded-full ms-2 ${
                            server.last_metrics.battery_plugged === "false"
                              ? "bg-red-500"
                              : "bg-green-500"
                          } `}
                        ></span>
                      </p>
                      <p className="text-base text-[15px] dark:text-white text-zinc-700">
                        Porcentagem: {server.last_metrics.battery_level}
                      </p>
                    </ColDiv>
                  )}
                </div>
              </DialogDescription>
            </DialogDescription>
          </ScrollArea>
        </DialogHeader>
        <DialogFooter className="border-t dark:border-zinc-900 px-6 py-4 sm:items-center">
          <DialogClose asChild>
            <Button type="button" className="cursor-pointer">
              OK
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsServer;
