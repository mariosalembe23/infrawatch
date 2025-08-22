import Image from "next/image";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {  useState } from "react";
import { Button } from "../ui/button";
import { ArrowRightIcon, EyeIcon, EyeOffIcon, Plus } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import axios from "axios";
import { APIS, GenericAxiosActions } from "./API";
import { toast } from "sonner";
import decodeJwtToken from "./decodeToken";
import OTPCard from "./OTPCode";
import { setCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";

interface LoginSliceProps {
  setSlice: React.Dispatch<React.SetStateAction<"login" | "register">>;
  isDarkMode: boolean;
}

type LoginFormFields = {
  email: string;
  password: string;
};

const LoginSlice: React.FC<LoginSliceProps> = ({ setSlice, isDarkMode }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
  const [openOTP, setOpenOTP] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const { register, handleSubmit, watch } = useForm<LoginFormFields>({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const requestOTPCode = async () => {
    try {
      const response = await axios.post(
        APIS.REQUEST_CODE,
        {
          username: watch("email"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Código enviado com sucesso!", {
          position: "top-right",
        });
        setOpenOTP(true);
      }
    } catch (error) {
      GenericAxiosActions({ error });
    }
  };

  const handleLogin = async (data: LoginFormFields) => {
    try {
      setLoading(true);
      const response = await axios.post(APIS.LOGIN, {
        username: data.email,
        password: data.password,
      });

      if (response.status === 200) {
        toast.success("Login bem-sucedido!", {
          position: "top-right",
        });
        const data = decodeJwtToken(response.data.token);

        if (
          typeof data === "object" &&
          data !== null &&
          "is_active" in data &&
          "id" in data
        ) {
          setCookie("token", response.data.token, {
            maxAge: 60 * 60 * 24 * 5,
          });
          if (!data.is_active) {
            await requestOTPCode();
            return;
          } else {
            setOpenOTP(false);
            router.push(`/chooseWorkspace/${data.id}`);
          }
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      GenericAxiosActions({ error });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="max-w-80 w-full">
      <header className="text-center">
        <span className="flex items-center gap-2 mb-2 flex-col">
          <svg
            className="dark:text-black text-white size-7"
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
          <p className="text-2xl dark:text-white">Infra Watch</p>
        </span>
        <p className="text-lg font-[430] text-[15.55px] tetx-zinc-600 dark:text-zinc-400 mb-4">
          Bem-vindo ao Infra Watch, a plataforma de monitoramento de
          infraestruturas!
        </p>
      </header>
      <div>
        <div className="flex flex-col items-center justify-center gap-2 w-full">
          <button
            disabled={true}
            className="flex w-full px-5 disabled:opacity-65 grotesk items-center gap-2 rounded-lg dark:text-white transition-all hover:border-cyan-500 cursor-pointer font-[450] border dark:border-zinc-800 py-2 justify-center"
          >
            <Image
              src={"/icons/google.svg"}
              alt="Google Logo"
              width={25}
              height={25}
            />
            Continuar com o Google
          </button>
          <button
            disabled={true}
            className="flex w-full px-5 disabled:opacity-65 grotesk items-center gap-2 rounded-lg transition-all dark:text-white hover:border-cyan-500 cursor-pointer font-[450] border dark:border-zinc-800 py-2 justify-center"
          >
            <Image
              src={"/icons/linkedin.svg"}
              alt="Google Logo"
              width={25}
              height={25}
            />
            Continuar com o LinkedIn
          </button>
        </div>
        <div className="w-full relative flex items-center justify-center my-8">
          <hr className="w-full dark:border-zinc-800" />
          <p className="absolute px-5 text-[15px] bg-white dark:bg-black dark:text-white">
            Ou
          </p>
        </div>
        <div className="w-full flex flex-col gap-5">
          <div className="*:not-first:mt-2">
            <Label
              htmlFor={"email"}
              className="font-[450] dark:text-white text-[15px]"
            >
              E-mail
            </Label>
            <Input
              id={"email"}
              {...register("email", {
                required: "E-mail ou username é obrigatório.",
              })}
              placeholder="Email"
              className="shadow-none dark:!ring-cyan-500/30 border-zinc-300 dark:border-zinc-800 dark:text-white py-5 text-base font-[450] dark:focus:!border-cyan-500/80 "
              type="email"
            />
          </div>
          <div className="*:not-first:mt-2">
            <Label
              htmlFor={"password"}
              className="font-[450] dark:text-white text-[15px]"
            >
              Palavra-chave
            </Label>
            <div className="relative">
              <Input
                id={"password"}
                {...register("password", {
                  required: "Palavra-chave é obrigatória.",
                })}
                className="shadow-none dark:!ring-cyan-500/30 border-zinc-300 dark:border-zinc-800 dark:text-white py-5 text-base font-[450] dark:focus:!border-cyan-500/80 "
                placeholder="Password"
                type={isVisible ? "text" : "password"}
              />
              <button
                className="text-muted-foreground/80 hover:text-white focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                onClick={toggleVisibility}
                aria-label={isVisible ? "Hide password" : "Show password"}
                aria-pressed={isVisible}
                aria-controls="password"
              >
                {isVisible ? (
                  <EyeOffIcon size={16} aria-hidden="true" />
                ) : (
                  <EyeIcon size={16} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          <div className="text-center">
            <Button
              type="submit"
              disabled={loading}
              className="py-5  w-full bg-cyan-600/70 dark:bg-cyan-600/40 border border-cyan-700 hover:bg-cyan-600/50 cursor-pointer text-white"
            >
              {loading && (
                <span className="loader !text-base !w-4 !h-4 !border-2 !border-b-white !border-white/40"></span>
              )}
              Iniciar sessão <ArrowRightIcon size={18} className="" />
            </Button>
            <Button
              type="button"
              disabled={loading}
              onClick={() => setSlice("register")}
              className="group mt-2 text-base border border-zinc-900 w-full bg-zinc-950 py-5 hover:border-zinc-800 text-white cursor-pointer shadow-none"
            >
              Criar uma conta
              <Plus
                className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                size={16}
                aria-hidden="true"
              />
            </Button>
            <Link
              href={"/dashboard"}
              className="inline-flex mt-5 transition-all dark:hover:text-white hover:opacity-75 dark:text-zinc-400 underline"
            >
              Esqueci a minha palavra-chave
            </Link>
          </div>
        </div>
      </div>
      <OTPCard
        openOTP={AdiiopenOTP}
        setOpenOTP={setOpenOTP}
        email={watch("email")}
      />
    </form>
  );
};

export default LoginSlice;
