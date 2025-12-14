import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

type Props = {
  data: { date: string; minutes: number }[];
};

export default function StatsGraph({ data }: Props) {
  return (
    <div style={{ marginTop: "20px" }}>
      <LineChart width={400} height={250} data={data}>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="minutes" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </div>
  );
}
