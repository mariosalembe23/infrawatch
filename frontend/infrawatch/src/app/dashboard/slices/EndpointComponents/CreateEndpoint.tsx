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
import { Link2 } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { getCookie } from "cookies-next/client";
import { toast } from "sonner";
import { APIS, GenericAxiosActions } from "@/components/AppComponents/API";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ServerProps } from "../Types/Server";
import { Textarea } from "@/components/ui/textarea";
import { EndpointProps } from "../Types/Endpoint";

interface CreateEndpointProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEndpoints: React.Dispatch<React.SetStateAction<EndpointProps[]>>;
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
  workspace_id,
  setErrorMessage,
  mode,
  setEndpoints,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

  const createEndpoint = async (data: CreateEndpointState) => {
    if (!data.url || !data.identifier || !data.description) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setLoading(true);
      toast.loading("Cadastrando Endpoint...", {
        position: "top-center",
        id: "createEndpoint",
      });
      const response = await axios.post(
        APIS.CREATE_ENDPOINT + workspace_id,
        {
          url: data.url,
          identifier: data.identifier,
          description: data.description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      setEndpoints((prev) => [...prev, response.data]);
      if (response.status === 201) {
        toast.success("Servidor criado com sucesso!", {
          position: "top-center",
          id: "createEndpoint",
        });
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b flex items-center gap-2 font-medium px-6 py-4 text-base">
            <Link2 size={17} />
            {mode === "CREATE" ? "Adicionar Endpoint" : "Editar Endpoint"}
          </DialogTitle>
          <div ref={contentRef} className="overflow-y-auto">
            <DialogDescription asChild>
              <form
                onSubmit={handleSubmit(createEndpoint)}
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
                      maxLength: { value: 25, message: "Máximo 25 caracteres" },
                      pattern: {
                        value: /^[a-zA-ZÀ-ÿ\s0-9 _-]+$/,
                        message:
                          "Apenas letras, números, espaços, hífens e underscores são permitidos.",
                      },
                    })}
                    className={`dark:text-white text-black py-5 text-base ${
                      errors.identifier
                        ? "!ring-red-500/20 !border-red-700"
                        : "dark:border-zinc-800"
                    }`}
                    placeholder="Indetificador do Endpoint"
                    type="text"
                  />
                  {errors.identifier && (
                    <p className="text-[14px] text-zinc-700 dark:text-white/60 mt-1">
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
                    className={`dark:text-white text-black py-5 text-base ${
                      errors.url
                        ? "!ring-red-500/20 !border-red-700"
                        : "dark:border-zinc-800"
                    }`}
                    placeholder="http://api.meusite.com/health"
                    type="text"
                  />
                  {errors.url && (
                    <p className="text-[14px] text-zinc-700 dark:text-white/60 mt-1">
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
                    className={`dark:text-white shadow-none text-black [resize:none]  text-base ${
                      errors.description
                        ? "!ring-red-500/20 !border-red-700"
                        : "dark:border-zinc-800"
                    }`}
                    placeholder="Descrição do Espaço de Trabalho"
                  />
                  {errors.description && (
                    <p className="text-[14px] text-zinc-700 dark:text-white/60 mt-1">
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
                      className="py-5 dark:text-white text-black"
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
