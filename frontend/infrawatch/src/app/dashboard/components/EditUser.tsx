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
import { CircleUser } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { getCookie } from "cookies-next/client";
import { toast } from "sonner";
import { UserData } from "@/app/chooseWorkspace/[id]/page";
import { APIS, GenericAxiosActions } from "@/components/AppComponents/API";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EditUserProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<UserData | null>>;
  dataUser: UserData | null;
}
type EditUserState = {
  name: string;
  email: string;
  username: string;
};

const EditUser: React.FC<EditUserProps> = ({
  open,
  setOpen,
  setData,
  dataUser,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditUserState>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      username: "",
    },
  });

  useEffect(() => {
    if (dataUser) {
      reset({
        name: dataUser.name || "",
        email: dataUser.email || "",
        username: dataUser.username || "",
      });
    }
  }, [dataUser, reset]);

  const editProfile = async (data: EditUserState) => {
    if (!data.name || !data.email || !data.username) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    if (
      data.name === dataUser?.name &&
      data.email === dataUser?.email &&
      data.username === dataUser?.username
    ) {
      setOpen(false);
      return;
    }

    try {
      setLoading(true);
      toast.loading("Editando Perfil...", {
        position: "top-center",
        id: "editProfile",
      });
      const response = await axios.put(
        APIS.EDIT_USER,
        {
          name: data.name,
          email: data.email,
          username: data.username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      setData(response.data);
      if (response.status === 200) {
        toast.success("Perfil editado com sucesso", {
          position: "top-center",
          id: "editProfile",
        });
        setLoading(false);
        setOpen(false);
      }
    } catch (error) {
      setLoading(false);
      toast.dismiss("editProfile");
      GenericAxiosActions({ error, message: "Erro ao editar perfil" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5"
      >
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b flex items-center gap-2 font-medium px-6 py-4 text-base">
            <CircleUser size={17} />
            Edite seu Perfil
          </DialogTitle>
          <div ref={contentRef} className="overflow-y-auto">
            <DialogDescription asChild>
              <form
                onSubmit={handleSubmit(editProfile)}
                className="px-6 grid grid-cols-1 gap-5 py-6"
              >
                <div className="*:not-first:mt-3">
                  <Label htmlFor={"name"} className="font-[450]">
                    Nome
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
                <div className="*:not-first:mt-3">
                  <Label htmlFor={"email"} className="font-[450]">
                    E-mail
                  </Label>
                  <Input
                    id={"email"}
                    {...register("email", {
                      required: "E-mail é obrigatório",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Formato de e-mail inválido.",
                      },
                    })}
                    className={`text-white py-5 text-base ${
                      errors.email
                        ? "!ring-red-500/20 !border-red-700"
                        : "border-zinc-800"
                    }`}
                    placeholder="Email"
                    type="email"
                  />
                  {errors.email && (
                    <p className="text-[14px] text-white/60 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="*:not-first:mt-3">
                  <Label htmlFor={"username"} className="font-[450]">
                    Username
                  </Label>
                  <Input
                    id={"username"}
                    {...register("username", {
                      required: "O username é obrigatório",
                      pattern: {
                        value:
                          // username regex: letters, numbers, underscores, hyphens, dots, 3-30 chars
                          /^[a-zA-Z0-9._-]{3,30}$/,
                        message:
                          "O username deve conter apenas letras, números, underscores, hífens e pontos. (Min: 3, Máx: 30 caracteres)",
                      },
                    })}
                    className={`text-white py-5 text-base ${
                      errors.username
                        ? "!ring-red-500/20 !border-red-700"
                        : "border-zinc-800"
                    }`}
                    placeholder="Username"
                    type="text"
                  />
                  {errors.username && (
                    <p className="text-[14px] text-white/60 mt-1">
                      {errors.username.message}
                    </p>
                  )}
                </div>
                <DialogFooter className="border-t px-1 mt-3 pt-4 sm:items-center">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      onClick={() => {
                        // Reset form to initial data on cancel
                        if (dataUser) {
                          reset({
                            name: dataUser.name || "",
                            email: dataUser.email || "",
                            username: dataUser.username || "",
                          });
                        }
                      }}
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
                    Editar Perfil
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

export default EditUser;
