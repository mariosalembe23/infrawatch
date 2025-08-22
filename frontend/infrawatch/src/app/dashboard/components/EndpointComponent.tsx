import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";

interface IEndpointComponent {
  url: string;
  responseTime: string;
  httpStatus: 200 | 401 | 500;
  status: "recheable" | "unreachable";
}

const EndpointComponent: React.FC<IEndpointComponent> = ({
  url,
  responseTime,
  httpStatus,
  status,
}) => {
  return (
    <div className="border rounded-lg py-3 px-5 flex flex-col dark:border-zinc-900">
      <div>
        <p className="dark:text-white break-words  pb-1">{url}</p>
        <div className="flex items-center mt-1 gap-1 flex-wrap">
          <p className="px-2 text-white text-[14px] bg-zinc-900  font-medium rounded leading-none py-1">
            Tempo de resposta{" "}
            <span className="text-cyan-500">{responseTime}s</span>
          </p>
          <p
            className={`px-2 text-white text-[14px] ${
              httpStatus === 200
                ? "bg-green-600"
                : httpStatus === 401
                ? "bg-yellow-600"
                : "bg-red-600"
            }  font-medium rounded leading-none py-1`}
          >
            HTTP <span>{httpStatus}</span>
          </p>
          <p className="px-2 uppercase text-white text-[14px] bg-green-600  font-medium rounded leading-none py-1">
            {status}
          </p>
        </div>
      </div>
      <div className="flex items-center flex-wrap gap-2 justify-between mt-3">
        <div className="flex items-center  gap-2">
          <p className="dark:text-zinc-300 text-zinc-700 font-[490] text-[15px]">
            há 3:10s
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size={"icon"}
            className="dark:text-zinc-200 dark:bg-transparent dark:hover:bg-zinc-900 hover:bg-zinc-100 bg-white shadow-none border rounded-full text-zinc-600 hover:text-black transition-all dark:hover:text-white cursor-pointer"
          >
            <Ellipsis size={20} className="" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EndpointComponent;
