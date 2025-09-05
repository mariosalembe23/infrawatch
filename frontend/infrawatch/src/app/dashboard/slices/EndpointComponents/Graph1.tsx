import React from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

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

const Graph1 = () => {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            left: 30,
            bottom: 0,
          }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis
            dataKey="name"
            axisLine={{ stroke: "#fff", strokeWidth: 2 }}
            tick={{ fill: "#fff", fontSize: 12, color: "#fff" }}
          />
          {/* <YAxis /> */}
          <Tooltip />
          <Area type="monotone" dataKey="uv" stroke="#00B8DB" fill="#00B8DB" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph1;
