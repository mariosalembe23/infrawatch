import { Button } from "@/components/ui/button";
import React from "react";
import { Network, Plus } from "lucide-react";
import { Device } from "./Types/Network";
import NetworkComponent from "./NetworkComponents/NetWorkComponent";
import CreateDevice from "./NetworkComponents/CreateDevice";
import { ServerProps } from "./Types/Server";

const NetworkSlice: React.FC<{
  devices: Device[];
  servers: ServerProps[];
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  workspace_id: string;
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>;
}> = ({ devices, servers, workspace_id, setErrorMessage, setDevices }) => {
  const [openCreate, setOpenCreate] = React.useState<boolean>(false);

  return (
    <section className="relative h-full">
      <header>
        <div className="flex items-start gap-5 flex-wrap justify-between mb-12">
          <div>
            <h2 className="dark:text-white ret:text-4xl text-2xl font-medium pot:font-semibold">
              Aparelhos de Rede
            </h2>
            <div className="w-full ret:w-[30rem]">
              <p className="dark:text-zinc-500 text-zinc-700 font-[410]">
                Aqui você pode gerenciar e monitorar todos os seus dispositivos
                de rede, visualizar o status, logs e detalhes de cada um deles.
              </p>
            </div>
          </div>
          <div className="w-full">
            <Button
              onClick={() => setOpenCreate(true)}
              className="cursor-pointer ret:w-auto w-full py-5 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-950 shadow-none"
            >
              <Network size={14} className="text-white size-4" />
              Adicionar aparelho
            </Button>
          </div>
        </div>
      </header>
      <div className="grid mt-7 pot:grid-cols-3 ret:grid-cols-2 grid-cols-1 lal:grid-cols-5 gap-3">
        {devices.map((device, index) => (
          <NetworkComponent
            setDevices={setDevices}
            key={index}
            name={device.device_name}
            status={device.last_device?.status || "unknown"}
            firmware={device.sys_name}
            manufacturer={device.device_type}
            totalInterfaces={device.interfaces.length}
            activeInterfaces={
              device.interfaces
                .map((i) => i.status)
                .filter((status) => status === "up").length
            }
            downInterfaces={
              device.interfaces
                .map((i) => i.status)
                .filter((status) => status === "down").length
            }
            cpuUsage={device.last_device.cpu}
            temperature={device.last_device.memory}
            device={device}
          />
        ))}
      </div>

      <div className="fixed bottom-5 pot:bottom-10 end-7 pot:end-12">
        <Button
          size={"icon"}
          className="rounded-full cursor-pointer size-9 hover:bg-white hover:opacity-80 bg-white text-black"
        >
          <Plus size={18} className="text-black size-5" />
        </Button>
      </div>
      <CreateDevice
        open={openCreate}
        setOpen={setOpenCreate}
        servers={servers}
        setErrorMessage={setErrorMessage}
        mode="CREATE"
        workspace_id={workspace_id}
        setDevices={setDevices}
      />
    </section>
  );
};

export default NetworkSlice;
