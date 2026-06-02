import { useEffect, useState } from "react";
import { getCurrentTeamId } from "~/helper/localstorageHelper";
import { api } from "~/utils/api";
import StatsCard from "./StatsCard";
import PriorityChart from "./PriorityChart";
import TaskStatusChart from "./TaskStatusChart";

const DashboardOverview = () => {
  const [teamId, setTeamId] = useState("");

  useEffect(() => {
    setTeamId(getCurrentTeamId());
  }, []);

  const { data, isLoading } = api.dashboard.getOverview.useQuery({
    teamId: teamId,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return null;
  }

  const statusBreakdown = data.statusBreakdown.map(({ status, _count }) => ({
    status: status ?? "Unknown",
    _count,
  }));
  const priorityBreakdown = data.priorityBreakdown.map(({ priority, _count }) => ({
    priority: priority ?? "Unknown",
    _count,
  }));
  
  return (
    <div className="space-y-6 h-full overflow-hidden">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="space-y-6 overflow-auto h-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard title="Assigned Tasks" value={data.assignedTasks} />
          <StatsCard title="Created Tasks" value={data.createdTasks} />
          <StatsCard title="Completed Tasks" value={data.completedTasks} />
          <StatsCard title="Team Members" value={data.teamMembers} />
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TaskStatusChart data={statusBreakdown} />
            <PriorityChart data={priorityBreakdown} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;