"use client";

import { createContext } from "react";
import { UserData, WorkSpaceProps } from "@/app/chooseWorkspace/[id]/page";

export interface DashboardContextType {
  userData: UserData | null;
  workSpaceInfo: WorkSpaceProps | null;
  loading: boolean;
  userLoading: boolean;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DashboardContext = createContext<DashboardContextType | null>(null);
