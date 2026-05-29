import React from 'react'

interface Task {
  id: string;
  description: string | null;
  title: string | null;
  status: string | null;
  assignedToId: string | null;
  priority: string | null;
  deadline: Date | null;
  tags: string[];
}

const priorityStyles: Record<string, { bg: string; text: string; label: string }> = {
  high:   { bg: 'bg-red-100',    text: 'text-red-700',    label: 'High' },
  medium: { bg: 'bg-amber-100',  text: 'text-amber-700',  label: 'Medium' },
  low:    { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Low' },
}

const statusStyles: Record<string, { bg: string; text: string }> = {
  'in progress': { bg: 'bg-teal-100',  text: 'text-teal-700' },
  'done':        { bg: 'bg-green-100', text: 'text-green-700' },
  'todo':        { bg: 'bg-gray-100',  text: 'text-gray-600' },
}

const getInitials = (id: string) => id.slice(0, 2).toUpperCase()

const TaskCard = ({ task }: { task: Task }) => {
  const priority = priorityStyles[task.priority?.toLowerCase() ?? '']
  const status   = statusStyles[task.status?.toLowerCase() ?? '']

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 max-w-sm shadow-sm">

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {priority && (
            <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${priority.bg} ${priority.text}`}>
              {priority.label}
            </span>
          )}
          <span className="text-xs text-gray-400 font-mono">#{task.id}</span>
        </div>
        {status && (
          <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${status.bg} ${status.text}`}>
            {task.status}
          </span>
        )}
      </div>

      <div>
        {task.title && <p className="text-sm font-medium text-gray-900 mb-1">{task.title}</p>}
        {task.description && <p className="text-xs text-gray-500 leading-relaxed">{task.description}</p>}
      </div>

      <div className="border-t border-gray-100 pt-2.5 flex flex-col gap-1.5">
        {task.assignedToId && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Assignee</span>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-medium text-blue-700">
                {getInitials(task.assignedToId)}
              </div>
              <span className="text-gray-700">{task.assignedToId}</span>
            </div>
          </div>
        )}
        {task.deadline && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Deadline</span>
            <span className="text-red-600 font-medium">
              {task.deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        )}
      </div>

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {task.tags.map(tag => (
            <span key={tag} className="text-[11px] px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
              {tag}
            </span>
          ))}
        </div>
      )}

    </div>
  )
}

export default TaskCard