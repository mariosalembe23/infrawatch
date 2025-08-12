import { Button } from "@/components/ui/button";
import { Bolt } from "lucide-react";
import Image from "next/image";

const MainHeader = () => {
  return (
    <header className="sticky bg-[#060607]/10 backdrop-blur-2xl top-0 left-0 w-full h-16 z-20 border-b border-zinc-900 flex items-center justify-between px-7">
      <div className="flex items-center gap-3">
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
