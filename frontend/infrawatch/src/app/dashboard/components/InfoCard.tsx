import { UserData } from "@/app/chooseWorkspace/[id]/page";
import { LogOut } from "@/components/AppComponents/decodeToken";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";

interface IInfoCard {
  showInfo: boolean;
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
  userData?: UserData | null;
}

const InfoCard: React.FC<IInfoCard> = ({ showInfo, setShowInfo, userData }) => {
  return (
    <AlertDialog open={showInfo} onOpenChange={setShowInfo}>
      <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-medium"></AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
          <div className="flex gap-3">
            <header className="border-b w-full items-center justify-between dark:border-b-zinc-800 pb-3 flex gap-3">
              <div className="text-start">
                <p className="dark:text-white text-lg">{userData?.name}</p>
                <p>
                  <span className="dark:text-zinc-300 text-zinc-700 text-[15px] font-[450]">
                    {userData?.email}
                  </span>
                </p>
              </div>
              <div></div>
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
            <Button
              onClick={LogOut}
              className="py-4 w-full mt-5 bg-red-600/40 border border-red-700 hover:bg-red-600/50 cursor-pointer text-red-800 dark:text-white"
            >
              <ArrowLeft size={18} className="" />
              Terminar sessão
            </Button>
            <AlertDialogCancel className="w-full cursor-pointer">
              OK
            </AlertDialogCancel>
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InfoCard;
