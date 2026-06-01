import React, { useEffect, useState } from "react";
import AppLayout from "~/components/layout/AppLayout";
import TaskBoard from "~/components/layout/TaskBoard";
import TaskHeader from "~/components/task/TaskHeader";
import { getCurrentTeamId } from "~/helper/localstorageHelper";
import { api } from "~/utils/api";

const TeamsBoards = () => {
  const [teamId, setTeamId] = useState("");

  useEffect(() => {
    setTeamId(getCurrentTeamId());
  }, []);

  const { data: tasks } = api.task.getTeamTasks.useQuery( { teamId }, { enabled: !!teamId });

  return <AppLayout>
    <TaskHeader />
    <TaskBoard title={"Team"} tasks={tasks} />
  </AppLayout>;
};


export default TeamsBoards;