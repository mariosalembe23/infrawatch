"use client";

import React, { useEffect, useRef, useState } from "react";

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
import { Server } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { getCookie } from "cookies-next/client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APIS, GenericAxiosActions } from "@/components/AppComponents/API";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ServerProps } from "../Types/Server";
import { Textarea } from "@/components/ui/textarea";

const optionsTime = [
  { label: "2 minuto", value: "120000" },
  {
    label: "5 minutos",
    value: "300000",
  },
  { label: "10 minutos", value: "600000" },
  { label: "30 minutos", value: "1800000" },
  { label: "1 hora", value: "3600000" },
];

interface CreateEndpointProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setServers: React.Dispatch<React.SetStateAction<ServerProps[]>>;
  workspace_id: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  mode: "CREATE" | "EDIT";
  serverToEdit?: ServerProps | null;
}
type CreateEndpointState = {
  identifier: string;
  url: string;
  description: string;
};

const CreateEndpoint: React.FC<CreateEndpointProps> = ({
  open,
  setOpen,
  setServers,
  workspace_id,
  setErrorMessage,
  mode,
  serverToEdit,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<{
    label: string;
    value: string;
  }>(optionsTime[0]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateEndpointState>({
    mode: "onChange",
    defaultValues: {
      url: "",
      description: "",
      identifier: "",
    },
  });

  // useEffect(() => {
  //   if (mode === "EDIT" && serverToEdit) {
  //     reset({

  //     });

  //     const timeOption = optionsTime.find(
  //       (option) => option.value === String(serverToEdit.time_ms)
  //     );
  //     if (timeOption) {
  //       setSelectedTime(timeOption);
  //     }
  //   }
  // }, [mode, serverToEdit, reset]);

  const createWorkspace = async (data: CreateEndpointState) => {
    if (!selectedTime.value) {
      toast.error("Por favor, selecione um intervalo de verificação.");
      return;
    }

    // try {
    //   setLoading(true);
    //   toast.loading("Criando Servidor...", {
    //     position: "top-center",
    //     id: "createServer",
    //   });
    //   const response = await axios.post(
    //     APIS.CREATE_SERVER + workspace_id,
    //     {
    //       servername: data.servername,
    //       identifier: data.identifier,
    //       time_ms: parseInt(selectedTime.value, 10),
    //     },
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${getCookie("token")}`,
    //       },
    //     }
    //   );
    //   console.log("Response: ", response.data);
    //   setServers((prev) => [...prev, response.data]);
    //   if (response.status === 201) {
    //     toast.success("Servidor criado com sucesso!", {
    //       position: "top-center",
    //       id: "createServer",
    //     });
    //     setLoading(false);
    //     setOpen(false);
    //   }
    // } catch (error) {
    //   setLoading(false);
    //   toast.dismiss("createServer");
    //   GenericAxiosActions({
    //     error,
    //     message: "Erro ao criar Servidor",
    //     setErrorMessage,
    //   });
    // }
  };

  const updateWorkspace = async (data: CreateEndpointState) => {
    if (!serverToEdit) return;
    if (!selectedTime.value) {
      toast.error("Por favor, selecione um intervalo de verificação.");
      return;
    }

    // try {
    //   setLoading(true);
    //   const response = await axios.put(
    //     APIS.EDIT_SERVER + serverToEdit.id,
    //     {
    //       servername: data.servername,
    //       identifier: data.identifier,
    //       time_ms: parseInt(selectedTime.value, 10),
    //     },
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${getCookie("token")}`,
    //       },
    //     }
    //   );

    //   setServers((prev) =>
    //     prev.map((srv) => (srv.id === serverToEdit.id ? response.data : srv))
    //   );
    //   if (response.status === 200) {
    //     toast.success("Servidor editado com sucesso!", {
    //       position: "top-right",
    //     });
    //     setLoading(false);
    //     setOpen(false);
    //   }
    // } catch (error) {
    //   setLoading(false);
    //   GenericAxiosActions({
    //     error,
    //     message: "Erro ao editar Servidor",
    //     setErrorMessage,
    //   });
    // }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b flex items-center gap-2 font-medium px-6 py-4 text-base">
            <Server size={17} />
            {mode === "CREATE" ? "Adicionar Endpoint" : "Editar Endpoint"}
          </DialogTitle>
          <div ref={contentRef} className="overflow-y-auto">
            <DialogDescription asChild>
              <form
                onSubmit={handleSubmit(
                  mode === "CREATE" ? createWorkspace : updateWorkspace
                )}
                className="px-6 grid grid-cols-1 gap-5 py-6"
              >
                <div className="*:not-first:mt-3">
                  <Label htmlFor={"Indentificador"} className="font-[450]">
                    Identificador
                  </Label>
                  <Input
                    id={"Indentificador"}
                    {...register("identifier", {
                      required: "O identificador é obrigatório",
                      minLength: { value: 3, message: "Mínimo 3 caracteres" },
                      maxLength: { value: 50, message: "Máximo 50 caracteres" },
                      pattern: {
                        value: /^[a-zA-ZÀ-ÿ\s0-9 _-]+$/,
                        message:
                          "Apenas letras, números, espaços, hífens e underscores são permitidos.",
                      },
                    })}
                    className={`text-white py-5 text-base ${
                      errors.identifier
                        ? "!ring-red-500/20 !border-red-700"
                        : "border-zinc-800"
                    }`}
                    placeholder="Indetificador do Endpoint"
                    type="text"
                  />
                  {errors.identifier && (
                    <p className="text-[14px] text-white/60 mt-1">
                      {errors.identifier.message}
                    </p>
                  )}
                </div>

                <div className="*:not-first:mt-3">
                  <Label htmlFor={"endpoint"} className="font-[450]">
                    Endpoint
                  </Label>
                  <Input
                    id={"endpoint"}
                    {...register("url", {
                      required: "O endpoint é obrigatório",
                      minLength: { value: 3, message: "Mínimo 3 caracteres" },
                      maxLength: {
                        value: 200,
                        message: "Máximo 200 caracteres",
                      },
                      pattern: {
                        value:
                          /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/,
                        message: "Por favor, insira uma URL válida.",
                      },
                    })}
                    className={`text-white py-5 text-base ${
                      errors.url
                        ? "!ring-red-500/20 !border-red-700"
                        : "border-zinc-800"
                    }`}
                    placeholder="http://api.meusite.com/health"
                    type="text"
                  />
                  {errors.url && (
                    <p className="text-[14px] text-white/60 mt-1">
                      {errors.url.message}
                    </p>
                  )}
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
                    Registar Endpoint
                  </Button>
                </DialogFooter>
              </form>
            </DialogDescription>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEndpoint;
