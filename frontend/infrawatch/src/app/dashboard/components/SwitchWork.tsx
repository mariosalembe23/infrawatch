import { UserData, WorkSpaceProps } from "@/app/chooseWorkspace/[id]/page";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BadgeCheck, CheckCheck } from "lucide-react";
import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
  const [selectedWork, setSelectedWork] = React.useState<{
    id: string;
    workspace_name: string;
  }>({
    id: "",
    workspace_name: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (workspaces.length > 0) {
      setSelectedWork({
        id: workspaces[0].id,
        workspace_name: workspaces[0].workspace_name,
      });
    }
  }, [workspaces]);

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
              <label
                htmlFor="select_work"
                className="ps-2 text-[15px] text-zinc-400"
              >
                Mudar de workspace
              </label>
              <Select
                defaultValue="1"
                onValueChange={(value) => {
                  const work = workspaces[Number(value) - 1];
                  setSelectedWork({
                    id: work.id,
                    workspace_name: work.workspace_name,
                  });
                }}
              >
                <SelectTrigger
                  id="select_work"
                  className="border-zinc-900 text-base py-5 cursor-pointer"
                >
                  <SelectValue placeholder="Adicione uma permissão" />
                </SelectTrigger>
                <SelectContent>
                  {workspaces.map((work, index) => (
                    <SelectItem
                      key={work.id}
                      className="text-base"
                      value={String(index + 1)}
                    >
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
            {workspaces.length > 1 && (
              <Button
                disabled={
                  workspaces.length < 2 ||
                  selectedWork.id === "" ||
                  selectedWork.workspace_name === "" ||
                  selectedWork.workspace_name === workName
                }
                onClick={() => {
                  router.push(`/dashboard/${selectedWork.id}`);
                }}
                className="py-5 bg-cyan-600/40 border border-cyan-700 hover:bg-cyan-600/50 cursor-pointer text-cyan-800 dark:text-white"
              >
                Mudar
                <CheckCheck size={18} className="" />
              </Button>
            )}
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
