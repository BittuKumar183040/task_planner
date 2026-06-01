import { useState } from "react";
import CreateTaskDialog from "./TaskDialog";
import { Plus } from "lucide-react";

const TaskHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mb-6 flex justify-end items-center w-full gap-4">
        {/* <div className="flex justify-between gap-3">
          <input type="text" placeholder="Search tasks..." className="rounded-md border p-2 text-xs outline-none focus:ring-1 focus:ring-gray-200" />                
        </div> */}

        <button
          onClick={() => setOpen(true)}
          className="rounded-full whitespace-nowrap bg-black flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/80"
        >
          <Plus size={16} className="inline-block" />
          New Task
        </button>
      </div>

      <CreateTaskDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default TaskHeader;