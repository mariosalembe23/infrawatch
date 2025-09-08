import React, { useEffect } from "react";
import { EndpointProps } from "./Types/Endpoint";
import { Device } from "./Types/Network";
import { ServerProps } from "./Types/Server";
import { Server, ToggleRight, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { enableMonitoring } from "./Types/DataMod";

interface UnmonitoredSliceProps {
  servers: ServerProps[];
  endpoints: EndpointProps[];
  devices: Device[];
  setServer: React.Dispatch<React.SetStateAction<ServerProps[]>>;
  setEndpoint: React.Dispatch<React.SetStateAction<EndpointProps[]>>;
  setDevice: React.Dispatch<React.SetStateAction<Device[]>>;
  setErrorMessage?: React.Dispatch<React.SetStateAction<string>>;
}

const UnmonitoredSlice: React.FC<UnmonitoredSliceProps> = ({
  servers,
  endpoints,
  devices,
  setErrorMessage,
  setServer,
  setEndpoint,
  setDevice,
}) => {
  const [uniqueStruture, setUniqueStruture] = React.useState<
    {
      name: string;
      type: "server" | "endpoint" | "device";
      created_at: string;
      username: string;
      id: string;
    }[]
  >([]);
  const [activeMonitoring, setActiveMonitoring] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<{
    type: "server" | "endpoint" | "device";
    id: string;
  } | null>(null);

  useEffect(() => {
    const combined = [
      ...servers.map((srv) => ({
        name: srv.servername,
        type: "server" as const,
        created_at: srv.created_at,
        username: srv?.username || "unknown",
        id: srv.id,
      })),
      ...endpoints.map((ep) => ({
        name: ep.identifier,
        type: "endpoint" as const,
        created_at: ep.created_at,
        username: ep.username || "unknown",
        id: ep.id,
      })),
      ...devices.map((dev) => ({
        name: dev.device_name,
        type: "device" as const,
        created_at: dev.created_at,
        username: dev?.username || "unknown",
        id: dev.id,
      })),
    ];

    setUniqueStruture(combined);
  }, [servers, endpoints, devices]);

  const handleActivateMonitoring = async (
    id: string,
    type: "server" | "endpoint" | "device"
  ) => {
    const safeSetErrorMessage = setErrorMessage ?? (() => {});
    if (type === "server") {
      await enableMonitoring(
        id,
        type,
        setServer,
        safeSetErrorMessage,
        setLoading,
        true
      );
    } else if (type === "endpoint") {
      await enableMonitoring(
        id,
        type,
        setEndpoint,
        safeSetErrorMessage,
        setLoading,
        true
      );
    } else if (type === "device") {
      await enableMonitoring(
        id,
        type,
        setDevice,
        safeSetErrorMessage,
        setLoading,
        true
      );
    }

    setActiveMonitoring(false);
  };

  return (
    <section>
      <header>
        <div className="flex items-start gap-5 flex-wrap justify-between mb-10">
          <div>
            <h2 className="dark:text-white ret:text-4xl text-2xl font-medium pot:font-semibold">
              Aplicações Desmonitoradas
            </h2>
            <div className="w-full ret:w-[30rem]">
              <p className="dark:text-zinc-500 text-zinc-700 font-[410]">
                Aqui você pode gerenciar e monitorar todas as suas aplicações
                que deixaram de ser monitoradas, visualizar o status, logs e
                detalhes de cada uma delas.
              </p>
            </div>
          </div>{" "}
        </div>
      </header>
      <div className="mt-10 grid grid-cols-1">
        {uniqueStruture.length === 0 ? (
          <p className="dark:text-zinc-500 text-zinc-700 font-[410]">
            Não há aplicações desmonitoradas no momento. Todas as suas
            aplicações estão sendo monitoradas com sucesso!
          </p>
        ) : (
          uniqueStruture.map((item, index) => (
            <div
              key={index}
              className={`dark:border-zinc-900 ${
                index == 0
                  ? "border"
                  : index === uniqueStruture.length - 1
                  ? "border-x border-b"
                  : "border-x border-t"
              }   flex justify-between items-center flex-wrap gap-4 px-5 py-3 dark:bg-zinc-950`}
            >
              <header>
                <h2>
                  <Server className="inline mb-1 mr-2 size-4 dark:text-white" />
                  {item.name}{" "}
                  <span className="text-zinc-500 capitalize">
                    [{item.type}]
                  </span>
                </h2>
              </header>
              <footer className="flex items-center justify-end gap-5">
                <p className="dark:text-zinc-400 text-[15px] text-zinc-700">
                  {new Date().toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}{" "}
                  {""}({item.username})
                </p>
                <Button
                  onClick={() => {
                    setSelectedItem({ id: item.id, type: item.type });
                    setActiveMonitoring(true);
                  }}
                  variant={"outline"}
                  size={"sm"}
                >
                  Monitorar
                  <ToggleRight className="size-4 " />
                </Button>
              </footer>
            </div>
          ))
        )}
      </div>
      <AlertDialog open={activeMonitoring} onOpenChange={setActiveMonitoring}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-medium text-base">
              Deseja voltar a monitorar esta aplicação?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá reativar o monitoramento e você começará a receber
              novamente alertas e notificações relacionadas a esta aplicação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <Button
              disabled={loading}
              onClick={() => {
                if (selectedItem) {
                  handleActivateMonitoring(selectedItem.id, selectedItem.type);
                }
              }}
              className="py-4 bg-red-600/40 border border-red-700 hover:bg-red-600/50 cursor-pointer text-red-800 dark:text-white"
            >
              <ToggleRight size={18} className="" />
              Sim, monitorar novamente
              {loading && (
                <span className="loader !w-3 !h-3 !border-2 !border-b-white !border-white/40"></span>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default UnmonitoredSlice;
