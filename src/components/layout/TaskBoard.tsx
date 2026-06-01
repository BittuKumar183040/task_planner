/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import TaskCard from '../task/TaskCard';
import { type RouterOutputs } from '~/utils/api';

type TaskBoardProps = {
  title: string;
  postTitle?: React.ReactNode;
  tasks?: RouterOutputs["task"]["getTasks"];
}

const STATUSES = ["new", "active", "completed"] as const;

const TableHeader = ({ title, count }: { title: string, count: number }) => (
  <div className="flex items-center justify-between border-b p-2">
    <h2 className="text-sm font-semibold text-black/70">{title}</h2>
    <h2 className="text-sm opacity-60">{count}</h2>
  </div>
)

const TaskBoard = ({ title, postTitle = <span>&apos;s Board</span>, tasks }: TaskBoardProps) => {
  const assignees = [...new Map(
    tasks?.map((t) => [
      t.assignedTo?.username ?? "Unassigned",
      { username: t.assignedTo?.username ?? "Unassigned", image: t.assignedTo?.image }
    ])
  ).values()];

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <p className="text-lg font-bold">
          <span className="capitalize">{title}</span>
          {postTitle}
        </p>
      </div>

      <section className="flex-1 overflow-auto">
        <div className="grid" style={{ gridTemplateColumns: `${assignees.length>1 ? "20px" : "0px"} repeat(${STATUSES.length}, minmax(0, 1fr))` }}>
          <div className={`border-b ${assignees.length>1 && "border-r"} p-2`} />

          {STATUSES.map((status) => (<TableHeader
            key={status}
            title={status}
            count={tasks?.filter((t) => t.status === status).length ?? 0}
          />
          ))}

          {assignees.map((assignee) => (
            <React.Fragment key={assignee.username}>
              <div className="flex h-full items-start py-2 gap-2 pointer-events-none select-none">
                <img
                  src={`https://api.dicebear.com/10.x/micah/svg?seed=${assignee.image}`}
                  alt={assignee.username}
                  className="h-6 w-6 rounded-full bg-gray-100"
                />
              </div>

              {STATUSES.map((status) => {
                const cellTasks = tasks?.filter(
                  (t) => (t.assignedTo?.username ?? "Unassigned") === assignee.username && t.status === status
                ) ?? [];
                return (
                  <div key={status} className="border-b border-r min-h-[80px] p-2 flex flex-wrap gap-2 content-start">
                    {cellTasks.map((task) => <TaskCard key={task.id} task={task} />)}
                  </div>
                );
              })}

            </React.Fragment>
          ))}

        </div>
      </section>
    </>
  );
};

export default TaskBoard;