import { useState } from "react";
import CreateTaskDialog from "./TaskDialog";

const TaskHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setOpen(true)}
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
        >
          Create Task
        </button>
      </div>

      <CreateTaskDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default TaskHeader;