"use client";

import React, { useEffect, useRef, useState } from "react";
import { OTPInput, SlotProps } from "input-otp";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { APIS, GenericAxiosActions } from "./API";
import { getCookie } from "cookies-next/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import decodeJwtToken from "./decodeToken";

interface OTPCardProps {
  openOTP: boolean;
  setOpenOTP: React.Dispatch<React.SetStateAction<boolean>>;
  email: string;
}

const OTPCard: React.FC<OTPCardProps> = ({ openOTP, setOpenOTP, email }) => {
  const [value, setValue] = useState("");
  const [hasGuessed, setHasGuessed] = useState<undefined | boolean>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (hasGuessed) {
      closeButtonRef.current?.focus();
    }
  }, [hasGuessed]);

  async function onSubmit(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault?.();

    try {
      setLoading(true);
      const response = await axios.post(
        APIS.ACTIVATE_ACCOUNT,
        {
          code: value,
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Código verificado com sucesso!", {
          position: "top-right",
        });
        setHasGuessed(true);
        setOpenOTP(false);
        const data = decodeJwtToken(getCookie("token") as string);
        if (typeof data === "object" && data !== null && "id" in data) {
          router.push(`/chooseWorkspace/${(data as { id: string }).id}`);
        }
      } else {
        setHasGuessed(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      GenericAxiosActions({
        error,
        message: "Erro ao verificar o código. Tente novamente.",
      });
    }
  }

  return (
    <Dialog open={openOTP} onOpenChange={setOpenOTP}>
      <DialogContent className="bg-zinc-950 border-zinc-900">
        <div className="flex flex-col items-center gap-2">
          <svg
            className="text-black size-9"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="56" height="56" rx="7" fill="#fff" />
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

          <DialogHeader className="pt-4">
            <DialogTitle className="sm:text-center text-xl font-medium text-white">
              {hasGuessed ? "Código Verificado!" : "Insira o código"}
            </DialogTitle>
            <DialogDescription className="sm:text-center !text-zinc-300 text-[15px] -mt-1">
              {hasGuessed
                ? "Seu código foi verificado com sucesso."
                : `Insira o código enviado para o seu e-mail(${email})`}
            </DialogDescription>
          </DialogHeader>
        </div>

        {hasGuessed ? (
          <div className="text-center">
            <DialogClose asChild>
              <Button type="button" ref={closeButtonRef}>
                Close
              </Button>
            </DialogClose>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-center">
              <OTPInput
                id="cofirmation-code"
                ref={inputRef}
                value={value}
                onChange={setValue}
                containerClassName="flex bg-zinc-900 items-center gap-3 has-disabled:opacity-50"
                maxLength={6}
                onFocus={() => setHasGuessed(undefined)}
                render={({ slots }) => (
                  <div className="flex gap-2">
                    {slots.map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>
                )}
                onComplete={onSubmit}
              />
            </div>
            {loading ? (
              <p className="flex items-center gap-2 text-white justify-center">
                <span className="loader !w-4 !h-4 !border-2 !border-b-white !border-white/40"></span>
                Verificando...
              </p>
            ) : (
              <>
                {hasGuessed === false && (
                  <p
                    className="text-red-200/70 text-center text-[15px]"
                    role="alert"
                    aria-live="polite"
                  >
                    Código incorreto. Tente novamente.
                  </p>
                )}
                <p className="text-center pt-5 text-white text-[15px]">
                  <button className="underline cursor-pointer hover:no-underline">
                    Reenviar código
                  </button>
                </p>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "border-input bg-background text-foreground flex size-9 items-center justify-center rounded-md border font-medium shadow-xs transition-[color,box-shadow]",
        { "border-ring ring-ring/50 z-10 ring-[3px]": props.isActive }
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}

export default OTPCard;
