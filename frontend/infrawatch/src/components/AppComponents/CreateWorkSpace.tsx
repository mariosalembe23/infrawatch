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
import { Container } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import axios from "axios";
import { APIS, GenericAxiosActions } from "./API";
import { getCookie } from "cookies-next/client";
import { toast } from "sonner";
import { WorkSpaceProps } from "@/app/chooseWorkspace/[id]/page";

interface CreateWorkspaceProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setWorkspaceInfo: React.Dispatch<React.SetStateAction<WorkSpaceProps | null>>;
  setWorkspaces: React.Dispatch<React.SetStateAction<WorkSpaceProps[]>>;
  mode: "CREATE" | "EDIT";
  dataWorkspace: WorkSpaceProps;
  workspaceId: string;
}
type CreateWorkSpaceState = {
  name: string;
  description: string;
};

const CreateWorkspace: React.FC<CreateWorkspaceProps> = ({
  open,
  setOpen,
  setWorkspaceInfo,
  mode = "CREATE",
  dataWorkspace,
  workspaceId,
  setWorkspaces,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateWorkSpaceState>({
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (mode === "EDIT" && dataWorkspace) {
      reset({
        name: dataWorkspace.workspace_name,
        description: dataWorkspace.about,
      });
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [dataWorkspace, mode, reset]);

  const editWorkspace = async (data: CreateWorkSpaceState) => {
    if (!data.name || !data.description) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    if (
      data.name === dataWorkspace.workspace_name &&
      data.description === dataWorkspace.about
    ) {
      setOpen(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        APIS.EDIT_WORKSPACE + workspaceId,
        {
          workspace_name: data.name,
          about: data.description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setWorkspaceInfo(response.data);
        toast.success("Workspace editado com sucesso!", {
          position: "top-center",
        });
        setLoading(false);
        setOpen(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setLoading(false);
      GenericAxiosActions({ error, message: "Erro ao editar workspace." });
    }
  };

  const createWorkspace = async (data: CreateWorkSpaceState) => {
    try {
      setLoading(true);
      toast.loading("Criando workspace...", {
        position: "top-center",
        id: "createWorkspace",
      });
      const response = await axios.post(
        APIS.CREATE_WORKSPACE,
        {
          workspace_name: data.name,
          about: data.description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );

      setWorkspaces((prev) => [...prev, response.data]);
      if (response.status === 201) {
        toast.success("Workspace criado com sucesso!", {
          position: "top-center",
          id: "createWorkspace",
        });
        setLoading(false);
        setOpen(false);
      }
    } catch (error) {
      setLoading(false);
      toast.dismiss("createWorkspace");
      GenericAxiosActions({ error, message: "Erro ao criar workspace." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5"
      >
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b flex items-center gap-2 font-medium px-6 py-4 text-base">
            <Container size={17} /> Criar Espaço de Trabalho
          </DialogTitle>
          <div ref={contentRef} className="overflow-y-auto">
            <DialogDescription asChild>
              <form
                onSubmit={handleSubmit(
                  mode === "EDIT" && workspaceId
                    ? editWorkspace
                    : createWorkspace
                )}
                className="px-6 grid grid-cols-1 gap-5 py-6"
              >
                <div className="*:not-first:mt-3">
                  <Label htmlFor={"name"} className="font-[450]">
                    Nome do workspace
                  </Label>
                  <Input
                    id={"name"}
                    {...register("name", {
                      required: "Nome é obrigatório",
                      minLength: { value: 3, message: "Mínimo 3 caracteres" },
                      maxLength: { value: 50, message: "Máximo 50 caracteres" },
                      pattern: {
                        value: /^[a-zA-ZÀ-ÿ\s0-9 _-]+$/,
                        message:
                          "Apenas letras, números, espaços, hífens e underscores são permitidos.",
                      },
                    })}
                    className={`text-white py-5 text-base ${
                      errors.name
                        ? "!ring-red-500/20 !border-red-700"
                        : "border-zinc-800"
                    }`}
                    placeholder="Nome do Espaço de Trabalho"
                    type="text"
                  />
                  {errors.name && (
                    <p className="text-[14px] text-white/60 mt-1">
                      {errors.name.message}
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
                    Criar workspace
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

export default CreateWorkspace;
