const LoadingComponent = () => {
  return (
    <div className="fixed top-0 flex items-center justify-center left-0 right-0 w-full h-dvh z-[70] bg-[#f5f5f5]/10 dark:bg-[#060607]/30 backdrop-blur-xl">
      <p className="flex text-black dark:text-white items-center gap-2">
        <span className="loader !w-4 !h-4 !border-2 !border-b-zinc-700 dark:!border-b-zinc-500/50 !border-zinc-300 dark:!border-white"></span>
        <span className="animate-pulse">Processando...</span>
      </p>
    </div>
  );
};

export default LoadingComponent;
