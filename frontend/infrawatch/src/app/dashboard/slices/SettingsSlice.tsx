import { Button } from "@/components/ui/button";
import React from "react";
import { DashboardContext } from "../[id]/ContextProvider";
import {
  CircleUser,
  Container,
  LockOpen,
  ShieldBan,
  SquarePen,
  UserPen,
} from "lucide-react";

interface ISettingsSlice {
  showSideBar: boolean;
}

const SettingsSlice: React.FC<ISettingsSlice> = () => {
  const dashboardContext = React.useContext(DashboardContext);
  const userData = dashboardContext?.userData;
  const workSpaceInfo = dashboardContext?.workSpaceInfo;

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
              className="rounded-full pot:inline-flex hidden cursor-pointer hover:bg-gray-200 bg-gray-50 shadow-none border dark:bg-zinc-900 dark:hover:bg-zinc-950 dark:border-zinc-800"
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
        <div className="p-5 border dark:border-zinc-900/30 rounded-xl">
          <div className="flex gap-3">
            <header className="border-b w-full items-center justify-between dark:border-b-zinc-900/30 pb-3 flex gap-3">
              <div>
                <p className="dark:text-white text-lg leading-none">
                  {userData?.name}
                </p>
                <p>
                  <span className="dark:text-zinc-500 text-zinc-700 text-[15px] font-[450]">
                    {userData?.username}
                  </span>
                </p>
              </div>
              <div>
                <Button
                  size={"icon"}
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
                {userData?.email}
              </span>
            </p>
          </div>
          <div className="items-center flex pt-5 justify-between">
            <p className="dark:text-white text-base">Estado</p>
            <p>
              <span className="dark:text-cyan-500 text-cyan-600 text-[14px] font-[490]">
                {userData?.is_active ? "Ativo" : "Inativo"}
              </span>
            </p>
          </div>
          <div className="items-center flex pt-5 justify-between">
            <p className="dark:text-white text-base">Role</p>
            <p>
              <span className="dark:text-zinc-300 text-zinc-700 text-[14px] font-[490]">
                {userData?.role || "User"}
              </span>
            </p>
          </div>
          <div className="items-center flex pt-5 justify-between">
            <p className="dark:text-white text-base">Criado em</p>
            <p className="font-mono dark:text-white text-[15px] relative z-10 pt-1">
              {userData?.created_at
                ? new Date(userData.created_at).toLocaleDateString("pt-PT", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Data desconhecida"}
            </p>
          </div>
          <div className="flex items-center pt-3 dark:border-t-zinc-900/30 mt-5 border-t justify-end gap-2">
            <Button className="dark:bg-[#161616] dark:hover:bg-zinc-800 text-white cursor-pointer border border-zinc-800">
              <ShieldBan size={18} className="" />
              Desativar Conta
            </Button>
            <Button className="py-4  bg-red-600/40 border border-red-700 hover:bg-red-600/50 cursor-pointer text-red-800 dark:text-white">
              <CircleUser size={18} className="" />
              Eliminar Conta
            </Button>
          </div>
        </div>

        <div className="p-5 border dark:border-zinc-900/30 rounded-xl">
          <div className="flex gap-3">
            <header className="border-b w-full items-center justify-between dark:border-b-zinc-900/30 pb-3 flex gap-3">
              <div>
                <p className="dark:text-white text-lg leading-none">
                  Workspace
                </p>
                <p>
                  <span className="dark:text-zinc-300 text-zinc-700 text-[15px] font-[450]">
                    {workSpaceInfo?.workspace_name}
                  </span>
                </p>
              </div>
              <div>
                <Button
                  size={"icon"}
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
            <p>{workSpaceInfo?.about || "Nenhuma descrição fornecida."}</p>
          </div>
          <div className="items-center flex pt-5 justify-between">
            <p className="dark:text-zinc-500 text-base">Nível</p>
            <p>
              <span className="dark:text-zinc-300 text-zinc-700 text-[15px] font-[490]">
                {userData?.role || "User"}
              </span>
            </p>
          </div>{" "}
          <div className="items-center flex pt-5 justify-between">
            <p className="dark:text-zinc-500 text-base">Criado em</p>
            <p className="font-mono dark:text-white text-[15px] relative z-10 pt-1">
              {workSpaceInfo?.created_at
                ? new Date(workSpaceInfo.created_at).toLocaleDateString(
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
            <p>
              <span className="dark:text-zinc-300 text-zinc-700 text-[15px] font-[490]">
                10
              </span>
            </p>
          </div>
          <div className="items-center flex pt-5 justify-between">
            <p className="dark:text-zinc-500 text-base">Crido por</p>
            <p>
              <span className="dark:text-zinc-300 text-zinc-700 text-[15px] font-[490]">
                {workSpaceInfo?.name}({workSpaceInfo?.username})
              </span>
            </p>
          </div>
          <div className="flex items-center dark:border-t-zinc-900/30 mt-5 border-t justify-end gap-2">
            <Button className="py-4  mt-3 bg-red-600/40 border border-red-700 hover:bg-red-600/50 cursor-pointer text-red-800 dark:text-white">
              <Container size={18} className="" />
              Eliminar Workspace
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SettingsSlice;
