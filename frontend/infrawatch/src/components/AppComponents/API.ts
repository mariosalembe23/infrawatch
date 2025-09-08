import axios from "axios";
import { deleteCookie } from "cookies-next";
import React from "react";
import { toast } from "sonner";

export const APIS = {
  REGISTER: "https://infra-watch-zeta.vercel.app/api/v1/user/create",
  LOGIN: "https://infra-watch-zeta.vercel.app/api/v1/auth/login",
  REQUEST_CODE: "https://infra-watch-zeta.vercel.app/api/v1/auth/send_code",
  ACTIVATE_ACCOUNT:
    "https://infra-watch-zeta.vercel.app/api/v1/auth/active_account",
  GET_WORKSPACES: "https://infra-watch-zeta.vercel.app/api/v1/workspace/get/my",
  CREATE_WORKSPACE:
    "https://infra-watch-zeta.vercel.app/api/v1/workspace/create",
  GET_USER: "https://infra-watch-zeta.vercel.app/api/v1/user/me",
  ALL_USERS_WORKSPACE: "https://infra-watch-zeta.vercel.app/api/v1/user/get/",
  ADD_MEMBER_WORKSPACE: "https://infra-watch-zeta.vercel.app/api/v1/user/add/",
  CREATE_SERVER: "https://infra-watch-zeta.vercel.app/api/v1/server/create/",
  EDIT_USER: "https://infra-watch-zeta.vercel.app/api/v1/user/update",
  DELETE_USER: "https://infra-watch-zeta.vercel.app/api/v1/user/delete/",
  REMOVE_FROM_WORKSPACE:
    "https://infra-watch-zeta.vercel.app/api/v1/user/remove/",
  EDIT_WORKSPACE:
    "https://infra-watch-zeta.vercel.app/api/v1/workspace/update/",
  DELETE_WORKSPACE:
    "https://infra-watch-zeta.vercel.app/api/v1/workspace/delete/",
  GET_NOTIFICATIONS:
    "https://infra-watch-zeta.vercel.app/api/v1/notifications/get/",
  GET_SERVERS: "https://infra-watch-zeta.vercel.app/api/v1/server/get/",
  DELETE_SERVER: "https://infra-watch-zeta.vercel.app/api/v1/server/delete/",
  EDIT_SERVER: "https://infra-watch-zeta.vercel.app/api/v1/server/put/",
  GET_ENDPOINTS: "https://infra-watch-zeta.vercel.app/api/v1/endpoint/list/",
  CREATE_ENDPOINT: "https://infra-watch-zeta.vercel.app/api/v1/endpoint/add/",
  GET_DEVICES: "https://infra-watch-zeta.vercel.app/api/v1/device/list/",
  CREATE_DEVICE: "https://infra-watch-zeta.vercel.app/api/v1/device/add/",
  DELETE_ENDPOINT: "https://infra-watch-zeta.vercel.app/api/v1/endpoint/delete/"
};

export const GenericAxiosActions = ({
  error,
  message = "Erro na requisição. Tente novamente.",
  isOnPage = false,
  setErrorMessage,
}: {
  error: unknown;
  message?: string;
  isOnPage?: boolean;
  undefinedRecourse?: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  if (axios.isAxiosError(error) && error.response) {
    if (error.response.status >= 400 && error.response.status < 500) {
      if (
        error.response.status >= 401 &&
        error.response.status < 403 &&
        !isOnPage
      ) {
        toast.error("Sua sessão expirou. Faça login novamente.", {
          position: "top-right",
        });
        deleteCookie("token");
        window.location.href = "/";
        return;
      } else if (error.response.status === 404) {
        toast.error("Recurso não encontrado em " + axios.getUri(error.config), {
          position: "top-right",
        });
        if (setErrorMessage) {
          setErrorMessage(
            "Recurso não encontrado em " + axios.getUri(error.config)
          );
        }
        return;
      }
      toast.error(error.response.data.message || message, {
        position: "top-right",
      });
    } else if (error.response.status >= 500) {
      toast.error("Erro no servidor. Tente novamente mais tarde.", {
        position: "top-right",
      });
    }
    console.error("Axios error:", error);
  }
};

export const removeDoubleSlashes = (input: string): string => {
  return input.replace(/\\/g, "");
};

export const removeSlashes = (input: string): string => {
  if (!input) return "";
  return input.replace(/\/\//g, "/");
};

export const removeUnity = (input: string): number => {
  const number = parseFloat(input.replace(/[^\d.-]/g, ""));
  return isNaN(number) ? 0 : number;
};
