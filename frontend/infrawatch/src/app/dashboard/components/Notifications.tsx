import { APIS, GenericAxiosActions } from "@/components/AppComponents/API";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import axios from "axios";
import { getCookie } from "cookies-next";
import { Megaphone } from "lucide-react";
import React, { useEffect, useRef } from "react";


interface INotifications {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageError: React.Dispatch<React.SetStateAction<string>>;
  workspace_id: string;
}

interface NotificationsProps {
  title: string;
  content: string;
  workspaceId: string;
  created_at: string;
}

const Notifications: React.FC<INotifications> = ({
  open,
  setOpen,
  setMessageError,
  workspace_id,
}) => {
  const [notifications, setNotifications] = React.useState<
    NotificationsProps[]
  >([]);


  useEffect(() => {
    if (!workspace_id) {
      return;
    }
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          APIS.GET_NOTIFICATIONS + workspace_id,
          {
            headers: {
              Authorization: `Bearer ${getCookie("token")}`,
            },
          }
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        GenericAxiosActions({
          error,
          message: "Erro ao buscar notifications",
          setErrorMessage: setMessageError,
        });
      }
    };

    fetchNotifications();
  }, [setMessageError, workspace_id]);

  const verifyIfPasteOneHour = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffHours = diff / (1000 * 60 * 60);
    return diffHours <= 1;
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right">
        <SheetHeader className="border-b">
          <SheetTitle className="text-xl font-medium">
            <Megaphone className="inline mb-1 size-5 me-2" />
            Notificações
          </SheetTitle>
          <SheetDescription className="-mt-1"></SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full px-4 overflow-y-auto grid grid-cols-1">
          {notifications.map((notification, index) => (
            <div key={index} className="border-b px-2 py-4">
              <h3 className="flex items-center gap-2">
                <span
                  className={`border-background  size-3 rounded-full border-2 ${
                    verifyIfPasteOneHour(notification.created_at)
                      ? "bg-zinc-500"
                      : "bg-cyan-500"
                  } `}
                ></span>
                {notification.title}
              </h3>
              <p className="dark:text-zinc-200 text-zinc-700 pt-1 dark:font-[410] text-[15px]">
                {notification.content}
              </p>
              <p className="text-end text-zinc-600 dark:text-zinc-500 text-[14px]">
                {new Date(notification.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default Notifications;
