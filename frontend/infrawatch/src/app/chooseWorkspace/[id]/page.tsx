"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Bolt, Container, Plus, Sun } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { isLoggedIn } from "@/components/AppComponents/decodeToken";
import axios from "axios";
import { APIS, GenericAxiosActions } from "@/components/AppComponents/API";
import { toast } from "sonner";
import { getCookie } from "cookies-next/client";
import LoadingComponent from "@/components/AppComponents/LoadComponent";
import CreateWorkspace from "@/components/AppComponents/CreateWorkSpace";
import { Skeleton } from "@/components/ui/skeleton";
import { changeTheme, ThemeFunc } from "@/components/AppComponents/ThemeFunc";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ChooseWorkspaceComponent: React.FC<WorkSpaceProps> = ({
  company_name,
  about,
  created_at,
}) => {
  return (
    <div className="dark:bg-zinc-900 bg-[#fff] group hover:border-gray-400 transition-all dark:hover:border-white/30 hover:border-dashed cursor-pointer h-56 overflow-hidden relative flex flex-col justify-between border dark:border-zinc-900/50 p-5 rounded-3xl gap-3">
      <span className="flex absolute group-hover:-bottom-14 transition-all -bottom-16 -right-16 items-center gap-2 mb-2 flex-col">
        <Container
          size={50}
          strokeWidth={1}
          className="dark:text-zinc-950/50 dark:group-hover:text-zinc-800/40 text-gray-200 transition-all size-48 mb-2"
        />
      </span>
      <header>
        <h2 className="dark:text-white text-lg">
          {company_name || "Nome do Espaço de Trabalho"}
        </h2>
        <p className="dark:text-zinc-500 text-zinc-600 pt-2 text-[15px]">
          {about || "Descrição do espaço de trabalho"}
        </p>
      </header>
      <footer>
        <div className="flex  -space-x-[0.525rem]">
          <Avatar>
            <AvatarFallback className="bg-zinc-900 border-2 border-zinc-950 text-white font-medium text-[14px] leading-none">
              KK
            </AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-zinc-900 border-2 border-zinc-950 text-white font-medium text-[14px] leading-none">
              AZ
            </AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-zinc-900 border-2 border-zinc-950 text-white font-medium text-[14px] leading-none">
              ZI
            </AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-zinc-900 border-2 border-zinc-950 text-white font-medium text-[14px] leading-none">
              +3
            </AvatarFallback>
          </Avatar>
        </div>
        <p className="font-mono dark:text-white text-[14px] relative z-10 pt-1">
          Criado em{" "}
          {new Date(created_at).toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </footer>
    </div>
  );
};

export interface WorkSpaceProps {
  id: string;
  company_name: string;
  about: string;
  email: string;
  created_at: string;
  userId: string;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  created_at: string;
  role: string;
  username: string;
  is_active: boolean;
}

export default function ChooseWorkspace() {
  const { id } = useParams();
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [workspaces, setWorkspaces] = useState<WorkSpaceProps[]>([]);
  const [openCreateWorkspace, setOpenCreateWorkspace] =
    useState<boolean>(false);
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    ThemeFunc({ setIsDarkMode });
  }, []);

  useEffect(() => {
    const isLogged = isLoggedIn();

    if (isLogged) {
      setIsOnline(true);
    } else {
      setIsOnline(false);
      toast.error("Por favor, inicie sessão para continuar.", {
        position: "top-right",
      });
      router.push("/");
    }
  }, [id, router]);

  useEffect(() => {
    const fecthWorkspaces = async () => {
      if (!isOnline) return;

      try {
        setLoading(true);
        const response = await axios.get(APIS.GET_WORKSPACES, {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        });
        setLoading(false);
        if (response.status === 200) {
          setWorkspaces(response.data || []);
        }
      } catch (error) {
        setLoading(false);
        GenericAxiosActions({
          error,
          message: "Erro ao buscar espaços de trabalho.",
        });
      }
    };

    const fetchUserData = async () => {
      try {
        setUserLoading(true);
        const response = await axios.get(APIS.GET_USER, {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        });
        setUserLoading(false);
        setUserData(response.data);
        console.log("User data fetched:", response.data);
      } catch (error) {
        setUserLoading(false);
        GenericAxiosActions({
          error,
          message: "Erro ao buscar dados do usuário.",
        });
      }
    };

    fecthWorkspaces();
    fetchUserData();
  }, [isOnline]);

  return (
    <div className="">
      {(loading || userLoading) && <LoadingComponent />}
      <header className="w-full sticky top-0 left-0 right-0 py-4 bg-white/40 dark:bg-black/40 backdrop-blur-md flex px-7 items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="dark:text-black text-white size-5"
            viewBox="0 0 56 56"
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="56"
              height="56"
              rx="7"
              fill={isDarkMode ? "#fff" : "#000"}
            />
            <path
              d="M10 37C10 31.4772 14.4772 27 20 27V27V56H10V37Z"
              fill="currentColor"
            />
            <path
              d="M23 24C23 18.4772 27.4772 14 33 14V14V56H23V24Z"
              fill="currentColor"
            />
            <path
              d="M36 17C36 11.4772 40.4772 7 46 7V7V56H36V17Z"
              fill="currentColor"
            />
          </svg>
          <h1 className="dark:text-white text-xl">Infra Watch</h1>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-1 rounded-full bg-[#161616] border border-zinc-800 flex gap-3 items-center">
                  <Image
                    src={"/app/male.svg"}
                    width={100}
                    height={100}
                    alt="User Avatar"
                    className="rounded-full size-7"
                  />
                  <p className="pe-3 ret:inline-flex hidden text-white">
                    {userData?.name || "Usuário"}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent className="dark w-80 py-3">
                <div className="flex gap-3">
                  <header className="border-b w-full items-center justify-between border-b-zinc-800 pb-3 flex gap-3">
                    <div>
                      <p className="text-white text-base">{userData?.name}</p>
                      <p>
                        <span className="text-zinc-300 text-[14px] font-[450]">
                          {userData?.email}
                        </span>
                      </p>
                    </div>
                    <div>
                      <Button
                        size={"icon"}
                        className="rounded-full dark:bg-[#161616] dark:hover:bg-zinc-800 cursor-pointer border border-zinc-800"
                      >
                        <Bolt size={18} className="text-white size-5" />
                      </Button>
                    </div>
                  </header>
                </div>
                <div className="items-center flex pt-5 justify-between">
                  <p className="text-white text-base">Estado</p>
                  <p>
                    <span className="text-green-500 text-[14px] font-[490]">
                      {userData?.is_active ? "Ativo" : "Inativo"}
                    </span>
                  </p>
                </div>
                <div className="items-center flex pt-5 justify-between">
                  <p className="text-white text-base">Role</p>
                  <p>
                    <span className="text-zinc-300 text-[14px] font-[490]">
                      {userData?.role || "User"}
                    </span>
                  </p>
                </div>
                <div>
                  <Button
                    onClick={() => setOpenCreateWorkspace(true)}
                    className="py-4 w-full mt-5 bg-red-600/40 border border-red-700 hover:bg-red-600/50 cursor-pointer text-white"
                  >
                    <ArrowLeft size={18} className="" />
                    Terminar sessão
                  </Button>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            size={"icon"}
            onClick={() =>
              changeTheme({
                isDarkMode,
                setIsDarkMode,
              })
            }
            className="rounded-full dark:bg-[#161616] cursor-pointer dark:hover:bg-zinc-800 border border-zinc-800"
          >
            <Sun size={18} className="text-white size-5" />
          </Button>
        </div>
      </header>
      <main className=" flex verflow-y-auto  items-center justify-center">
        <section className="max-w-3xl h-full px-5 pt-16 pb-10 mx-auto w-full">
          <header className="text-center mb-10">
            <span className="flex items-center gap-2 mb-2 flex-col">
              <Container
                size={50}
                strokeWidth={1}
                className="dark:text-white text-zinc-500 size-12 mb-2"
              />
            </span>
            <h1 className="dark:text-white text-xl ret:text-2xl uppercase">
              Escolha um Espaço de Trabalho
            </h1>
            <div className="pot:w-[26rem] w-full mx-auto">
              <p className="dark:text-zinc-400 text-zinc-700 font-[410] mt-2">
                Selecione um espaço de trabalho existente ou crie um novo para
                gerenciar seus servidores, dispositivos de rede e endpoints, bem
                como sua aquipa!
              </p>
            </div>
          </header>

          <div className="grid pt-5 justify-center ret:grid-cols-2 grid-cols-1 pot:grid-cols-3 w-full gap-3">
            {loading ? (
              // skeleton enquanto carrega
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ) : workspaces.length > 0 ? (
              workspaces.map((workspace) => (
                <ChooseWorkspaceComponent key={workspace.id} {...workspace} />
              ))
            ) : (
              // só mostra essa mensagem quando loading = false
              <div className="col-span-full bg-zinc-950 rounded-lg p-5 border border-zinc-900/50">
                <p className="text-zinc-500 text-center">
                  Nenhum espaço de trabalho encontrado. Crie um novo espaço de
                  trabalho para começar a monitorar sua infraestrutura.
                </p>
              </div>
            )}
          </div>
          <footer className="flex gap-2  flex-wrap ret:flex-row flex-col-reverse justify-center mt-10">
            <Button
              onClick={() => setOpenCreateWorkspace(true)}
              className="py-5 bg-red-600/70 dark:bg-red-600/40 border border-red-700 hover:bg-red-600/50 cursor-pointer text-white"
            >
              <ArrowLeft size={18} className="" />
              Terminar sessão
            </Button>
            <Button
              onClick={() => setOpenCreateWorkspace(true)}
              className="py-5 bg-cyan-600/70 dark:bg-cyan-600/40 border border-cyan-700 hover:bg-cyan-600/50 cursor-pointer text-white"
            >
              Criar Novo Espaço de Trabalho <Plus size={18} className="" />
            </Button>
          </footer>
        </section>
      </main>

      <CreateWorkspace
        open={openCreateWorkspace}
        setOpen={setOpenCreateWorkspace}
        setWorkspaces={setWorkspaces}
      />
    </div>
  );
}
