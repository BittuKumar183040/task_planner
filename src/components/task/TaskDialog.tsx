import { X } from "lucide-react";
import { useState } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import Dialog from "../layout/Dialog";

type Props = {
  open: boolean;
  onClose: () => void;
};

const CreateTaskDialog = ({ open, onClose }: Props) => {

  const { data: sessionData } = useSession();

  const utils = api.useUtils();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedToId, setAssignedToId] = useState<string | null>(sessionData?.user?.id ?? null);
  const [status, setStatus] = useState<"new" | "active" | "completed">("new");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const createTask = api.task.createTask.useMutation({
    onSuccess: async () => {
      await utils.task.getTasks.invalidate();
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("new");
      setDeadline(null);
      setAssignedToId(sessionData?.user?.id ?? null);
      setTags([]);
      onClose();
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
    await createTask.mutateAsync({
      title,
      description,
      priority,
      status,
      assignedToId: assignedToId ?? undefined,
      deadline: deadline ?? undefined,
      tags,
    });
  };

  if (!open) return null;

  return (
    <Dialog title="Create Task" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
              className="w-full rounded border px-3 py-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "new" | "active" | "completed")}
              className="w-full rounded border px-3 py-2"
            >
              <option value="new">New</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Assigned to</label>
            <input
              type="text"
              value={assignedToId ?? ""}
              onChange={(e) => setAssignedToId(e.target.value || null)}
              placeholder="User ID"
              className="w-full rounded border px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Deadline</label>
            <input
              type="date"
              value={deadline ? deadline.toISOString().split("T")[0] : ""}
              onChange={(e) =>
                setDeadline(e.target.value ? new Date(e.target.value) : null)
              }
              className="w-full rounded border px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Tags</label>
          <div
            className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded border px-2 py-1.5 focus-within:border-blue-500 cursor-text"
            onClick={() => document.getElementById("tag-input")?.focus()}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
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
              className="min-w-[80px] flex-1 border-none bg-transparent text-sm outline-none"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">Press Enter or comma to add a tag</p>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="rounded border px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            type="submit"
            disabled={createTask.isPending}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {createTask.isPending ? "Creating…" : "Create Task"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default CreateTaskDialog;