function DataMode(data: string | number | Date): string {
  const agora: Date = new Date();
  const dataInformada: Date = new Date(data);

  const diffEmMs: number = agora.getTime() - dataInformada.getTime();

  const diffEmDias: number = Math.floor(diffEmMs / (1000 * 60 * 60 * 24));

  if (diffEmDias < 1) {
    const diffEmHoras: number = Math.floor(diffEmMs / (1000 * 60 * 60));
    return `${diffEmHoras}h`;
  }

  if (diffEmDias < 30) {
    return `${diffEmDias}d`;
  }

  const diffEmMeses: number = Math.floor(diffEmDias / 30);
  if (diffEmMeses < 12) {
    return `${diffEmMeses}m`;
  }

  const diffEmAnos: number = Math.floor(diffEmMeses / 12);
  return `${diffEmAnos}y`;
}

export { DataMode };
