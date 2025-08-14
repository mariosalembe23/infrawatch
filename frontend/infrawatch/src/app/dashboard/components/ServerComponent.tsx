import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import DetailsDialog from "../slices/DetailsDialog";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  ClipboardClock,
  SearchIcon,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface IServerComponent {
  nameServer: string;
  status: "online" | "offline";
}

const ServerComponent: React.FC<IServerComponent> = ({
  nameServer,
  status,
}) => {
  const [openLogs, setOpenLogs] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

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
          <DetailsDialog
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
          </DetailsDialog>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[15px] text-zinc-500 justify-start  lal:justify-end">
          <p>Processando...</p>
          <span className="loader !w-3 !h-3 !border-2 !border-b-zinc-600"></span>
        </div>
      </div>

      <Sheet open={openLogs} onOpenChange={setOpenLogs}>
        <SheetContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          side="bottom"
          className="bg-[#060607] !gap-0 border-zinc-900 h-[95%]"
        >
          <SheetHeader className="border-b !m-0 border-zinc-900">
            <SheetTitle className="font-medium text-white uppercase">
              Logs - Servidor {nameServer}
            </SheetTitle>
            <SheetDescription className="-mt-2">
              Veja os logs do servidor {nameServer} abaixo.
            </SheetDescription>
          </SheetHeader>
          <div className="h-full overflow-y-auto w-full relative">
            <header className="flex bg-[#060607] sticky flex-wrap  top-0 left-0 right-0 border-b border-zinc-900 py-5 px-5 text-white  items-center justify-between gap-5">
              <div className="flex items-center flex-wrap justify-start gap-3">
                <div className="relative ret:w-auto w-full">
                  <Input
                    id={""}
                    className="peer ps-9 pe-9 ret:w-auto w-full  text-base border-zinc-900 focus:!ring-zinc-700/50 focus:!border-zinc-600"
                    placeholder="Search..."
                    type="search"
                  />
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                    <SearchIcon size={16} />
                  </div>
                  <button
                    className="text-muted-foreground/80 hover:text-white cursor-pointer focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Submit search"
                    type="submit"
                  >
                    <ArrowRightIcon size={16} aria-hidden="true" />
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="default"
                        id="date"
                        className="w-48  justify-between font-medium cursor-pointer"
                      >
                        {date ? date.toLocaleDateString() : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        startMonth={
                          new Date(
                            new Date().getFullYear(),
                            new Date().getMonth() - 1,
                            new Date().getDate() - 1
                          )
                        }
                        endMonth={
                          new Date(
                            new Date().getFullYear() + 5,
                            new Date().getMonth() + 1,
                            new Date().getDate() + 1
                          )
                        }
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setDate(date);
                          setOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex text-white items-center gap-2">
                  <Checkbox id={"info"} className="border-zinc-600" />
                  <Label htmlFor={"info"} className="text-green-400">
                    INFO
                  </Label>
                </div>
                <div className="flex text-white items-center gap-2">
                  <Checkbox id={"warning"} className="border-zinc-600" />
                  <Label htmlFor={"warning"} className="text-yellow-400">
                    WARNING
                  </Label>
                </div>
                <div className="flex text-white items-center gap-2">
                  <Checkbox id={"error"} className="border-zinc-600" />
                  <Label htmlFor={"error"} className="text-red-400">
                    ERROR
                  </Label>
                </div>
              </div>
            </header>
            <div className="grid flex-1 py-6 auto-rows-min gap-6 px-4">
              <div className="font-mono text-sm space-y-1">
                <p className="text-green-400">
                  [INFO] Servevidor levantado com sucesso{" "}
                  <span className="text-white">12/10/2023 14:30:00</span>
                </p>
                <p className="text-yellow-400">
                  [WARN] Alto uso da CPU detectado{" "}
                  <span className="text-white">12/10/2023 14:30:00</span>
                </p>
                <p className="text-red-400">
                  [ERROR] Conexão perdida{" "}
                  <span className="text-white">12/10/2023 14:30:00</span>
                </p>
              </div>
              <div className="font-mono text-sm space-y-1">
                <p className="text-green-400">
                  [INFO] Servevidor levantado com sucesso{" "}
                  <span className="text-white">12/10/2023 14:30:00</span>
                </p>
                <p className="text-yellow-400">
                  [WARN] Alto uso da CPU detectado{" "}
                  <span className="text-white">12/10/2023 14:30:00</span>
                </p>
                <p className="text-red-400">
                  [ERROR] Conexão perdida{" "}
                  <span className="text-white">12/10/2023 14:30:00</span>
                </p>
              </div>
              <div className="font-mono text-sm space-y-1">
                <p className="text-green-400">
                  [INFO] Servevidor levantado com sucesso{" "}
                  <span className="text-white">12/10/2023 14:30:00</span>
                </p>
                <p className="text-yellow-400">
                  [WARN] Alto uso da CPU detectado{" "}
                  <span className="text-white">12/10/2023 14:30:00</span>
                </p>
                <p className="text-red-400">
                  [ERROR] Conexão perdida{" "}
                  <span className="text-white">12/10/2023 14:30:00</span>
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ServerComponent;
