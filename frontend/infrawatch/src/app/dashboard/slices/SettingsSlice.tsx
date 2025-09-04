import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import {
  CircleUser,
  Container,
  LockOpen,
  SquarePen,
  Trash,
  UserPen,
} from "lucide-react";
import EditUser from "../components/EditUser";
import { UserData, WorkSpaceProps } from "@/app/chooseWorkspace/[id]/page";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteCookie, getCookie } from "cookies-next";
import axios from "axios";
import { toast } from "sonner";
import { APIS, GenericAxiosActions } from "@/components/AppComponents/API";
import CreateWorkspace from "@/components/AppComponents/CreateWorkSpace";
import { IMember } from "./MembersSlice";

interface ISettingsSlice {
  showSideBar: boolean;
  data: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  setWorkspaces: React.Dispatch<React.SetStateAction<WorkSpaceProps[]>>;
  workspaces: WorkSpaceProps[];
  workspaceInfo?: WorkSpaceProps | null;
  setWorkspaceInfo: React.Dispatch<React.SetStateAction<WorkSpaceProps | null>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

const SettingsSlice: React.FC<ISettingsSlice> = ({
  data,
  setUserData,
  setWorkspaces,
  workspaceInfo,
  setWorkspaceInfo,
  setErrorMessage,
}) => {
  const [editUser, setEditUser] = React.useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false);
  const [deleteAlert, setDeleteAlert] = React.useState<{
    status: "user" | "workspace";
    open: boolean;
  }>({
    status: "user",
    open: false,
  });
  const [editWorkspace, setEditWorkspace] = React.useState<boolean>(false);
  const [Users, setUsers] = React.useState<IMember[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${APIS.ALL_USERS_WORKSPACE}${workspaceInfo?.id}`,
          {
            headers: {
              Authorization: `Bearer ${getCookie("token")}`,
            },
          }
        );
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching users:", error);
        GenericAxiosActions({
          error,
          message:
            "Erro ao trazer usuários de " + workspaceInfo?.workspace_name,
          setErrorMessage,
        });
      }
    };

    getAllUsers();
  }, [workspaceInfo, setErrorMessage]);

  const deleteUser = async () => {
    try {
      setDeleteLoading(true);
      const response = await axios.delete(`${APIS.DELETE_USER}${data?.id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      if (response.status === 200) {
        toast.success("Usuário deletado com sucesso.", {
          position: "top-center",
        });
        setDeleteLoading(false);
        deleteCookie("token");
        setUserData(null);
        window.location.href = "/";
      }
    } catch (error) {
      console.error(error);
      GenericAxiosActions({
        error,
        message: "Erro ao deletar usuário",
        setErrorMessage,
      });
    }
  };

  const deleteWorkspace = async () => {
    try {
      setDeleteLoading(true);
      const response = await axios.delete(
        `${APIS.DELETE_WORKSPACE}${workspaceInfo?.id}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Workspace deletado com sucesso", {
          position: "top-center",
        });
        setDeleteLoading(false);
        window.location.href = "/";
      }
    } catch (error) {
      setDeleteLoading(false);
      console.error(error);
      GenericAxiosActions({
        error,
        message: "Erro ao deletar workspace",
        setErrorMessage,
      });
    }
  };

  return (
    <section className="max-w-6xl w-full mx-auto">
      <header>
        <div className="flex items-start gap-5 flex-wrap justify-between mb-10">
          <div>
            <h2 className="dark:text-white ret:text-4xl text-2xl font-medium pot:font-semibold">
              Configurações
            </h2>
            <div className="w-full ret:w-[30rem]">
              <p className="dark:text-zinc-500 text-zinc-700 font-[410]">
                Edite e gerencie as configurações da sua conta, preferências e
                outras opções relacionadas ao seu perfil.
              </p>
            </div>
          </div>

          <div>
            <Button
              size={"icon"}
              className="rounded-full pot:inline-flex hidden cursor-pointer hover:bg-gray-100 bg-gray-50 shadow-none border dark:bg-zinc-900 dark:hover:bg-zinc-950 dark:border-zinc-800"
            >
              <LockOpen
                size={18}
                className="dark:text-white text-black size-5"
              />
            </Button>
          </div>
        </div>
      </header>

      <div className="grid pot:grid-cols-2 grid-cols-1 items-start gap-3">
        <div className="p-5 border dark:border-zinc-900/60 rounded-xl">
          <div className="flex gap-3">
            <header className="border-b w-full items-center justify-between dark:border-b-zinc-900/30 pb-3 flex gap-3">
              <div>
                <p className="dark:text-white text-lg leading-none">
                  {data?.name}
                </p>
                <p>
                  <span className="dark:text-zinc-500 text-zinc-700 text-[15px] font-[450]">
                    {data?.username}
                  </span>
                </p>
              </div>
              <div>
                <Button
                  size={"icon"}
                  onClick={() => setEditUser(true)}
                  className="rounded-full dark:bg-[#0c0c0c] hover:bg-gray-200 transition-all shadow-none bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer border dark:border-zinc-900"
                >
                  <UserPen
                    size={18}
                    className="dark:text-white text-zinc-800 size-5"
                  />
                </Button>
              </div>
            </header>
          </div>
          <div className="items-center flex pt-5 justify-between">
            <p className="dark:text-white text-base">E-mail</p>
            <p>
              <span className="dark:text-zinc-300 text-zinc-700 text-[15px] font-[490]">
                {data?.email}
              </span>
            </p>
          </div>
          <div className="items-center flex pt-5 justify-between">
            <p className="dark:text-white text-base">Estado</p>
            <p>
              <span className="dark:text-cyan-500 text-cyan-600 text-[14px] font-[490]">
                {data?.is_active ? "Ativo" : "Inativo"}
              </span>
            </p>
          </div>
          <div className="items-center flex pt-5 justify-between">
            <p className="dark:text-white text-base">Role</p>
            <p>
              <span className="dark:text-zinc-300 text-zinc-700 text-[14px] font-[490]">
                {data?.role || "User"}
              </span>
            </p>
          </div>
          <div className="items-center flex pt-5 justify-between">
            <p className="dark:text-white text-base">Criado em</p>
            <p className="font-mono dark:text-white text-[15px] relative z-10 pt-1">
              {data?.created_at
                ? new Date(data.created_at).toLocaleDateString("pt-PT", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Data desconhecida"}
            </p>
          </div>
          <div className="flex items-center w-full flex-wrap pt-3 dark:border-t-zinc-900/30 mt-5 border-t justify-end gap-2">
            <Button
              onClick={() => setEditUser(true)}
              className="py-4  bg-cyan-600/40 border border-cyan-700 hover:bg-cyan-600/50 cursor-pointer text-cyan-800 dark:text-white"
            >
              <UserPen size={18} className="" />
              Editar
            </Button>
            <Button
              onClick={() =>
                setDeleteAlert({
                  status: "user",
                  open: true,
                })
              }
              className="py-4  bg-red-600/40 border border-red-700 hover:bg-red-600/50 cursor-pointer text-red-800 dark:text-white"
            >
              <CircleUser size={18} className="" />
              Eliminar Conta
            </Button>
          </div>
        </div>

        <div className="p-5 border dark:border-zinc-900/60 rounded-xl">
          <div className="flex gap-3">
            <header className="border-b w-full items-center justify-between dark:border-b-zinc-900/30 pb-3 flex gap-3">
              <div>
                <p className="dark:text-white text-lg leading-none">
                  Workspace
                </p>
                <p>
                  <span className="dark:text-zinc-300 text-zinc-700 text-[15px] font-[450]">
                    {workspaceInfo?.workspace_name}
                  </span>
                </p>
              </div>
              <div>
                <Button
                  size={"icon"}
                  onClick={() => setEditWorkspace(true)}
                  className="rounded-full dark:bg-[#0c0c0c] hover:bg-gray-200 transition-all shadow-none bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer border dark:border-zinc-900"
                >
                  <SquarePen
                    size={18}
                    className="dark:text-white text-zinc-800 size-5"
                  />
                </Button>
              </div>
            </header>
          </div>
          <div className="items-start flex flex-col pt-5 justify-between">
            <p className="dark:text-zinc-500 text-base">Descrição</p>
            <p>{workspaceInfo?.about || "Nenhuma descrição fornecida."}</p>
          </div>
          <div className="items-center flex pt-5 justify-between">
            <p className="dark:text-zinc-500 text-base">Nível</p>
            <p>
              <span className="dark:text-zinc-300 text-zinc-700 text-[15px] font-[490]">
                {data?.role || "User"}
              </span>
            </p>
          </div>{" "}
          <div className="items-center flex pt-5 justify-between">
            <p className="dark:text-zinc-500 text-base">Criado em</p>
            <p className="font-mono dark:text-white text-[15px] relative z-10 pt-1">
              {workspaceInfo?.created_at
                ? new Date(workspaceInfo.created_at).toLocaleDateString(
                    "pt-PT",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "Data desconhecida"}
            </p>
          </div>
          <div className="items-center flex pt-5 justify-between">
            <p className="dark:text-zinc-500 text-base">Membros</p>
            {loading ? (
              <p className="flex dark:text-white text-zinc-800 items-center gap-2">
                <span className="loader !w-4 !h-4 !border-2 !border-b-zinc-900 dark:!border-b-zinc-100 !border-zinc-300 dark:!border-zinc-600"></span>
              </p>
            ) : (
              <p>
                <span className="dark:text-zinc-300 text-zinc-700 text-[15px] font-[490]">
                  {Users.length}
                </span>
              </p>
            )}
          </div>
          <div className="items-center flex pt-5 justify-between">
            <p className="dark:text-zinc-500 text-base">Crido por</p>
            <p>
              <span className="dark:text-zinc-300 text-zinc-700 text-[15px] font-[490]">
                {workspaceInfo?.name}({workspaceInfo?.username})
              </span>
            </p>
          </div>
          <div className="flex items-center dark:border-t-zinc-900/30 mt-5 border-t justify-end gap-2">
            <Button
              onClick={() => {
                setDeleteAlert({
                  status: "workspace",
                  open: true,
                });
              }}
              className="py-4  mt-3 bg-red-600/40 border border-red-700 hover:bg-red-600/50 cursor-pointer text-red-800 dark:text-white"
            >
              <Container size={18} className="" />
              Eliminar Workspace
            </Button>
          </div>
        </div>
      </div>
      <EditUser
        open={editUser}
        setOpen={setEditUser}
        setData={setUserData}
        dataUser={data}
      />

      <CreateWorkspace
        open={editWorkspace}
        setOpen={setEditWorkspace}
        setWorkspaceInfo={setWorkspaceInfo}
        mode="EDIT"
        dataWorkspace={workspaceInfo as WorkSpaceProps}
        setWorkspaces={setWorkspaces}
        workspaceId={workspaceInfo?.id as string}
        setErrorMessage={setErrorMessage}
      />

      <AlertDialog
        open={deleteAlert.open}
        onOpenChange={(open) =>
          setDeleteAlert({
            status: deleteAlert.status,
            open,
          })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-medium text-base">
              {deleteAlert.status === "user"
                ? "Tens certeza que queres eliminar a tua conta?"
                : "Tens certeza que queres eliminar este workspace?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteAlert.status === "user"
                ? "Esta ação é irreversível. Todos os seus dados serão permanentemente eliminados. Por favor, confirma que desejas prosseguir com esta ação."
                : "Esta ação é irreversível. O workspace será permanentemente eliminado. Por favor, confirma que desejas prosseguir com esta ação."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={deleteLoading}>
              Cancelar
            </AlertDialogCancel>
            <Button
              disabled={deleteLoading}
              onClick={
                deleteAlert.status === "user" ? deleteUser : deleteWorkspace
              }
              className="py-4 bg-red-600/40 border border-red-700 hover:bg-red-600/50 cursor-pointer text-red-800 dark:text-white"
            >
              <Trash size={18} className="" />
              Eliminar
              {deleteLoading && (
                <span className="loader !w-3 !h-3 !border-2 !border-b-white !border-white/40"></span>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default SettingsSlice;
