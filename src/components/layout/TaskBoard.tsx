import { useSession } from 'next-auth/react';
import React from 'react'
import { api } from '~/utils/api';
import TaskHeader from '../task/TaskHeader';
import TaskCard from '../task/TaskCard';

const TaskBoard = () => {

  const { data: sessionData } = useSession();

  const { data: tasks } = api.task.getTasks.useQuery(undefined, {
    enabled: !!sessionData?.user,
  });
  
  return (
    <div className="p-4">
      <TaskHeader />
      <div className="flex justify-between items-center mb-6">
        <p className="text-lg font-bold capitalize">{sessionData?.user?.name}&apos;s TaskBoard</p>
      </div>

      <ul>
        {tasks?.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </ul>
    </div>
  )
}

export default TaskBoard