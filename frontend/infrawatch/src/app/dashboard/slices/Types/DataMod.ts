function DataMode(data: string | number | Date, mode = true): string {
  const agora: Date = new Date();
  const dataInformada: Date = new Date(data);
  if (mode)
    dataInformada.setHours(dataInformada.getHours() - 1);

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

export { DataMode };