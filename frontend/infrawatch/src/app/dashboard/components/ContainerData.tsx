interface IContainerData {
  title: string;
  length: number;
}

const ContainerData: React.FC<IContainerData> = ({ title, length }) => {
  return (
    <div className="px-5 py-2 rounded-lg bg-zinc-950 border border-zinc-900">
      <div className="flex items-center gap-2">
        <p className="text-cyan-500 text-xl pot:text-2xl font-medium">
          {length}{" "}
        </p>
        <p className="text-white/70">/ {title}</p>
      </div>
    </div>
  );
};

export default ContainerData;
