import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: {
    priority: string;
    _count: number;
  }[];
};

const PriorityChart = ({ data }: Props) => {
  const chartData = data.map((item) => ({
    priority: item.priority,
    count: item._count,
  }));

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold">
        Task Priority
      </h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="priority" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="count"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriorityChart;