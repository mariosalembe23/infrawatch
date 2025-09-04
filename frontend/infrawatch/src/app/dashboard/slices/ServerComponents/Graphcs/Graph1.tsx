import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
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

export default function CPUGRAPH() {
  return (
    <div style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={230}>
        <AreaChart
          width={500}
          height={200}
          data={data}
          syncId="anyId"
          margin={{
            top: 10,
            left:25,
            bottom: 0,
          }}
        >
          <XAxis
            dataKey="name"
            className=""
            axisLine={{ stroke: "#fff", strokeWidth: 2 }}
            tick={{ fill: "#fff", fontSize: 12, color: "#fff" }}
            tickMargin={10}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#111827", borderRadius: "8px" }}
          />
          <Area type="monotone" dataKey="pv" stroke="#00B8DB" fill="#00B8DB" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
