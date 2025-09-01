"use client";

import decodeJwtToken from "@/components/AppComponents/decodeToken";
import { setCookie } from "cookies-next";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const Redirect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token && typeof token === "string") {
      const data = decodeJwtToken(token as string);

      if (data && typeof data === "object" && "id" in data) {
        setCookie("token", token, {
          maxAge: 60 * 60 * 24 * 5,
        });
        router.push(`/chooseWorkspace/${data?.id}`);
      } else {
        setCookie("errorGoogle", "Erro ao fazer login com o Google", {
          maxAge: 60 * 60 * 24 * 5,
        });
        router.push("/");
      }
    }
  }, [token, router]);

  return (
    <div className="flex justify-center items-center  grotesk h-screen">
      <h1 className="text-2xl font-medium animate-pulse dark:text-white text-black">
        Redirecionando...
      </h1>
    </div>
  );
};

export default Redirect;
