"use client";

import { useEffect, useState } from "react";
import LoginSlice from "@/components/AppComponents/LoginSlice";
import RegisterSlice from "@/components/AppComponents/RegisterSlice";
import { ThemeFunc } from "@/components/AppComponents/ThemeFunc";
import { isLoggedIn } from "@/components/AppComponents/decodeToken";
import { useRouter, useSearchParams } from "next/navigation";
import ServiceNotFound from "@/components/AppComponents/ServiceNotFound";

export default function Home() {
  const [slice, setSlice] = useState<"login" | "register">("login");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      alert(message);
      router.replace("/");
    }
  }, [router, searchParams]);

  useEffect(() => {
    ThemeFunc({ setIsDarkMode });
    const { status, id } = isLoggedIn();

    if (status) {
      router.push(`/chooseWorkspace/${id}`);
    }
  }, [router]);

  return (
    <div className="grid h-dvh w-full grid-cols-1 pot:grid-cols-[35%_65%]">
      {errorMessage.length > 0 && (
        <ServiceNotFound messageError={errorMessage} />
      )}
      <div className="bg-[url('/app/login_build.jpg')] bg-cover pot:inline-flex hidden bg-center"></div>
      <div className="flex items-center justify-center overflow-y-auto py-10">
        {slice === "login" ? (
          <LoginSlice
            setSlice={setSlice}
            setErrorMessage={setErrorMessage}
            isDarkMode={isDarkMode}
          />
        ) : (
          <RegisterSlice
            setSlice={setSlice}
            setErrorMessage={setErrorMessage}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  );
}
