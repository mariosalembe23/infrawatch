import { ChevronRight } from "lucide-react";

interface IButtonCustom {
  children: React.ReactNode;
  title: string;
  type?: "normal" | "danger";
  onClick?: () => void;
  disabled?: boolean;
}

const ButtonCustom: React.FC<IButtonCustom> = ({
  children,
  title,
  type = "normal",
  onClick = () => {},
  disabled = false,
}) => {
  return type === "normal" ? (
    <button
      disabled={disabled}
      onClick={onClick}
      className="flex items-center flex-nowrap font-[430] justify-between transition-all hover:opacity-80 cursor-pointer"
    >
      <span className="flex items-center text-start gap-2 text-black dark:text-white">
        {children}
        {title}
      </span>
      <ChevronRight size={19} className="dark:text-zinc-400" />
    </button>
  ) : (
    <button className="flex items-center font-[430] justify-between transition-all hover:opacity-80 cursor-pointer">
      <span className="flex items-center gap-2 text-black dark:text-white">
        {children}
        <p className="flex relative items-center gap-2">
          {title}
          <span className="border-background absolute animate-pulse ring-2 ring-red-400/30 -end-4 top-2 size-2 rounded-full border-2 bg-red-500">
            <span className="sr-only">Online</span>
          </span>
        </p>
      </span>
      <ChevronRight size={19} className="text-zinc-400" />
    </button>
  );
};

export default ButtonCustom;
