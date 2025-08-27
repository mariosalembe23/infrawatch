import { Button } from "@/components/ui/button";
import React from "react";
import { DashboardContext } from "../[id]/ContextProvider";
import {
  Plus,
  Trash,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface IMembersSlice {
  showSideBar: boolean;
}

const MembersSlice: React.FC<IMembersSlice> = () => {
  const dashboardContext = React.useContext(DashboardContext);
  const workSpaceInfo = dashboardContext?.workSpaceInfo;

  return (
    <section className="max-w-7xl w-full mx-auto">
      <header>
        <div className="flex items-start gap-5 flex-wrap justify-between mb-10">
          <div>
            <h2 className="dark:text-white ret:text-4xl text-2xl font-medium pot:font-semibold">
              Membros
            </h2>
            <div className="w-full ret:w-[30rem]">
              <p className="dark:text-zinc-500 text-zinc-700 font-[410]">
                Edite e gerencie as configurações da sua conta, preferências e
                outras opções relacionadas ao seu perfil.
              </p>
            </div>
          </div>

          <div>
            <Button className="py-4  mt-3 bg-cyan-600/40 border border-cyan-700 hover:bg-cyan-600/50 cursor-pointer text-red-800 dark:text-white">
              Adicionar Membro
              <Plus size={18} className="" />
            </Button>
          </div>
        </div>
      </header>
      <div className="pb-10">
        <h2 className="text-xl"> {workSpaceInfo?.workspace_name}</h2>
      </div>
      <div className="grid grid-cols-1 items-start gap-3">
        <div className="flex border-b gap-3 flex-wrap py-3 border-zinc-900 items-end justify-between">
          <div>
            <p className="text-zinc-600">E-mail</p>
            <p>linomario199010@gmail.com</p>
          </div>
          <div className="flex gap-3 items-center">
            <Badge
              variant="outline"
              className="gap-1.5 text-[14px] border-none items-center"
            >
              <span
                className="size-1.5 rounded-full bg-red-500"
                aria-hidden="true"
              ></span>
              Inactivo
            </Badge>
          </div>
          <div className="flex gap-2 items-center">
            <Select defaultValue="1">
              <SelectTrigger className="border-zinc-900 cursor-pointer">
                <SelectValue placeholder="Adicione uma permissão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">MASTER</SelectItem>
                <SelectItem value="1">MANAGER</SelectItem>
                <SelectItem value="3">VIEWER</SelectItem>
                <SelectItem value="4">EDITOR</SelectItem>
              </SelectContent>
            </Select>
            <Button className="py-4 bg-red-600/40 border border-red-700 hover:bg-red-600/50 cursor-pointer text-red-800 dark:text-white">
              <Trash size={16} className="" />
              Remover
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembersSlice;
