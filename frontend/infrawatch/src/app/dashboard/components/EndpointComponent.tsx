import { ClipboardClock, Info } from "lucide-react";

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
    <div className="border py-3 px-5 flex flex-col border-zinc-900">
      <div>
        <p className="text-white">{url}</p>
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
      <div className="flex items-center gap-2 justify-between mt-5">
        <div className="flex items-center gap-2">
          <button className="px-3 gap-2 border border-zinc-900 transition-all hover:bg-zinc-900 cursor-pointer py-[0.19rem] flex items-center bg-black text-white rounded-md">
            Logs <ClipboardClock size={16} />
          </button>
          <button className="px-3 gap-2 border border-zinc-900 transition-all hover:bg-zinc-900 cursor-pointer py-[0.19rem] flex items-center bg-black text-white rounded-md">
            Detalhes <Info size={17} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-zinc-500 text-[15px]">há 3 min</p>
          <span className="loader !w-3 !h-3 !border-2 !border-b-zinc-600"></span>
        </div>
      </div>
    </div>
  );
};

export default EndpointComponent;