const defaultSliderValues = [
  {
    id: 1,
    label: "Uso de CPU (%)",
    min: 0,
    max: 100,
    default: (100 * 90) / 100,
  },
  {
    id: 2,
    label: " Frequência da CPU (MHz)",
    min: 0,
    max: 5000,
    default: (5000 * 90) / 100,
  },
  {
    id: 3,
    label: "Temperatura da CPU (°C)",
    min: 0,
    max: 100,
    default: (100 * 90) / 100,
  },
  {
    id: 4,
    label: "Memória Usada (RAM - GB)",
    min: 0,
    max: 250,
    default: (250 * 90) / 100,
  },
  {
    id: 5,
    label: "Memória Usada (SWAP - GB)",
    min: 0,
    max: 250,
    default: (250 * 90) / 100,
  },
  {
    id: 6,
    label: "Espaço em Disco (%)",
    min: 0,
    max: 500,
    default: (500 * 90) / 100,
  },
  {
    id: 7,
    label: "Dados de Rede Enviados (MB)",
    min: 0,
    max: 1000,
    default: (1000 * 90) / 100,
  },
  {
    id: 8,
    label: "Dados de Rede Recebidos (MB)",
    min: 0,
    max: 1000,
    default: (1000 * 90) / 100,
  },
];

export default defaultSliderValues;
