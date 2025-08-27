import { Button } from "@/components/ui/button";
import { ArrowLeft, Bolt, Menu, PanelLeft, Sun } from "lucide-react";
import Image from "next/image";
import React from "react";
import BottomMenuSheet from "./BottomMenuSheet";
import { changeTheme } from "@/components/AppComponents/ThemeFunc";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DashboardContext } from "../[id]/ContextProvider";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Tabs = "server" | "network" | "endpoint" | "dashboard";

interface IMainHeader {
  showSideBar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setTabs: React.Dispatch<React.SetStateAction<Tabs>>;
}

const MainHeader: React.FC<IMainHeader> = ({
  showSideBar,
  setShowSidebar,
  setTabs,
}) => {
  const [open, setOpen] = React.useState(false);
  const dashboardContext = React.useContext(DashboardContext);
  const userData = dashboardContext?.userData;
  const isDarkMode = dashboardContext?.isDarkMode;
  const setIsDarkMode = dashboardContext?.setIsDarkMode;
  const workSpaceInfo = dashboardContext?.workSpaceInfo;
  const [showInfo, setShowInfo] = React.useState<boolean>(false);

  return (
    <header className="sticky bg-white/10 dark:bg-[#060607]/10 backdrop-blur-2xl top-0 left-0 w-full h-16 z-20 border-b dark:border-zinc-900 flex items-center justify-between px-5 ret:px-7">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className="border transition-all cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-900 dark:border-zinc-900 w-9 h-9 rounded-full pot:hidden flex items-center justify-center"
        >
          <Menu size={20} className="dark:text-white" />
        </button>
        {!showSideBar && (
          <Button
            onClick={() => setShowSidebar((prev) => !prev)}
            size={"icon"}
            className="rounded-full border size-8 cursor-pointer border-zinc-800"
          >
            <PanelLeft size={25} className="text-white size-4" />
          </Button>
        )}
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
        <p className="dark:text-cyan-500 text-cyan-600 ret:inline-flex hidden">
          {workSpaceInfo?.workspace_name}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setShowInfo(true)}
                className="p-1 cursor-pointer rounded-full bg-[#161616] border border-zinc-800 flex gap-3 items-center"
              >
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
              </button>
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
                <Button className="py-4 w-full mt-5 bg-red-600/40 border border-red-700 hover:bg-red-600/50 cursor-pointer text-white">
                  <ArrowLeft size={18} className="" />
                  Terminar sessão
                </Button>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          size={"icon"}
          className="rounded-full cursor-pointer hover:bg-gray-200 bg-gray-50 shadow-none border dark:bg-zinc-900 dark:hover:bg-zinc-950 dark:border-zinc-800"
        >
          <Bolt size={18} className="dark:text-white text-black size-5" />
        </Button>
        <Button
          size={"icon"}
          onClick={() =>
            setIsDarkMode &&
            changeTheme({
              isDarkMode,
              setIsDarkMode,
            })
          }
          className="rounded-full hover:bg-gray-200 cursor-pointer bg-gray-50 shadow-none border dark:bg-zinc-900 dark:hover:bg-zinc-950 dark:border-zinc-800"
        >
          <Sun size={18} className="dark:text-white text-black size-5" />
        </Button>
      </div>
      <BottomMenuSheet open={open} setOpen={setOpen} setTabs={setTabs} />
      <AlertDialog open={showInfo} onOpenChange={setShowInfo}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-medium"></AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
            <div className="flex gap-3">
              <header className="border-b w-full items-center justify-between dark:border-b-zinc-800 pb-3 flex gap-3">
                <div>
                  <p className="dark:text-white text-lg">{userData?.name}</p>
                  <p>
                    <span className="dark:text-zinc-300 text-zinc-700 text-[15px] font-[450]">
                      {userData?.email}
                    </span>
                  </p>
                </div>
                <div>
                  <Button
                    size={"icon"}
                    className="rounded-full dark:bg-[#161616] hover:bg-gray-200 transition-all shadow-none bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer border dark:border-zinc-800"
                  >
                    <Bolt
                      size={18}
                      className="dark:text-white text-zinc-800 size-5"
                    />
                  </Button>
                </div>
              </header>
            </div>
            <div className="items-center flex pt-5 justify-between">
              <p className="dark:text-white text-base">Estado</p>
              <p>
                <span className="dark:text-green-500 text-green-600 text-[14px] font-[490]">
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
            <div className="flex flex-col gap-2">
              <Button className="py-4 w-full mt-5 bg-red-600/40 border border-red-700 hover:bg-red-600/50 cursor-pointer text-red-800 dark:text-white">
                <ArrowLeft size={18} className="" />
                Terminar sessão
              </Button>
              <AlertDialogCancel className="w-full cursor-pointer">
                OK
              </AlertDialogCancel>
            </div>
          </AlertDialogHeader>
          {/* <AlertDialogFooter>
            
            <AlertDialogAction>Okay</AlertDialogAction>
          </AlertDialogFooter> */}
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default MainHeader;
