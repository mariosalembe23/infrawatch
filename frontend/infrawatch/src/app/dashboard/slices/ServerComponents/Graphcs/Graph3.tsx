import React from "react";
import { BarChart, Bar, Cell, XAxis } from "recharts";
import type { BarProps } from "recharts";

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];

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

const getPath = (
  x: number,
  y: number,
  width: number,
  height: number
): string => {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${
    y + height / 3
  }
    ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
    x + width
  }, ${y + height}
    Z`;
};

const TriangleBar = (props: BarProps) => {
  const { fill, x, y, width, height } = props;

  return (
    <path
      d={getPath(Number(x), Number(y), Number(width), Number(height))}
      stroke="none"
      fill={fill}
    />
  );
};

export default function TemperatureGraph() {
  return (
    <BarChart
      // w-100%
      width={450}
      height={300}
      data={data}
      className="w-full"
      margin={{
        top: 20,
        right: 30,
        left: 0,
        bottom: 5,
      }}
    >
      <XAxis
        dataKey="name"
        axisLine={{ stroke: "#fff", strokeWidth: 2 }}
        tick={{ fill: "#fff", fontSize: 12, color: "#fff" }}
      />
      <Bar
        dataKey="uv"
        fill="#8884d8"
        shape={TriangleBar}
        label={{ position: "top" }}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % 20]} />
        ))}
      </Bar>
    </BarChart>
  );
}
