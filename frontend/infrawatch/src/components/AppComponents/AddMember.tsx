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
import { User } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import axios from "axios";
import { APIS, GenericAxiosActions } from "./API";
import { getCookie } from "cookies-next/client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IMember } from "@/app/dashboard/slices/MembersSlice";

const expecificRole = [
  {
    id: "1",
    label: "EDITOR",
    content:
      "Pode editar e gerenciar recursos, mas não pode alterar criar ou deletar informações sensíveis.",
  },
  {
    id: "2",
    label: "VIEWER",
    content:
      "Apenas visualização de recursos, sem permissões de edição ou gerenciamento.",
  },
  {
    id: "3",
    label: "MANAGER",
    content:
      "Acesso total ao workspace, incluindo gerenciamento e configurações.",
  },
];

interface AddMemberProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUsers: React.Dispatch<React.SetStateAction<IMember[]>>;
  workspaceId: string;
}
type AddMemberState = {
  username: string;
  role: string;
};

const AddMember: React.FC<AddMemberProps> = ({
  open,
  setOpen,
  setUsers,
  workspaceId,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AddMemberState>({
    mode: "onChange",
    defaultValues: {
      username: "",
      role: "1",
    },
  });

  const AddMemberFunc = async (data: AddMemberState) => {
    try {
      setLoading(true);
      toast.loading("Inserindo ao workspace...", {
        position: "top-center",
        id: "addMember",
      });
      const response = await axios.post(
        APIS.ADD_MEMBER_WORKSPACE + workspaceId,
        {
          username: data.username,
          role: expecificRole.find((item) => item.id === data.role)?.label,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      setUsers((prev) => [...prev, response.data]);
      if (response.status === 200) {
        toast.success("Usuário inserido ao workspace com sucesso!", {
          position: "top-center",
          id: "addMember",
        });
      }
      setLoading(false);
      setOpen(false);
    } catch (error) {
      setLoading(false);
      toast.dismiss("addMember");
      GenericAxiosActions({ error, message: "Erro ao inserir membro." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b flex items-center gap-2 font-medium px-6 py-4 text-base">
            <User size={17} /> Adicionar Membro
          </DialogTitle>
          <div ref={contentRef} className="overflow-y-auto">
            <DialogDescription asChild>
              <form
                onSubmit={handleSubmit(AddMemberFunc)}
                className="px-6 grid grid-cols-1 gap-5 py-6"
              >
                <div className="*:not-first:mt-3">
                  <Label htmlFor={"email"} className="font-[490]">
                    E-mail ou Username
                  </Label>
                  <Input
                    id={"email"}
                    {...register("username", {
                      required: "O e-mail ou username é obrigatório",
                    })}
                    className={`text-white !shadow-none py-5 text-base ${
                      errors.username
                        ? "!ring-red-500/20 !border-red-700"
                        : "dark:border-zinc-800"
                    }`}
                    placeholder="Email ou Username"
                    type="text"
                  />
                  {errors.username && (
                    <p className="text-[14px] text-white/60 mt-1">
                      {errors.username.message}
                    </p>
                  )}
                </div>
                <div className="*:not-first:mt-2">
                  <Label htmlFor={"role_permission"} className="font-[490]">
                    Permissão / Nível de Acesso
                  </Label>
                  <Select
                    defaultValue="1"
                    onValueChange={(value) => {
                      setValue("role", value, { shouldValidate: true });
                    }}
                  >
                    <SelectTrigger
                      id="role_permission"
                      className="dark:border-zinc-900 font-medium py-5 cursor-pointer"
                    >
                      <SelectValue placeholder="Adicione uma permissão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">EDITOR</SelectItem>
                      <SelectItem value="2">VIEWER</SelectItem>
                      <SelectItem value="3">MANAGER</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role ? (
                    <p className="text-[14px] text-white/60 mt-1">
                      {errors.role.message}
                    </p>
                  ) : (
                    <p className="text-[15px] text-zinc-700 dark:text-white/70 mt-1">
                      {
                        expecificRole.find((item) => item.id === watch("role"))
                          ?.content
                      }
                    </p>
                  )}
                </div>
                <DialogFooter className="border-t dark:text-white text-black px-1 mt-3 pt-4 sm:items-center">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      disabled={loading}
                      variant="outline"
                      className="py-5"
                    >
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button
                    type="submit"
                    className="py-5 bg-cyan-600/40 border border-cyan-700 hover:bg-cyan-600/50 cursor-pointer text-cyan-800 dark:text-white"
                  >
                    {loading && (
                      <span className="loader !w-4 !h-4 !border-2 !border-b-white !border-white/40"></span>
                    )}
                    Adicionar Membro
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

export default AddMember;
