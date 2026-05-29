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

const statusStyles: Record<string, { bg: string; text: string }> = {
  'completed': { bg: 'bg-teal-100', text: 'text-teal-700' },
  'active': { bg: 'bg-green-100', text: 'text-green-700' },
  'new': { bg: 'bg-gray-100', text: 'text-gray-600' },
}

const TaskCard = ({ task }: { task: Task }) => {
  const status = statusStyles[task.status ?? '']
  const [open, setOpen] = useState(false);
  const priority =
    priorityStyles[task.priority as keyof typeof priorityStyles] ??
    priorityStyles.low;

  return (<>
    <div
      className={` ${priority.bg} ${priority.border} lg:w-44 w-full select-none rounded-md border border-l-4 p-3 shadow-sm`}
      onClick={() => setOpen(true)}
    >
      <div className="flex items-center gap-2">
        <Notebook size={15} className="text-gray-400 shrink-0" />
        <p className="w-full truncate text-xs font-medium text-gray-900">
          {task.title}
        </p>
      </div>

      <div className="border-t border-gray-100 flex flex-col gap-1.5">

        <div className="flex items-center text-xs gap-2 py-2">
          <div className="h-5 w-5 bg-gray-400 rounded-full shrink-0"></div>
          {task.assignedTo && 'username' in task.assignedTo ? (
            <span className="text-gray-700 truncate">{(task.assignedTo as { username: string }).username}</span>
          ) : null}
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Deadline</span>
          <span className="text-gray-600 font-medium">
            {task.deadline?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

      </div>

      <div className="flex h-5 flex-wrap gap-1 overflow-hidden">
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