import { OctagonAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const ServiceNotFound: React.FC<{
  messageError: string;
}> = ({ messageError }) => {
  return (
    <aside className="fixed w-full h-dvh z-50 top-0 left-0 flex items-center justify-center bg-white dark:bg-zinc-950">
      <div className="border max-w-96 w-full p-5 rounded-xl dark:border-zinc-900">
        <header>
          <h1 className="flex dark:text-white text-red-700 items-center gap-2">
            <OctagonAlert className="inline" size={18} />
            Recurso não encontrado
          </h1>
        </header>
        <p className=" break-words text-[15px] pt-3 text-zinc-900 dark:text-zinc-400">
          {messageError || "Erro ao solicitar o recurso."}
        </p>
        <footer className="flex mt-4 items-center justify-start">
          <Link href={"/"}>
            <Button variant={"outline"}>Página inicial</Button>
          </Link>
        </footer>
      </div>
    </aside>
  );
};

export default ServiceNotFound;