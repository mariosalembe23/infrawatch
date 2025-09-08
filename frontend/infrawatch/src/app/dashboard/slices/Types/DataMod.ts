import axios from "axios";
import { APIS, GenericAxiosActions } from "@/components/AppComponents/API";
import { getCookie } from "cookies-next";

function DataMode(data: string | number | Date, mode = true): string {
  const agora: Date = new Date();
  const dataInformada: Date = new Date(data);
  if (mode) dataInformada.setHours(dataInformada.getHours() - 1);

  // Calcula a diferença em milissegundos (usando Math.abs para evitar negativos)
  const diffEmMs: number = Math.abs(agora.getTime() - dataInformada.getTime());

  // Se a diferença for menor que 1 segundo, retorna "agora"
  if (diffEmMs < 1000) {
    return "Agora mesmo";
  }

  // Calcula os segundos
  const diffEmSegundos = Math.floor(diffEmMs / 1000);
  if (diffEmSegundos < 60) {
    return `há ${diffEmSegundos}s`;
  }

  // Calcula os minutos
  const diffEmMinutos = Math.floor(diffEmSegundos / 60);
  if (diffEmMinutos < 60) {
    return `há ${diffEmMinutos}min`;
  }

  // Calcula as horas
  const diffEmHoras = Math.floor(diffEmMinutos / 60);
  if (diffEmHoras < 24) {
    return `há ${diffEmHoras}h`;
  }

  // Calcula os dias
  const diffEmDias = Math.floor(diffEmHoras / 24);
  if (diffEmDias < 30) {
    return `há ${diffEmDias}d`;
  }

  // Calcula os meses
  const diffEmMeses = Math.floor(diffEmDias / 30);
  if (diffEmMeses < 12) {
    return `há ${diffEmMeses}me`;
  }

  // Calcula os anos
  const diffEmAnos = Math.floor(diffEmMeses / 12);
  return `há ${diffEmAnos}y`;
}

const disableMonitoring = async <T extends { id: string }>(
  id: string,
  setData: React.Dispatch<React.SetStateAction<T[]>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  hability: boolean
) => {
  if (!id) return;

  try {
    setLoading(true);
    const response = await axios.put<T>(
      APIS.UPDATE_ENDPOINT + id,
      {
        toggle: hability,
      },
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      }
    );

    if (response.status === 200) {
      setData((prev) => prev.map((ep) => (ep.id === id ? response.data : ep)));
    }
    setLoading(false);
  } catch (error) {
    setLoading(false);
    console.error("Error updating estruture:", error);
    GenericAxiosActions({
      error,
      message: "Erro ao desabilitar monitoramento",
      setErrorMessage: setErrorMessage,
    });
  }
};

const enableMonitoring = async <T extends { id: string }>(
  id: string,
  type: "server" | "endpoint" | "device",
  setData: React.Dispatch<React.SetStateAction<T[]>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  hability: boolean
) => {
  if (!id) return;

  const apiChoice = [
    {
      type: "server",
      api: APIS.EDIT_SERVER,
    },
    {
      type: "endpoint",
      api: APIS.UPDATE_ENDPOINT,
    },
    {
      type: "device",
      api: APIS.UPDATE_DEVICE,
    },
  ];

  try {
    setLoading(true);
    const response = await axios.put<T>(
      apiChoice.find((api) => api.type === type)?.api + id,
      {
        toggle: hability,
      },
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      }
    );

    if (response.status === 200) {
      setData((prev) => prev.map((ep) => (ep.id === id ? response.data : ep)));
    }
    setLoading(false);
  } catch (error) {
    setLoading(false);
    console.error("Error updating estruture:", error);
    GenericAxiosActions({
      error,
      message: "Erro ao habilitar monitoramento",
      setErrorMessage: setErrorMessage,
    });
  }
};

export { DataMode, disableMonitoring, enableMonitoring };
