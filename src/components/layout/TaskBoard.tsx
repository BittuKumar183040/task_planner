import React from 'react'
import TaskCard from '../task/TaskCard';
import { type RouterOutputs } from '~/utils/api';

type TaskBoardProps = {
  title: string;
  postTitle?: React.ReactNode;
  tasks?: RouterOutputs["task"]["getTasks"];
}

const TableHeader = ({ title, count }: { title: string, count: number }) => (
  <div className="flex items-center justify-between border-b p-2">
    <h2 className="text-sm font-semibold text-black/70">{title}</h2>
    <h2 className="text-sm opacity-60">{count}</h2>
  </div>
)

const TaskBoard = ({ title, postTitle=<span>&apos;s Board</span>, tasks }: TaskBoardProps) => {
  const newTasks = tasks?.filter((task) => task.status === "new") ?? [];
  const activeTasks = tasks?.filter((task) => task.status === "active") ?? [];
  const completedTasks = tasks?.filter((task) => task.status === "completed") ?? [];

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <p className="text-lg font-bold">
          <span className="capitalize">{title}</span>
          {postTitle}
        </p>
      </div>
      <section className="flex-1 overflow-auto">
        <div className="grid grid-cols-3 h-full">
          <div className="border-l">
            <TableHeader title={`New`} count={newTasks.length} />
            <div className="flex flex-wrap gap-2 p-2">
              {newTasks.map((task) => (<TaskCard key={task.id} task={task} />))}
            </div>
          </div>

          <div className="border-x">
            <TableHeader title={`Active`} count={activeTasks.length} />
            <div className="flex flex-wrap gap-2 p-2">
              {activeTasks.map((task) => <TaskCard key={task.id} task={task} />)}
            </div>
          </div>

          <div className="border-r">
            <TableHeader title={`Completed`} count={completedTasks.length} />
            <div className="flex flex-wrap gap-2 p-2">
              {completedTasks.map((task) => <TaskCard key={task.id} task={task} />)}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default TaskBoard