// components/dashboard/TaskStatusChart.tsx

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type Props = {
  data: {
    status: string;
    _count: number;
  }[];
};

const COLORS = ["#9CA3AF", "#3B82F6", "#10B981"];

const TaskStatusChart = ({ data }: Props) => {
  const chartData = data.map((item) => ({
    name: item.status,
    value: item._count,
  }));

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold">
        Task Status
      </h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              outerRadius={90}
              label
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={ COLORS[index % COLORS.length] } />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskStatusChart;