"use client";

import { useEffect, useState } from "react";
import LoginSlice from "@/components/AppComponents/LoginSlice";
import RegisterSlice from "@/components/AppComponents/RegisterSlice";
import { ThemeFunc } from "@/components/AppComponents/ThemeFunc";

export default function Home() {
  const [slice, setSlice] = useState<"login" | "register">("login");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    ThemeFunc({ setIsDarkMode });
  }, []);

  return (
    <div className="grid h-dvh w-full grid-cols-1 pot:grid-cols-[35%_65%]">
      <div className="bg-[url('/app/login_build.jpg')] bg-cover pot:inline-flex hidden bg-center"></div>
      <div className="flex items-center justify-center overflow-y-auto py-10">
        {slice === "login" ? (
          <LoginSlice setSlice={setSlice} isDarkMode={isDarkMode} />
        ) : (
          <RegisterSlice setSlice={setSlice} isDarkMode={isDarkMode} />
        )}
      </div>
    </div>
  );
}
