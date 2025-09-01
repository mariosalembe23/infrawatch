"use client";

import React, { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Cog, Container, Server } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { getCookie } from "cookies-next/client";
import { toast } from "sonner";
import { WorkSpaceProps } from "@/app/chooseWorkspace/[id]/page";
import { useSliderWithInput } from "@/hooks/use-slider-with-input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APIS, GenericAxiosActions } from "@/components/AppComponents/API";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import defaultSliderValues from "./data";

interface ServerMetricConfigProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setWorkspaces: React.Dispatch<React.SetStateAction<WorkSpaceProps[]>>;
  workspace_id: string;
}
type ServerMetricConfigState = {
  servername: string;
  identifier: string;
  time_ms: string;
};

const ServerMetricConfig: React.FC<ServerMetricConfigProps> = ({
  open,
  setOpen,
  setWorkspaces,
  workspace_id,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServerMetricConfigState>({
    mode: "onChange",
    defaultValues: {
      servername: "",
      identifier: "",
    },
  });

  const resetFunctionsRef = useRef<(() => void)[]>([]);

  // Function to reset all sliders to default
  const resetAll = () => {
    resetFunctionsRef.current.forEach((resetFn) => resetFn());
  };

  const registerResetFunction = (resetFn: () => void, index: number) => {
    resetFunctionsRef.current[index] = resetFn;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-5xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b flex items-start gap-2 font-medium px-6 py-4 text-base">
            <div className="flex flex-col items-start">
              <span className="flex items-center gap-2">
                <Cog size={17} />
                Configurações de Métricas do Servidor
              </span>
              <p className="dark:text-zinc-500 ps-6 font-[450] text-[15px]">
                Ajuste os dados e defina limites para ser notificado caso algum
                deles seja ultrapassado.
              </p>
            </div>
          </DialogTitle>
          <div ref={contentRef} className="overflow-y-auto">
            <header className="flex py-4 px-5 items-center justify-between">
              <div className="inline-flex items-center gap-2"></div>
              <Button
                type="submit"
                onClick={resetAll}
                className="py-4 bg-cyan-600/40 border border-cyan-700 hover:bg-cyan-600/50 cursor-pointer text-white"
              >
                Resetar Tudo
              </Button>
            </header>
            <DialogDescription asChild>
              <form className="px-6 grid ret:grid-cols-2 grid-cols-1 pot:grid-cols-3 gap-x-5 gap-y-6 py-2">
                {defaultSliderValues.map((metric, index) => (
                  <div key={metric.id} className="*:not-first:mt-3">
                    <Label htmlFor={String(metric.id)} className="font-[450]">
                      {metric.label}
                    </Label>
                    <SliderWithInput
                      minValue={metric.min}
                      maxValue={metric.max}
                      initialValue={[parseInt(String(metric.default))]}
                      defaultValue={[0]}
                      label={metric.label}
                      onRegisterReset={(resetFn) =>
                        registerResetFunction(resetFn, index)
                      }
                    />
                  </div>
                ))}

                <DialogFooter className="border-t col-span-full px-1 mt-3 pt-4 sm:items-center">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      disabled={loading}
                      variant="outline"
                      className="py-5 dark:text-white"
                    >
                      Cancelar
                    </Button>
                  </DialogClose>

                  <Button
                    type="submit"
                    className="py-5 bg-cyan-600/40 border border-cyan-700 hover:bg-cyan-600/50 cursor-pointer text-white"
                  >
                    {loading && (
                      <span className="loader !w-4 !h-4 !border-2 !border-b-white !border-white/40"></span>
                    )}
                    Salvar Configurações
                  </Button>
                </DialogFooter>
              </form>
            </DialogDescription>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

function SliderWithInput({
  minValue,
  maxValue,
  initialValue,
  defaultValue,
  label,
  onRegisterReset,
}: {
  minValue: number;
  maxValue: number;
  initialValue: number[];
  defaultValue: number[];
  label: string;
  onRegisterReset: (resetFn: () => void) => void;
}) {
  const {
    sliderValue,
    inputValues,
    validateAndUpdateValue,
    handleInputChange,
    handleSliderChange,
    resetToDefault,
  } = useSliderWithInput({ minValue, maxValue, initialValue, defaultValue });

  // Register the reset function when the component mounts
  React.useEffect(() => {
    onRegisterReset(resetToDefault);
  }, [onRegisterReset, resetToDefault]);

  return (
    <div className="flex items-center gap-2">
      {/* <Label className="text-muted-foreground text-xs">{label}</Label> */}
      <Slider
        className="grow [&>:last-child>span]:rounded"
        value={sliderValue}
        onValueChange={handleSliderChange}
        min={minValue}
        max={maxValue}
        aria-label={label}
      />
      <Input
        className="h-8 w-12 px-2 py-1"
        type="text"
        inputMode="decimal"
        value={inputValues[0]}
        onChange={(e) => handleInputChange(e, 0)}
        onBlur={() => validateAndUpdateValue(inputValues[0], 0)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            validateAndUpdateValue(inputValues[0], 0);
          }
        }}
        aria-label="Enter value"
      />
    </div>
  );
}

export default ServerMetricConfig;
