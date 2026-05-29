/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { X } from "lucide-react";
import { useState } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { useSession } from "next-auth/react";
import Dialog from "../layout/Dialog";

type Props = {
  task?: RouterOutputs["task"]["getTasks"][number];
  open: boolean;
  onClose: () => void;
};

const CreateTaskDialog = ({ task, open, onClose }: Props) => {

  const { data: sessionData } = useSession();
  const utils = api.useUtils();

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [assignedTo, setAssignedTo] = useState<{ id: string; username: string }>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    id: task?.assignedTo?.id ?? sessionData?.user?.id ?? "",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    username: task?.assignedTo?.username ?? sessionData?.user?.username ?? "",
  });
  const [status, setStatus] = useState<"new" | "active" | "completed">((task?.status ?? "new") as "new" | "active" | "completed");
  const [date, setDate] = useState(task?.assignedTo ? task.deadline ? task.deadline.toISOString().split("T")[0] : "" : "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">((task?.priority ?? "medium") as "low" | "medium" | "high");
  const [tags, setTags] = useState<string[]>(task?.tags ?? []);
  const [tagInput, setTagInput] = useState<string>("");

  const createTask = api.task.createTask.useMutation({
    onSuccess: async () => {
      await utils.task.getTasks.invalidate();
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("new");
      setDate("");
      setAssignedTo(sessionData?.user ?? { id: sessionData?.user?.id ?? "", username: sessionData?.user?.username ?? "" });
      setTags([]);
      onClose();
    },
  });

  const getUserByUsername = api.user.getUserByUsername.useQuery(
    { username: assignedTo.username },
    {
      enabled: false,
    }
  );

  const updateTask = api.task.updateTask.useMutation({
    onSuccess: async () => {
      await utils.task.invalidate();
      onClose();
    },
    onError: (error) => {
      console.error("Failed to update task:", error);
    },
  });

  const addTag = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]!);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (task) {
      await updateTask.mutateAsync({
        id: task.id,
        title,
        description,
        priority,
        status,
        assignedToId: assignedTo.id,
        deadline: date ? new Date(date) : undefined,
        tags,
      });
    } else {
      await createTask.mutateAsync({
        title,
        description,
        priority,
        status,
        assignedToId: assignedTo.id ?? sessionData?.user?.id,
        deadline: date ? new Date(date) : undefined,
        tags,
      });
    }
  };

  if (!open) return null;

  const handleChangeAssignedTo = async (username: string) => {
    setAssignedTo({ id: "", username });
    if (!username) return;
    const { data } = await getUserByUsername.refetch();
    console.log("Fetched user data:", data);
    if (data) {
      setAssignedTo({ id: data.id, username: data.username });
    }
  };

  return (
    <Dialog title={task ?
      <p>Edit Task
        <span className="font-normal ml-2 bg-gray-100 px-2 py-1 rounded shadow-inner">
          #{task.taskId}
        </span>
      </p>
      : "Create Task"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="mb-1 block font-medium">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border p-2 outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border p-2 outline-none focus:border-gray-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block font-medium">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
              className="w-full rounded border p-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "new" | "active" | "completed")}
              className="w-full rounded border p-2"
            >
              <option value="new">📰&nbsp;&nbsp;&nbsp;New</option>
              <option value="active">🕐&nbsp;&nbsp;&nbsp;Active</option>
              <option value="completed">✅&nbsp;&nbsp;&nbsp;Completed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block font-medium">Assigned to</label>
            <input
              type="text"
              value={assignedTo.username}
              onChange={(e) => handleChangeAssignedTo(e.target.value)}
              placeholder="User ID"
              className="w-full rounded border p-2 outline-none focus:border-gray-500"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">Deadline</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded border p-2 outline-none focus:border-gray-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block font-medium">Tags</label>
          <div
            className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded border px-2 py-1.5 focus-within:border-gray-500 cursor-text"
            onClick={() => document.getElementById("tag-input")?.focus()}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-gray-600"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={11} />
                </button>
              </span>
            ))}
            <input
              id="tag-input"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => tagInput && addTag(tagInput)}
              placeholder={tags.length === 0 ? "Add tags…" : ""}
              className="min-w-[80px] flex-1 border-none bg-transparent outline-none"
            />
          </div>
          <p className="mt-1 text-gray-400">Press Enter or comma to add a tag</p>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="rounded border px-4 py-2">
            Cancel
          </button>
          <button
            type="submit"
            disabled={createTask.isPending}
            className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {task ? "Update Changes" : createTask.isPending ? "Creating…" : "Create Task"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default CreateTaskDialog;