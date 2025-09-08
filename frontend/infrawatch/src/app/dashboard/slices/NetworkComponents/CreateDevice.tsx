"use client";

import React, { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Info, Link2 } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { getCookie } from "cookies-next/client";
import { toast } from "sonner";
import { APIS, GenericAxiosActions } from "@/components/AppComponents/API";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ServerProps } from "../Types/Server";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Device } from "../Types/Network";

interface CreateDeviceProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  workspace_id: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  mode: "CREATE" | "EDIT";
  serverToEdit?: ServerProps | null;
  servers: ServerProps[];
}
type CreateDeviceState = {
  device_name: string;
  description: string;
  host: string;
  device_type: "ROUTER" | "SWITCH" | "FIREWALL" | "PRINTER";
  serverId: string;
};

const optionsDevice = [
  { label: "Switch", value: "SWITCH" },
  { label: "Router", value: "ROUTER" },
  { label: "Firewall", value: "FIREWALL" },
  { label: "Printer", value: "PRINTER" },
];

const CreateDevice: React.FC<CreateDeviceProps> = ({
  open,
  setOpen,
  workspace_id,
  setErrorMessage,
  mode,
  servers,
  setDevices,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedWorkType, setSelectedWorkType] = useState<string>(
    servers[0]?.id || ""
  );
  const [selectedTypeDevice, setSelectedTypeDevice] = useState<
    "SWITCH" | "ROUTER" | "FIREWALL" | "PRINTER"
  >(optionsDevice[0].value as "SWITCH" | "ROUTER" | "FIREWALL" | "PRINTER");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateDeviceState>({
    mode: "onChange",
    defaultValues: {
      device_name: "",
      description: "",
      host: "",
    },
  });

  // useEffect(() => {
  //   if (mode === "EDIT" && serverToEdit) {
  //     reset({

  //     });

  //     const timeOption = optionsDevice.find(
  //       (option) => option.value === String(serverToEdit.time_ms)
  //     );
  //     if (timeOption) {
  //       setSelectedTime(timeOption);
  //     }
  //   }
  // }, [mode, serverToEdit, reset]);

  const createEndpoint = async (data: CreateDeviceState) => {
    if (!selectedTypeDevice) {
      toast.error("Por favor, selecione um tipo de dispositivo.", {
        position: "top-center",
      });
      return;
    }

    if (!selectedWorkType) {
      toast.error("Por favor, selecione um servidor para associar.", {
        position: "top-center",
      });
      return;
    }

    try {
      setLoading(true);
      toast.loading("Cadastrando Endpoint...", {
        position: "top-center",
        id: "createEndpoint",
      });
      console.log(data, selectedTypeDevice, selectedWorkType);
      const response = await axios.post(
        APIS.CREATE_DEVICE + workspace_id,
        {
          device_name: data.device_name,
          description: data.description,
          host: data.host,
          device_type: selectedTypeDevice,
          serverId: selectedWorkType,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      if (response.status === 201 || response.status === 200) {
        toast.success("Servidor criado com sucesso!", {
          position: "top-center",
          id: "createEndpoint",
        });
        console.log(response.data);
        setDevices((prev) => [...prev, response.data]);
        setLoading(false);
        setOpen(false);
      }
    } catch (error) {
      setLoading(false);
      toast.dismiss("createEndpoint");
      GenericAxiosActions({
        error,
        message: "Erro ao criar Servidor",
        setErrorMessage,
      });
    }
  };
  console.log(selectedTypeDevice, selectedWorkType);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(740px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b flex items-center gap-2 font-medium px-6 py-4 text-base">
            <Link2 size={17} />
            {mode === "CREATE"
              ? "Adicionar Dispositivo de Rede"
              : "Editar Dispositivo de Rede"}
          </DialogTitle>
          <ScrollArea ref={contentRef} className="scrollDiv overflow-y-auto">
            <DialogDescription asChild>
              <form
                onSubmit={handleSubmit(createEndpoint)}
                className="px-6 grid grid-cols-1 gap-5 py-6"
              >
                <div className="*:not-first:mt-3">
                  <Label htmlFor={"Indentificador"} className="font-[450]">
                    Identificador(Nome)
                  </Label>
                  <Input
                    id={"Indentificador"}
                    {...register("device_name", {
                      required: "O identificador é obrigatório",
                      minLength: { value: 3, message: "Mínimo 3 caracteres" },
                      maxLength: { value: 25, message: "Máximo 25 caracteres" },
                      pattern: {
                        value: /^[a-zA-ZÀ-ÿ\s0-9 _-]+$/,
                        message:
                          "Apenas letras, números, espaços, hífens e underscores são permitidos.",
                      },
                    })}
                    className={`text-white py-5 text-base ${
                      errors.device_name
                        ? "!ring-red-500/20 !border-red-700"
                        : "border-zinc-800"
                    }`}
                    placeholder="Indetificador do Dispositivo"
                    type="text"
                  />
                  {errors.device_name && (
                    <p className="text-[14px] text-white/60 mt-1">
                      {errors.device_name.message}
                    </p>
                  )}
                </div>

                <div className="*:not-first:mt-3">
                  <Label htmlFor={"host"} className="font-[450]">
                    Host(Endereço IP)
                  </Label>
                  <Input
                    id={"host"}
                    {...register("host", {
                      required: "O host é obrigatório",
                      minLength: { value: 3, message: "Mínimo 3 caracteres" },
                      maxLength: { value: 25, message: "Máximo 25 caracteres" },
                      pattern: {
                        value:
                          /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                        message: "Endereço IP inválido.",
                      },
                    })}
                    className={`text-white py-5 text-base ${
                      errors.host
                        ? "!ring-red-500/20 !border-red-700"
                        : "border-zinc-800"
                    }`}
                    placeholder="Endereço IP do Dispositivo"
                    type="text"
                  />
                  {errors.host && (
                    <p className="text-[14px] text-white/60 mt-1">
                      {errors.host.message}
                    </p>
                  )}
                  <div className="flex justify-end">
                    <Button
                      variant={"outline"}
                      className="dark:border-zinc-900/50 flex items-center text-white text-[13px]"
                    >
                      <Info size={12} className="size-3" /> Lista de hosts de
                      teste
                    </Button>
                  </div>
                </div>

                <div className="*:not-first:mt-2">
                  <Label htmlFor={"description"}>Descrição</Label>
                  <Textarea
                    id={"description"}
                    {...register("description", {
                      required: "Descrição é obrigatória",
                      minLength: { value: 10, message: "Mínimo 10 caracteres" },
                      maxLength: {
                        value: 150,
                        message: "Máximo 200 caracteres",
                      },
                    })}
                    maxLength={150}
                    className={`text-white [resize:none]  text-base ${
                      errors.description
                        ? "!ring-red-500/20 !border-red-700"
                        : "border-zinc-800"
                    }`}
                    placeholder="Descrição do Espaço de Trabalho"
                  />
                  {errors.description && (
                    <p className="text-[14px] text-white/60 mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <div className="*:not-first:mt-2">
                  <Label htmlFor={"type_device"}>Tipo de Dispositivo</Label>
                  <Select
                    defaultValue={optionsDevice[0].label}
                    onValueChange={(value) => {
                      setSelectedTypeDevice(
                        value as "SWITCH" | "ROUTER" | "FIREWALL" | "PRINTER"
                      );
                    }}
                  >
                    <SelectTrigger
                      id="type_device"
                      className="border-zinc-800 text-base py-5 cursor-pointer"
                    >
                      <SelectValue
                        placeholder="Defina um tempo"
                        defaultValue={optionsDevice[0].label}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {optionsDevice.map((option, index) => (
                        <SelectItem
                          key={index}
                          className="text-base"
                          value={option.label}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="*:not-first:mt-2">
                  <Label htmlFor={"serverId"}>Associar ao Servidor</Label>
                  <Select
                    defaultValue={servers[0]?.id}
                    onValueChange={(value) => {
                      setSelectedWorkType(value);
                    }}
                  >
                    <SelectTrigger
                      id="serverId"
                      className="border-zinc-800 text-base py-5 cursor-pointer"
                    >
                      <SelectValue
                        placeholder="Defina um tempo"
                        defaultValue={servers[0]?.id}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {servers.map((server, index) => (
                        <SelectItem
                          key={index}
                          className="text-base"
                          value={server?.id}
                        >
                          {server.servername}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter className="border-t px-1 mt-3 pt-4 sm:items-center">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        if (mode === "CREATE") reset();
                      }}
                      variant="outline"
                      className="py-5"
                    >
                      Cancelar
                    </Button>
                  </DialogClose>

                  <Button
                    type="submit"
                    className="py-5 bg-cyan-600/40 border border-cyan-700 hover:bg-cyan-600/50 cursor-pointer text-white"
                  >
                    {loading && (
                      <span className="loader !w-4 !h-4 !border-2 !border-b-white !border-white/40"></span>
                    )}
                    Registar dispositivo
                  </Button>
                </DialogFooter>
              </form>
            </DialogDescription>
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDevice;
