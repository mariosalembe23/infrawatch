import { Button } from "@/components/ui/button";
import { Bolt, Container, Plus, Sun } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ChooseWorkspaceComponent = () => {
  return (
    <div className="bg-zinc-950 group transition-all hover:border-white/10 hover:border-dashed cursor-pointer h-56 overflow-hidden relative flex flex-col justify-between border border-zinc-900/50 p-5 rounded-3xl gap-3">
      <span className="flex absolute group-hover:-bottom-14 transition-all -bottom-16 -right-16 items-center gap-2 mb-2 flex-col">
        <Container
          size={50}
          strokeWidth={1}
          className="text-zinc-900/30 group-hover:text-zinc-900/40 transition-all size-48 mb-2"
        />
      </span>
      <header>
        <h2 className="text-white text-lg">RSC Angola</h2>
        <p className="text-zinc-500 pt-2 text-[15px]">
          Espaço de trabalho para a equipe de infraestrutura da RSC Angola.
        </p>
      </header>
      <footer>
        <div className="flex  -space-x-[0.525rem]">
          <Avatar>
            <AvatarFallback className="bg-zinc-900 border-2 border-zinc-950 text-white font-medium text-[14px] leading-none">
              KK
            </AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-zinc-900 border-2 border-zinc-950 text-white font-medium text-[14px] leading-none">
              AZ
            </AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-zinc-900 border-2 border-zinc-950 text-white font-medium text-[14px] leading-none">
              ZI
            </AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-zinc-900 border-2 border-zinc-950 text-white font-medium text-[14px] leading-none">
              +3
            </AvatarFallback>
          </Avatar>
        </div>
        <p className="font-mono text-white text-[14px] pt-1">
          12 de Agosto, 2025
        </p>
      </footer>
    </div>
  );
};

export default function chooseWorkspace() {
  return (
    <div className="grid grid-rows-[7%_93%]  h-dvh bg-[#060607]">
      <header className="w-full flex px-7 items-center justify-between">
        <div className="flex items-center gap-2">
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
            <p className="pe-3 ret:inline-flex hidden text-white">
              Mário Salembe
            </p>
          </div>
          <Button
            size={"icon"}
            className="rounded-full cursor-pointer border border-zinc-800"
          >
            <Bolt size={18} className="text-white size-5" />
          </Button>
          <Button
            size={"icon"}
            className="rounded-full cursor-pointer border border-zinc-800"
          >
            <Sun size={18} className="text-white size-5" />
          </Button>
        </div>
      </header>
      <main className="overflow-y-auto flex items-center justify-center h-full">
        <section className="max-w-3xl mx-auto w-full">
          <header className="text-center mb-10">
            <span className="flex items-center gap-2 mb-2 flex-col">
              <Container
                size={50}
                strokeWidth={1}
                className="text-white size-12 mb-2"
              />
            </span>
            <h1 className="text-white text-2xl uppercase">
              Escolha um Espaço de Trabalho
            </h1>
            <div className="w-[26rem] mx-auto">
              <p className="text-zinc-400 font-[410] mt-2">
                Selecione um espaço de trabalho existente ou crie um novo para
                gerenciar seus servidores, dispositivos de rede e endpoints, bem
                como sua aquipa!
              </p>
            </div>
          </header>

          <div className="grid pt-5 justify-center grid-cols-3 w-full gap-3">
            <ChooseWorkspaceComponent />
            <ChooseWorkspaceComponent />
            <ChooseWorkspaceComponent />
          </div>
          <footer className="flex justify-center mt-10">
            <Button className="py-5 mt-5 bg-cyan-600/40 border border-cyan-700 hover:bg-cyan-600/50 cursor-pointer text-white">
              Criar Novo Espaço de Trabalho <Plus size={18} className="" />
            </Button>
          </footer>
        </section>
      </main>
    </div>
  );
}
