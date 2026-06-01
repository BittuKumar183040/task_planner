/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @next/next/no-img-element */
import { Notebook } from 'lucide-react';
import React, { useState } from 'react'
import type { RouterOutputs } from '~/utils/api'
import CreateTaskDialog from './TaskDialog';

type Task = RouterOutputs["task"]["getTasks"][number];


const priorityStyles = {
  high: { border: "border-red-300", bg: "bg-red-50", label: "High" },
  medium: { border: "border-gray-500", bg: "bg-gray-100", label: "Medium" },
  low: { border: "border-gray-300", bg: "bg-gray-50", label: "Low" },
};

const TaskCard = ({ task }: { task: Task }) => {
  const [open, setOpen] = useState(false);
  
  const priority = priorityStyles[task.priority as keyof typeof priorityStyles] ?? priorityStyles.low;
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== "completed";
  const isToday = task.deadline && new Date(task.deadline).toDateString() === new Date().toDateString() && task.status !== "completed";

  return (<>
    <div
      className={` ${priority.bg} ${priority.border} lg:w-44 w-full shrink-0 select-none rounded-md border border-l-4 p-3 shadow-sm`}
      onClick={() => setOpen(true)}
    >
      <div className="flex items-center gap-2">
        <Notebook size={15} className="text-gray-400 shrink-0" />
        <p className="w-full truncate text-xs font-medium text-gray-900">
          {task.title}
        </p>
      </div>

      <div className="border-t shrink-0 border-gray-100 flex flex-col gap-1.5">

        <div className="flex items-center text-xs gap-2 py-2">
          <div className="h-6 w-6 bg-gray-400 rounded-full shrink-0 overflow-hidden">
            <img src={`https://api.dicebear.com/10.x/micah/svg?seed=${task.assignedTo?.image}`} alt={''} />
          </div>
          {task.assignedTo && 'username' in task.assignedTo ? (
            <span className="text-gray-700 truncate">{(task.assignedTo as { username: string }).username}</span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs">
          <span className={`${isOverdue ? "text-red-500 font-medium" : isToday ? "text-amber-500 font-medium" : "text-gray-400"}`}>
            {task.deadline
              ? task.status === "completed"
                ? "Completed"
                : isOverdue
                  ? "⚠ Overdue"
                  : isToday
                    ? "⏰ Due today"
                    : "Deadline"
              : "\u00A0"}
          </span>
          <span className={`font-medium ${task.status === "completed" ? "text-gray-400 line-through" : isOverdue ? "text-red-500" : isToday ? "text-amber-500" : "text-gray-600"}`}>
            {task.deadline?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

      </div>

      <div className="flex shrink-0 h-5 flex-wrap gap-1 overflow-hidden">
        {task.tags.map(tag => (
          <span key={tag} className="text-xs px-2.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
            {tag}
          </span>
        ))}
      </div>
    </div>
    <CreateTaskDialog task={task} open={open} onClose={() => setOpen(false)} />
  </>
  )
}

export default TaskCard