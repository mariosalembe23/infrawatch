import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { DashboardContext } from "../[id]/ContextProvider";
import { Expand, Plus, Trash } from "lucide-react";

import axios from "axios";
import { APIS, GenericAxiosActions } from "@/components/AppComponents/API";
import { getCookie } from "cookies-next/client";
import AddMember from "@/components/AppComponents/AddMember";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface IMembersSlice {
  showSideBar: boolean;
}

const MemberItem: React.FC<{
  email: string;
  role: string;
  name?: string;
  username?: string;
  workspace_id: string;
  setUsers: React.Dispatch<React.SetStateAction<IMember[]>>;
}> = ({ email, role, name, username, workspace_id, setUsers }) => {
  const [loading, setLoading] = React.useState(false);
  const [deleteAlert, setDeleteAlert] = React.useState(false);

  const deleteMember = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        APIS.REMOVE_FROM_WORKSPACE + workspace_id,
        {
          data: {
            username: username,
          },
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setLoading(false);
        setUsers((prev) => prev.filter((user) => user.username !== username));
        toast.success("Usuário removido com sucesso!");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error removing user:", error);
      GenericAxiosActions({
        error,
        message: "Erro ao remover usuário: " + username,
      });
    }
  };

  return (
    <div className="flex border flex-col rounded-2xl gap-3 flex-wrap p-5 dark:border-zinc-900/40 items-start justify-between">
      <header className="flex items-center w-full justify-between">
        <div className="font-medium rounded-full  dark:bg-transparent flex items-center justify-center">
          <span className="text-zinc-600 text-[15px]">{username}</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size={"icon"}
            className="rounded-full dark:bg-zinc-950 bg-gray-50 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer border dark:border-zinc-900"
          >
            <Expand size={18} className="dark:text-white text-black size-4" />
          </Button>
        </div>
      </header>
      <div className="leading-none pt-2">
        <p className="text-cyan-700 font-medium dark:text-cyan-500 text-[14px] pb-2">
          {role}
        </p>
        <p className="dark:text-white flex items-center gap-1 text-black">
          {name}
        </p>
        <p className="dark:text-zinc-300 text-zinc-600 font-mono text-sm pt-1">
          {email}
        </p>
      </div>
      <div className="w-full">
        <Button
          onClick={() => setDeleteAlert(true)}
          className="py-4 w-full  mt-2 bg-red-600/40 border border-red-700 hover:bg-red-600/50 cursor-pointer text-red-800 dark:text-white"
        >
          Remover
          <Trash size={18} className="" />
        </Button>
      </div>
      <AlertDialog open={deleteAlert} onOpenChange={setDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-medium">
              Tem certeza que deseja remover este membro?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é irreversível. O membro será removido permanentemente
              do workspace. Por favor, confirma que desejas prosseguir com esta
              ação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <Button
              disabled={loading}
              onClick={deleteMember}
              className="py-4 bg-red-600/40 border border-red-700 hover:bg-red-600/50 cursor-pointer text-red-800 dark:text-white"
            >
              <Trash size={18} className="" />
              Eliminar
              {loading && (
                <span className="loader !w-3 !h-3 !border-2 !border-b-white !border-white/40"></span>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export interface IMember {
  userId: string;
  email: string;
  role: "MASTER" | "MANAGER" | "VIEWER" | "EDITOR";
  name: string;
  username: string;
  created_at: string;
}

const MembersSlice: React.FC<IMembersSlice> = () => {
  const dashboardContext = React.useContext(DashboardContext);
  const userData = dashboardContext?.userData;
  const workSpaceInfo = dashboardContext?.workSpaceInfo;
  const [Users, setUsers] = React.useState<IMember[]>([]);
  const [openAddMember, setOpenAddMember] = React.useState(false);
  const [loadingUsers, setLoadingUsers] = React.useState(true);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await axios.get(
          `${APIS.ALL_USERS_WORKSPACE}${workSpaceInfo?.id}`,
          {
            headers: {
              Authorization: `Bearer ${getCookie("token")}`,
            },
          }
        );
        setUsers(
          response.data.filter((user: IMember) => user.userId !== userData?.id)
        );
        setLoadingUsers(false);
      } catch (error) {
        setLoadingUsers(false);
        console.error("Error fetching users:", error);
        GenericAxiosActions({
          error,
          message: "Erro ao trazer usuários de" + workSpaceInfo?.workspace_name,
        });
      }
    };
    if (workSpaceInfo?.id) {
      getAllUsers();
    }
  }, [workSpaceInfo, userData]);

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

          <div className="w-full">
            <Button
              onClick={() => setOpenAddMember(true)}
              className=" ret:w-auto w-full py-5  mt-3 bg-cyan-600/40 border border-cyan-700 hover:bg-cyan-600/50 cursor-pointer text-cyan-800 dark:text-white"
            >
              Adicionar Membro
              <Plus size={18} className="" />
            </Button>
          </div>
        </div>
      </header>
      <div className="pb-6">
        <h2 className="text-xl"> {workSpaceInfo?.workspace_name}</h2>
      </div>

      {loadingUsers ? (
        <p className="flex dark:text-white text-zinc-800 items-center gap-2">
          <span className="loader !w-4 !h-4 !border-2 !border-b-zinc-900 dark:!border-b-zinc-100 !border-zinc-300 dark:!border-zinc-600"></span>
          Processando
        </p>
      ) : Users.length > 0 ? (
        <div className="flex flex-wrap items-start gap-2">
          {Users.map((user) => (
            <MemberItem
              key={user.userId}
              email={user.email}
              role={user.role}
              name={user.name}
              username={user.username}
              workspace_id={workSpaceInfo?.id ?? ""}
              setUsers={setUsers}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-zinc-600 dark:text-zinc-500">
            Nenhum membro encontrado! Convide membros para colaborar no seu
            workspace.
          </p>
        </div>
      )}
      <AddMember
        open={openAddMember}
        setOpen={setOpenAddMember}
        setUsers={setUsers}
        workspaceId={workSpaceInfo?.id ?? ""}
      />
    </section>
  );
};

export default MembersSlice;
