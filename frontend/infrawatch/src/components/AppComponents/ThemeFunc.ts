import { getCookie, setCookie } from "cookies-next/client";
import React from "react";

interface ThemeFuncProps {
  isDarkMode?: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const ThemeFunc = ({ setIsDarkMode }: ThemeFuncProps) => {
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = getCookie("theme");

  if (isDarkMode && savedTheme !== "light") {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
    setCookie("theme", "dark", {
      maxAge: 60 * 60 * 24 * 30,
    });
    setIsDarkMode(true);
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    setCookie("theme", "light", {
      maxAge: 60 * 60 * 24 * 30,
    });
    setIsDarkMode(false);
  }
};

const changeTheme = ({ isDarkMode, setIsDarkMode }: ThemeFuncProps) => {
  const newTheme = isDarkMode ? "light" : "dark";
  setCookie("theme", newTheme, {
    maxAge: 60 * 60 * 24 * 30,
  });
  document.documentElement.classList.remove(isDarkMode ? "dark" : "light");
  document.documentElement.classList.add(isDarkMode ? "light" : "dark");
  setIsDarkMode(!isDarkMode);
};

export { ThemeFunc, changeTheme };
