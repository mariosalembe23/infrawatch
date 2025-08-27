import { UserData, WorkSpaceProps } from "@/app/chooseWorkspace/[id]/page";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BadgeCheck } from "lucide-react";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ISwitchWork {
  showInfo: boolean;
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
  userData?: UserData | null;
  workName: string | undefined;
  description: string | undefined;
  workspaces: WorkSpaceProps[];
}

const SwitchWork: React.FC<ISwitchWork> = ({
  showInfo,
  setShowInfo,
  workName,
  description,
  workspaces,
}) => {
  return (
    <AlertDialog open={showInfo} onOpenChange={setShowInfo}>
      <AlertDialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="border-zinc-900 p-3 !py-3"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="!p-0 leading-none"></AlertDialogTitle>
          <AlertDialogDescription className="!p-0 leading-none"></AlertDialogDescription>
          <div className="flex gap-3 -mt-1">
            <header className="border flex-col bg-cyan-500/10 rounded-lg p-3 w-full items-start justify-between  pb-3 flex gap-3">
              <div>
                <h4 className="font-medium gap-1 flex items-center">
                  <BadgeCheck
                    size={16}
                    className="inline-block text-cyan-100"
                  />
                  {workName}
                </h4>
                <p className="text-[13px]">{description?.slice(0, 40)}...</p>
              </div>
            </header>
          </div>
          {workspaces.length > 1 ? (
            <div className="flex flex-col mt-2 gap-2">
              <label htmlFor="select_work" className="ps-2">
                Mudar de workspace
              </label>
              <Select defaultValue="1">
                <SelectTrigger
                  id="select_work"
                  className="border-zinc-900 py-5 cursor-pointer"
                >
                  <SelectValue placeholder="Adicione uma permissão" />
                </SelectTrigger>
                <SelectContent>
                  {workspaces.map((work) => (
                    <SelectItem key={work.id} value={work.id}>
                      {work.workspace_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <p className="text-center pt-1 text-zinc-500 text-[14px]">
                Sem outros workspaces disponíveis. Crie ou junte-se a um novo
                workspace.
              </p>
            </div>
          )}

          <div className="flex border-t pt-3 mt-3 flex-col gap-2">
            <AlertDialogCancel className="w-full py-5 border-zinc-900 cursor-pointer">
              Cancelar
            </AlertDialogCancel>
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SwitchWork;
