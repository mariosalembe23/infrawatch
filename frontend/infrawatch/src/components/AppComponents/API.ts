import axios from "axios";
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
};

export const GenericAxiosActions = ({
  error,
  message = "Erro na requisição. Tente novamente.",
}: {
  error: unknown;
  message?: string;
}) => {
  if (axios.isAxiosError(error) && error.response) {
    if (error.response.status >= 400 && error.response.status < 500) {
      if (error.response.status >= 401 && error.response.status <= 403) {
        toast.error("Sua sessão expirou. Faça login novamente.", {
          position: "top-right",
        });
        window.location.href = "/";
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
