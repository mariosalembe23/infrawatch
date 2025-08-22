"use client";

import { useState } from "react";
import LoginSlice from "@/components/AppComponents/LoginSlice";
import RegisterSlice from "@/components/AppComponents/RegisterSlice";

export default function Home() {
  const [slice, setSlice] = useState<"login" | "register">("login");

  return (
    <div className="grid bg-black h-dvh w-full grid-cols-1 pot:grid-cols-[35%_65%]">
      <div className="bg-[url('/app/login_build.jpg')] bg-cover pot:inline-flex hidden bg-center"></div>
      <div className="flex items-center justify-center">
        {slice === "login" ? (
          <LoginSlice setSlice={setSlice} />
        ) : (
          <RegisterSlice setSlice={setSlice} />
        )}
      </div>
    </div>
  );
}
