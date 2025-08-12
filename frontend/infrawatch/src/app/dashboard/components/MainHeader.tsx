import { Button } from "@/components/ui/button";
import { Bolt, PanelLeft } from "lucide-react";
import Image from "next/image";

interface IMainHeader {
  showSideBar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainHeader: React.FC<IMainHeader> = ({ showSideBar, setShowSidebar }) => {
  return (
    <header className="sticky bg-[#060607]/10 backdrop-blur-2xl top-0 left-0 w-full h-16 z-20 border-b border-zinc-900 flex items-center justify-between px-7">
      <div className="flex items-center gap-3">
        {!showSideBar && (
          <Button
            onClick={() => setShowSidebar((prev) => !prev)}
            size={"icon"}
            className="rounded-full border size-8 cursor-pointer border-zinc-800"
          >
            <PanelLeft size={25} className="text-white size-4" />
          </Button>
        )}
        <svg
          className="text-black size-5"
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
        <h1 className="text-white text-xl">Infra Watch</h1>
        <p className="text-cyan-500">RCS ANGOLA</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-full bg-[#161616] border border-zinc-800 flex gap-3 items-center">
          <Image
            src={"/app/male.svg"}
            width={100}
            height={100}
            alt="User Avatar"
            className="rounded-full size-7"
          />
          <p className="pe-3 text-white">Mário Salembe</p>
        </div>
        <Button size={"icon"} className="rounded-full border border-zinc-800">
          <Bolt size={18} className="text-white size-5" />
        </Button>
      </div>
    </header>
  );
};

export default MainHeader;
