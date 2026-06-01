import { Users, ClipboardCheck, Pencil } from "lucide-react";
import { type RouterOutputs } from "~/utils/api";

type UserType = RouterOutputs["user"]["getUsersByTeam"];

const TeamStats = ({ users }: { users: UserType }) => {
  const totalAssigned = users.reduce((sum, u) => sum + u._count.tasksAssigned, 0);
  const totalCreated = users.reduce((sum, u) => sum + u._count.tasksCreated, 0);

  const stats = [
    { label: "Total members", value: users.length, icon: Users, bg: "bg-violet-50", color: "text-violet-600" },
    { label: "Tasks assigned", value: totalAssigned, icon: ClipboardCheck, bg: "bg-teal-50", color: "text-teal-700" },
    { label: "Tasks created", value: totalCreated, icon: Pencil, bg: "bg-orange-50", color: "text-orange-700" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 pb-2">
      {stats.map(({ label, value, icon: Icon, bg, color }) => (
        <div key={label} className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg} ${color}`}>
            <Icon size={16} />
          </div>
          <div>
            <p className="text-[12px] text-gray-400">{label}</p>
            <p className="text-[28px] font-medium leading-none text-gray-900">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamStats;