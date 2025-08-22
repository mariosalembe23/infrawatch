import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface IButtonCustom {
  children: React.ReactNode;
  title: string;
  type?: "normal" | "danger";
  onClick?: () => void;
}

const ButtonCustom: React.FC<IButtonCustom> = ({
  children,
  title,
  type = "normal",
  onClick = () => {},
}) => {
  return type === "normal" ? (
    <button
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
      <span className="flex items-center gap-2 text-red-400">
        {children}
        <p className="flex items-center gap-2">
          {title}
          <Badge className="min-w-5 bg-red-500 text-white px-1">6</Badge>
        </p>
      </span>
      <ChevronRight size={19} className="text-zinc-400" />
    </button>
  );
};

export default ButtonCustom;
