import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "1 Semana",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "2 Semana",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "3 Semana",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "4 Semana",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
];

const DataGraph = () => {
  type IntervalType =
    | number
    | "preserveStart"
    | "preserveEnd"
    | "preserveStartEnd"
    | "equidistantPreserveStart";

  const chart = (interval: IntervalType) => (
    <ResponsiveContainer height={250} width="100%">
      <LineChart data={data} margin={{ right: 15, top: 5, left: 25 }}>
        <XAxis
          dataKey="name"
          tick={{ fill: "#fff", fontSize: 12, color: "#fff" }}
          interval={interval}
        />
        <Line
          type="monotone"
          dataKey="pv"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );

  return <>{chart("preserveEnd")}</>;
};

export default DataGraph;
