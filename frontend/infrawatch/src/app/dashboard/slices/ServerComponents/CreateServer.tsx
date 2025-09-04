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

const optionsTime = [
  { label: "1 minuto", value: "60000" },
  {
    label: "5 minutos",
    value: "300000",
  },
  { label: "10 minutos", value: "600000" },
  { label: "30 minutos", value: "1800000" },
  { label: "1 hora", value: "3600000" },
];

interface CreateServerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setServers: React.Dispatch<React.SetStateAction<ServerProps[]>>;
  workspace_id: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}
type CreateServerState = {
  servername: string;
  identifier: string;
  time_ms: string;
};

const CreateServer: React.FC<CreateServerProps> = ({
  open,
  setOpen,
  setServers,
  workspace_id,
  setErrorMessage,
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
  } = useForm<CreateServerState>({
    mode: "onChange",
    defaultValues: {
      servername: "",
      identifier: "",
    },
  });

  const createWorkspace = async (data: CreateServerState) => {
    if (!selectedTime.value) {
      toast.error("Por favor, selecione um intervalo de verificação.");
      return;
    }

console.log(data, selectedTime);

    try {
      setLoading(true);
      toast.loading("Criando Servidor...", {
        position: "top-center",
        id: "createServer",
      });
      const response = await axios.post(
        APIS.CREATE_SERVER + workspace_id,
        {
          servername: data.servername,
          identifier: data.identifier,
          time_ms: parseInt(selectedTime.value, 10),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      console.log(response.data);
      setServers((prev) => [...prev, response.data]);
      if (response.status === 201) {
        toast.success("Servidor criado com sucesso!", {
          position: "top-center",
          id: "createServer",
        });
        setLoading(false);
        setOpen(false);
      }
    } catch (error) {
      setLoading(false);
      toast.dismiss("createServer");
      GenericAxiosActions({
        error,
        message: "Erro ao criar Servidor",
        setErrorMessage,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b flex items-center gap-2 font-medium px-6 py-4 text-base">
            <Server size={17} />
            Cadastrar Servidor
          </DialogTitle>
          <div ref={contentRef} className="overflow-y-auto">
            <DialogDescription asChild>
              <form
                onSubmit={handleSubmit(createWorkspace)}
                className="px-6 grid grid-cols-1 gap-5 py-6"
              >
                <div className="*:not-first:mt-3">
                  <Label htmlFor={"servername"} className="font-[450]">
                    Nome do Servidor
                  </Label>
                  <Input
                    id={"servername"}
                    {...register("servername", {
                      required: "O Nome é obrigatório",
                      minLength: { value: 3, message: "Mínimo 3 caracteres" },
                      maxLength: { value: 50, message: "Máximo 50 caracteres" },
                      pattern: {
                        value: /^[a-zA-ZÀ-ÿ\s0-9 _-]+$/,
                        message:
                          "Apenas letras, números, espaços, hífens e underscores são permitidos.",
                      },
                    })}
                    className={`text-white py-5 text-base ${
                      errors.servername
                        ? "!ring-red-500/20 !border-red-700"
                        : "border-zinc-800"
                    }`}
                    placeholder="Nome do Servidor"
                    type="text"
                  />
                  {errors.servername && (
                    <p className="text-[14px] text-white/60 mt-1">
                      {errors.servername.message}
                    </p>
                  )}
                </div>

                <div className="*:not-first:mt-3">
                  <Label htmlFor={"identifier"} className="font-[450]">
                    Identificador
                  </Label>
                  <Input
                    id={"identifier"}
                    {...register("identifier", {
                      required: "O Identificador é obrigatório",
                      minLength: { value: 3, message: "Mínimo 3 caracteres" },
                      maxLength: { value: 50, message: "Máximo 50 caracteres" },
                      pattern: {
                        value: /^[a-zA-ZÀ-ÿ\s0-9 _-]+$/,
                        message:
                          "Apenas letras, números, espaços, hífens e underscores são permitidos.",
                      },
                    })}
                    className={`text-white py-5 text-base ${
                      errors.servername
                        ? "!ring-red-500/20 !border-red-700"
                        : "border-zinc-800"
                    }`}
                    placeholder="Identificador do Servidor"
                    type="text"
                  />
                  {errors.servername && (
                    <p className="text-[14px] text-white/60 mt-1">
                      {errors.servername.message}
                    </p>
                  )}
                </div>

                <div className="*:not-first:mt-2">
                  <Label htmlFor={"time_sm"}>Intervalo de verificação</Label>
                  <Select
                    defaultValue={optionsTime[0].value}
                    onValueChange={(value) => {
                      const time = optionsTime.find(
                        (option) => option.value === value
                      );
                      if (time) {
                        setSelectedTime(time);
                      }
                    }}
                  >
                    <SelectTrigger
                      id="time_sm"
                      className="border-zinc-800 text-base py-5 cursor-pointer"
                    >
                      <SelectValue placeholder="Defina um tempo" />
                    </SelectTrigger>
                    <SelectContent>
                      {optionsTime.map((time, index) => (
                        <SelectItem
                          key={index}
                          className="text-base"
                          value={time.value}
                        >
                          {time.label}
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
                    Criar Servidor
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

export default CreateServer;
