// interface TempoDecorridoResult {
//     resultado: string;
// }

function DataMode(data: string | number | Date): string {
  const agora: Date = new Date();
  const dataInformada: Date = new Date(data);

  const diffEmMs: number = agora.getTime() - dataInformada.getTime();
  const diffEmDias: number = Math.floor(diffEmMs / (1000 * 60 * 60 * 24));

  if (diffEmDias < 30) {
    return `${diffEmDias} ${diffEmDias === 1 ? "dia" : "dias"}`;
  }

  const diffEmMeses: number = Math.floor(diffEmDias / 30);
  if (diffEmMeses < 12) {
    return `${diffEmMeses} ${diffEmMeses === 1 ? "mês" : "meses"}`;
  }

  const diffEmAnos: number = Math.floor(diffEmMeses / 12);
  return `${diffEmAnos} ${diffEmAnos === 1 ? "ano" : "anos"}`;
}

export { DataMode };
